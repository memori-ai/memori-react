import { KnownFact, Memori } from '@memori.ai/memori-api-client/dist/types';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import memoriApiClient from '@memori.ai/memori-api-client';
import {
  Button,
  Checkbox,
  Input,
  Modal,
  Tooltip,
  useAlertManager,
  createAlertOptions,
} from '@memori.ai/ui';
import {
  Check,
  ChevronDown,
  Lightbulb,
  Search,
  Trash2,
} from 'lucide-react';
import { getErrori18nKey } from '../../helpers/error';
import { useDebounce } from '../../helpers/utils';
import {
  formatExactDateTime,
  formatRelativeTime,
} from '../../helpers/relativeTime';
import { useTranslation } from 'react-i18next';
import SideDrawer, { SideDrawerEmpty } from '../SideDrawer/SideDrawer';
import DrawerFooter from '../DrawerFooter/DrawerFooter';
import cx from 'classnames';

const PAGE_SIZE = 8;

export interface Props {
  apiClient: ReturnType<typeof memoriApiClient>;
  sessionID: string;
  memori: Memori;
  initialKnownFacts?: KnownFact[];
  /** When true, skips API fetching and only shows `initialKnownFacts` (useful for Storybook/mock UIs). */
  disableFetch?: boolean;
  visible?: boolean;
  closeDrawer: () => void;
}

const filterFacts = (facts: KnownFact[], query: string): KnownFact[] => {
  const needle = query.trim().toLowerCase();
  if (!needle) return facts;
  return facts.filter(fact => fact.text.toLowerCase().includes(needle));
};

