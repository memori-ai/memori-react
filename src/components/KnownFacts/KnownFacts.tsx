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
  Drawer,
  Spin,
  Modal,
  Table,
  useAlertManager,
  createAlertOptions,
} from '@memori.ai/ui';
import type {
  ColumnDef,
  PaginationState,
  Updater,
} from '@tanstack/react-table';
import { getErrori18nKey } from '../../helpers/error';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';

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
  const { getKnownFactsPaginated, deleteKnownFact } = apiClient.knownFacts;
  const initialKnownFactsRef = useRef(initialKnownFacts);
  initialKnownFactsRef.current = initialKnownFacts;

  const [knownFacts, setKnownFacts] = useState<KnownFact[]>(initialKnownFacts);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [knownFactsCount, setKnownFactsCount] = useState(
    initialKnownFacts?.length ?? 0
  );
  const [loading, setLoading] = useState(false);

  /**
   * Paginated fetch. Pass `from` / `howMany` when they must not use current `pagination`
   * (e.g. immediately after resetting page index).
   */
  const fetchKnownFacts = useCallback(
    async (sessionId?: string, from?: number, howMany?: number) => {
      if (!sessionID && !sessionId) return;
      setLoading(true);
      try {
        const fromParam = from ?? pagination.pageIndex * pagination.pageSize;
        const howManyParam = howMany ?? pagination.pageSize;
        const { knownFacts, count, ...response } = await getKnownFactsPaginated(
          sessionId ?? sessionID,
          fromParam,
          howManyParam
        );

        // When the API returns no items (e.g. after bulk delete), we must clear the table,
        // not fall back to the initial props which may be stale.
        setKnownFacts(Array.isArray(knownFacts) ? knownFacts : []);
        setKnownFactsCount(count ?? 0);

        if (response.resultCode !== 0) {
          console.error(response);
          add(
            createAlertOptions({
              description: t(getErrori18nKey(response.resultCode)),
              severity: 'error',
            })
          );
        }
      } catch (err) {
        console.error('KNOWN_FACTS/FETCH', err);
        setKnownFacts([]);
      }

      setLoading(false);
    },
    [
      add,
      getKnownFactsPaginated,
      pagination.pageIndex,
      pagination.pageSize,
      sessionID,
      t,
    ]
  );

  useEffect(() => {
    if (disableFetch) return;
    void fetchKnownFacts();
  }, [fetchKnownFacts, disableFetch]);

  const [bulkDeleteModalVisible, setBulkDeleteModalVisible] = useState(false);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);
  const [deleteModalVisibleFor, setDeleteModalVisibleFor] = useState<string>();

  const columns = useMemo<ColumnDef<KnownFact>[]>(
    () => [
      {
        accessorKey: 'text',
        header: () => t('knownFacts.text'),
        cell: ({ row }) => (
          <span className="memori-known-facts-text-cell">
            {row.original.text}
          </span>
        ),
        meta: { disableHiding: true },
        enableSorting: false
      },
      {
        id: 'createdAt',
        accessorKey: 'creationTimestamp',
        header: () => t('createdAt'),
        cell: ({ row }) => (
          <span className="memori-known-facts-date-cell memori--table--date mobile-hidden">
            {row.original.creationTimestamp
              ? new Intl.DateTimeFormat(i18n.language, {
                  dateStyle: 'short',
                  timeStyle: 'short',
                }).format(new Date(row.original.creationTimestamp))
              : '-'}
          </span>
        ),
        meta: { disableHiding: true },
        enableSorting: false
      },
    ],
    [t, i18n.language]
  );

  /** Keep pagination mounted whenever there is data so page size never fights `enablePagination` toggling. */
  const showPagination = knownFactsCount > 0;

  return (
    <Drawer
      open={visible}
      anchor="right"
      className="memori-known-facts-drawer"
      onOpenChange={() => closeDrawer()}
      title={t('knownFacts.title')}
      description={t('knownFacts.description', {
        memoriName: memori.name,
      })}
      size="md"
    >
        <div className="memori-known-facts-body">
          <Modal
          className="memori-known-facts-modal"
          open={bulkDeleteModalVisible}
          closable
          title={
            bulkDeleteIds.length > 1
              ? t('knownFacts.deleteSelectedConfirmTitle')
              : t('knownFacts.deleteConfirmTitle')
          }
          description={
            bulkDeleteIds.length > 1
              ? t('knownFacts.deleteSelectedConfirmMessage', {
                  number: bulkDeleteIds.length,
                })
              : t('knownFacts.deleteConfirmMessage')
          }
          onOpenChange={(open: boolean) => {
            if (!open) {
              setBulkDeleteModalVisible(false);
              setBulkDeleteIds([]);
            }
          }}
          footer={
            <>
              <Button
                variant="ghost"
                onClick={() => {
                  setBulkDeleteModalVisible(false);
                  setBulkDeleteIds([]);
                }}
              >
                {t('cancel')}
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  try {
                    const mutations = bulkDeleteIds.map(knownFactID =>
                      deleteKnownFact(sessionID, knownFactID)
                    );
                    const responses = await Promise.all(mutations);
                    if (responses.every(r => r.resultCode === 0)) {
                      add(
                        createAlertOptions({
                          description: t('knownFacts.deleteSuccess'),
                          severity: 'success',
                        })
                      );
                      setBulkDeleteIds([]);
                      setBulkDeleteModalVisible(false);
                      if (pagination.pageIndex !== 0) {
                        setPagination(p => ({ ...p, pageIndex: 0 }));
                      } else {
                        await fetchKnownFacts(undefined, 0, pagination.pageSize);
                      }
                    } else {
                      const errored = responses.find(r => r.resultCode !== 0);
                      console.error(errored);
                      if (errored?.resultCode !== undefined)
                        add(
                          createAlertOptions({
                            description: t(getErrori18nKey(errored.resultCode)),
                            severity: 'error',
                          })
                        );
                    }
                  } catch (_e) {
                    const error = _e as Error;
                    add(
                      createAlertOptions({
                        description: t('Error') + error.message,
                        severity: 'error',
                      })
                    );
                  }
                }}
              >
                {t('confirm')}
              </Button>
            </>
          }
        />

        <Table<KnownFact>
          className="memori-known-facts-table-wrapper"
          data={knownFacts}
          columns={columns}
          getRowId={row => row.knownFactID}
          isLoading={loading}
          rowActionsVariant='inline'
          maxBodyHeight="75vh"
          bulkActions={[
            {
              label: t('delete'),
              icon: <Trash2 />,
              variant: 'danger',
              onClick: rows => {
                const ids = rows.map(r => r.original.knownFactID);
                if (ids.length === 0) return;
                setBulkDeleteIds(ids);
                setBulkDeleteModalVisible(true);
              },
            },
          ]}
          
          rowActions={[
            {
              label: t('delete'),
              icon: <Trash2 />,
              variant: 'danger',
              onClick: row =>
                setDeleteModalVisibleFor(row.original.knownFactID),
            },
          ]}
          {...(showPagination
            ? {
                enablePagination: true,
                manualPagination: true,
                
                rowCount: knownFactsCount,
                pagination,
                onPaginationChange: (updater: Updater<PaginationState>) => {
                  setPagination(
                    (prev): PaginationState =>
                      typeof updater === 'function' ? updater(prev) : updater
                  );
                },
                initialPageSize: 10,
                pageSizeOptions: [10,25,50,100],
              }
            : { enablePagination: false })}
        />

        <Modal
          className="memori-known-facts-modal"
          open={deleteModalVisibleFor !== undefined}
          closable
          title={t('knownFacts.deleteConfirmTitle')}
          description={t('knownFacts.deleteConfirmMessage')}
          onOpenChange={(open: boolean) => {
            if (!open) {
              setDeleteModalVisibleFor(undefined);
            }
          }}
          footer={
            <>
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteModalVisibleFor(undefined);
                }}
              >
                {t('cancel')}
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  if (!deleteModalVisibleFor) return;
                  const kfId = deleteModalVisibleFor;
                  try {
                    const response = await deleteKnownFact(sessionID, kfId);
                    if (response.resultCode === 0) {
                      add(
                        createAlertOptions({
                          description: t('knownFacts.deleteSuccess'),
                          severity: 'success',
                        })
                      );
                      setDeleteModalVisibleFor(undefined);
                      await fetchKnownFacts();
                    } else {
                      console.error(response);
                      add(
                        createAlertOptions({
                          description: t(getErrori18nKey(response.resultCode), {
                            ns: 'common',
                          }),
                          severity: 'error',
                        })
                      );
                    }
                  } catch (_e) {
                    const error = _e as Error;
                    add(
                      createAlertOptions({
                        description: t('Error') + error.message,
                        severity: 'error',
                      })
                    );
                  }
                }}
              >
                {t('confirm')}
              </Button>
            </>
          }
        />
        </div>
    </Drawer>
  );
};

export default KnownFacts;