const KnownFacts = ({
  apiClient,
  sessionID,
  memori,
  disableFetch = false,
  visible = true,
  initialKnownFacts = [],
  closeDrawer,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { add } = useAlertManager();
  const { getKnownFacts, getKnownFactsPaginated, deleteKnownFact } =
    apiClient.knownFacts;
  const initialKnownFactsRef = useRef(initialKnownFacts);
  initialKnownFactsRef.current = initialKnownFacts;

  const [knownFacts, setKnownFacts] = useState<KnownFact[]>(
    initialKnownFacts.slice(0, PAGE_SIZE)
  );
  const [knownFactsCount, setKnownFactsCount] = useState(
    initialKnownFacts.length
  );
  const [loadedCount, setLoadedCount] = useState(
    Math.min(PAGE_SIZE, initialKnownFacts.length)
  );
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const searchQuery = useDebounce(searchInput, 300);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteModalVisible, setBulkDeleteModalVisible] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [deleteModalVisibleFor, setDeleteModalVisibleFor] = useState<string>();
  const [singleDeleting, setSingleDeleting] = useState(false);

  const applyLocalPage = useCallback(
    (from: number, append: boolean) => {
      const filtered = filterFacts(initialKnownFactsRef.current, searchQuery);
      const next = filtered.slice(0, from + PAGE_SIZE);
      setKnownFacts(next);
      setKnownFactsCount(filtered.length);
      setLoadedCount(next.length);
      if (!append) {
        setSelectedIds(ids => ids.filter(id => next.some(f => f.knownFactID === id)));
      }
    },
    [searchQuery]
  );

  const fetchKnownFacts = useCallback(
    async ({
      from = 0,
      append = false,
    }: { from?: number; append?: boolean } = {}) => {
      if (disableFetch) {
        applyLocalPage(from, append);
        return;
      }
      if (!sessionID) return;

      append ? setLoadingMore(true) : setLoading(true);
      try {
        if (searchQuery.trim()) {
          const { knownFacts: allFacts, count, ...response } =
            await getKnownFacts(sessionID);
          if (response.resultCode !== 0) {
            add(
              createAlertOptions({
                description: t(getErrori18nKey(response.resultCode)),
                severity: 'error',
              })
            );
          }
          const filtered = filterFacts(
            Array.isArray(allFacts) ? allFacts : [],
            searchQuery
          );
          const next = filtered.slice(0, from + PAGE_SIZE);
          setKnownFacts(next);
          setKnownFactsCount(filtered.length || count || 0);
          setLoadedCount(next.length);
        } else {
          const { knownFacts: page, count, ...response } =
            await getKnownFactsPaginated(sessionID, from, PAGE_SIZE);
          if (response.resultCode !== 0) {
            add(
              createAlertOptions({
                description: t(getErrori18nKey(response.resultCode)),
                severity: 'error',
              })
            );
          }
          const items = Array.isArray(page) ? page : [];
          setKnownFacts(prev => (append ? [...prev, ...items] : items));
          setKnownFactsCount(count ?? 0);
          setLoadedCount(from + items.length);
        }
      } catch (err) {
        console.error('KNOWN_FACTS/FETCH', err);
        if (!append) {
          setKnownFacts([]);
          setKnownFactsCount(0);
          setLoadedCount(0);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [
      add,
      applyLocalPage,
      disableFetch,
      getKnownFacts,
      getKnownFactsPaginated,
      searchQuery,
      sessionID,
      t,
    ]
  );

  useEffect(() => {
    void fetchKnownFacts({ from: 0, append: false });
    // Fetch when the query or session changes, not when the callback identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionID, searchQuery, disableFetch]);

  useEffect(() => {
    setSelectMode(false);
    setSelectedIds([]);
  }, [searchQuery]);

  const selectedRowsLabel = useMemo(
    () =>
      t('knownFacts.selected', {
        count: selectedIds.length,
        defaultValue: t('knownFacts.selectedRows', {
          count: selectedIds.length,
        }),
      }),
    [selectedIds.length, t]
  );

  const hasFacts = knownFactsCount > 0 || knownFacts.length > 0;
  const hasMore = loadedCount < knownFactsCount;
  const isEmpty = !loading && !searchQuery.trim() && knownFacts.length === 0;
  const noSearchResults =
    !loading && !!searchQuery.trim() && knownFacts.length === 0;

  const toggleSelected = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const deleteFacts = async (ids: string[]) => {
    if (ids.length === 0) return;
    if (disableFetch) {
      const remaining = initialKnownFactsRef.current.filter(
        fact => !ids.includes(fact.knownFactID)
      );
      initialKnownFactsRef.current = remaining;
      applyLocalPage(0, false);
      return true;
    }

    const responses = await Promise.all(
      ids.map(id => deleteKnownFact(sessionID, id))
    );
    if (responses.every(r => r.resultCode === 0)) {
      add(
        createAlertOptions({
          description: t('knownFacts.deleteSuccess'),
          severity: 'success',
        })
      );
      await fetchKnownFacts({ from: 0, append: false });
      return true;
    }
    const errored = responses.find(r => r.resultCode !== 0);
    if (errored?.resultCode !== undefined) {
      add(
        createAlertOptions({
          description: t(getErrori18nKey(errored.resultCode)),
          severity: 'error',
        })
      );
    }
    return false;
  };

  const footer =
    hasFacts && !isEmpty ? (
      <DrawerFooter
        start={
          <span className="memori-known-facts-count">
            {t('knownFacts.shownOfTotal', {
              shown: knownFacts.length,
              total: knownFactsCount,
            })}
          </span>
        }
        end={
          hasMore ? (
            <Button
              variant="outline"
              loading={loadingMore}
              disabled={loadingMore}
              icon={<ChevronDown aria-hidden />}
              iconPosition="right"
              onClick={() =>
                void fetchKnownFacts({ from: loadedCount, append: true })
              }
            >
              {t('knownFacts.loadMore')}
            </Button>
          ) : undefined
        }
      />
    ) : undefined;

  return (
    <SideDrawer
      open={visible}
      size="md"
      className="memori-known-facts-drawer"
      title={t('knownFacts.title')}
      description={t('knownFacts.description', {
        memoriName: memori.name,
      })}
      closeLabel={t('close') || 'Close'}
      footer={footer}
      onClose={closeDrawer}
    >
      {!isEmpty && (
        <div className="memori-known-facts-toolbar">
          <div className="memori-known-facts-search">
            <Search aria-hidden className="memori-known-facts-search__icon" />
            <label className="memori-sr-only" htmlFor="memori-known-facts-search">
              {t('knownFacts.searchPlaceholder')}
            </label>
            <Input
              id="memori-known-facts-search"
              fullWidth
              value={searchInput}
              placeholder={t('knownFacts.searchPlaceholder') || ''}
              onValueChange={setSearchInput}
            />
          </div>
          <Button
            variant="outline"
            active={selectMode}
            icon={<Check aria-hidden />}
            onClick={() => {
              setSelectMode(on => !on);
              setSelectedIds([]);
            }}
          >
            {t('knownFacts.select')}
          </Button>
          {hasFacts && (
            <span className="memori-known-facts-total">
              {t('knownFacts.factsCount', { count: knownFactsCount })}
            </span>
          )}
        </div>
      )}

      {selectMode && selectedIds.length > 0 && (
        <div
          className="memori-known-facts-selection-bar"
          role="region"
          aria-label={selectedRowsLabel}
        >
          <span className="memori-known-facts-selection-bar__count">
            {selectedRowsLabel}
          </span>
          <div className="memori-known-facts-selection-bar__actions">
            <Button
              variant="outline"
              className="memori-known-facts-selection-bar__delete"
              icon={<Trash2 aria-hidden />}
              onClick={() => setBulkDeleteModalVisible(true)}
            >
              {t('delete')}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedIds([]);
                setSelectMode(false);
              }}
            >
              {t('cancel')}
            </Button>
          </div>
        </div>
      )}

      {isEmpty && (
        <SideDrawerEmpty
          icon={<Lightbulb />}
          title={t('knownFacts.emptyTitle')}
          description={t('knownFacts.emptyDescription')}
        />
      )}

      {noSearchResults && (
        <SideDrawerEmpty
          icon={<Search />}
          title={t('write_and_speak.noResultsFound', {
            searchText: searchQuery,
          })}
        />
      )}

      {!isEmpty && !noSearchResults && (
        <ul
          className="memori-known-facts-list"
          aria-busy={loading || undefined}
        >
          {knownFacts.map(fact => {
            const isSelected = selectedIds.includes(fact.knownFactID);
            const relative = fact.creationTimestamp
              ? formatRelativeTime(fact.creationTimestamp, i18n.language)
              : '';
            const exact = fact.creationTimestamp
              ? formatExactDateTime(fact.creationTimestamp, i18n.language)
              : '';

            return (
              <li key={fact.knownFactID}>
                {selectMode ? (
                  <label
                    className={cx('memori-known-facts-card', {
                      'memori-known-facts-card--selected': isSelected,
                    })}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleSelected(fact.knownFactID)}
                      aria-label={t('selected') || undefined}
                    />
                    <span className="memori-known-facts-card__text">
                      {fact.text}
                    </span>
                  </label>
                ) : (
                  <article className="memori-known-facts-card">
                    <div className="memori-known-facts-card__content">
                      <p className="memori-known-facts-card__text">{fact.text}</p>
                      {relative && (
                        <Tooltip title={exact} placement="bottom">
                          <time
                            className="memori-known-facts-card__date"
                            dateTime={fact.creationTimestamp}
                          >
                            {relative}
                          </time>
                        </Tooltip>
                      )}
                    </div>
                    <div className="memori-known-facts-card__actions">
                      <Button
                        variant="ghost"
                        shape="circle"
                        size="sm"
                        className="memori-known-facts-card__delete"
                        aria-label={t('knownFacts.deleteLabel') || undefined}
                        title={t('delete') || ''}
                        icon={<Trash2 aria-hidden />}
                        onClick={() =>
                          setDeleteModalVisibleFor(fact.knownFactID)
                        }
                      />
                    </div>
                  </article>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        className="memori-known-facts-modal"
        stacking="stacked"
        open={bulkDeleteModalVisible}
        closable
        title={
          selectedIds.length > 1
            ? t('knownFacts.deleteSelectedConfirmTitle')
            : t('knownFacts.deleteConfirmTitle')
        }
        description={`${selectedRowsLabel}. ${t(
          'knownFacts.deleteSelectedConfirmMessage',
          { number: selectedIds.length }
        )}`}
        onOpenChange={(open: boolean) => {
          if (!open) setBulkDeleteModalVisible(false);
        }}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setBulkDeleteModalVisible(false)}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="danger"
              loading={bulkDeleting}
              disabled={bulkDeleting}
              onClick={async () => {
                setBulkDeleting(true);
                try {
                  const ok = await deleteFacts(selectedIds);
                  if (ok) {
                    setSelectedIds([]);
                    setSelectMode(false);
                    setBulkDeleteModalVisible(false);
                  }
                } finally {
                  setBulkDeleting(false);
                }
              }}
            >
              {t('confirm')}
            </Button>
          </>
        }
      />

      <Modal
        className="memori-known-facts-modal"
        stacking="stacked"
        open={deleteModalVisibleFor !== undefined}
        closable
        title={t('knownFacts.deleteConfirmTitle')}
        description={t('knownFacts.deleteConfirmMessage')}
        onOpenChange={(open: boolean) => {
          if (!open) setDeleteModalVisibleFor(undefined);
        }}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setDeleteModalVisibleFor(undefined)}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="danger"
              loading={singleDeleting}
              disabled={singleDeleting}
              onClick={async () => {
                if (!deleteModalVisibleFor) return;
                setSingleDeleting(true);
                try {
                  const ok = await deleteFacts([deleteModalVisibleFor]);
                  if (ok) setDeleteModalVisibleFor(undefined);
                } finally {
                  setSingleDeleting(false);
                }
              }}
            >
              {t('confirm')}
            </Button>
          </>
        }
      />
    </SideDrawer>
  );
};

export default KnownFacts;
