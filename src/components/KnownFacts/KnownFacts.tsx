import { KnownFact, Memori } from '@memori.ai/memori-api-client/dist/types';
import { useEffect, useState } from 'react';
import memoriApiClient from '@memori.ai/memori-api-client';
import Button from '../ui/Button';
import Drawer from '../ui/Drawer';
import Spin from '../ui/Spin';
import Modal from '../ui/Modal';
import toast from 'react-hot-toast';
import { getErrori18nKey } from '../../helpers/error';
import { useTranslation } from 'react-i18next';
import Delete from '../icons/Delete';
import Checkbox from '../ui/Checkbox';
import Select from '../ui/Select';
import ChevronLeft from '../icons/ChevronLeft';
import ChevronRight from '../icons/ChevronRight';

export interface Props {
  apiClient: ReturnType<typeof memoriApiClient>;
  sessionID: string;
  memori: Memori;
  initialKnownFacts?: KnownFact[];
  visible?: boolean;
  closeDrawer: () => void;
}

const KnownFacts = ({
  apiClient,
  sessionID,
  memori,
  visible = true,
  initialKnownFacts = [],
  closeDrawer,
}: Props) => {
  const { t } = useTranslation();

  const { getKnownFactsPaginated, deleteKnownFact } = apiClient.knownFacts;

  const [knownFacts, setKnownFacts] = useState<KnownFact[]>(initialKnownFacts);
  const [numberOfResults, setNumberOfResults] = useState(25);
  const [pageIndex, setPageIndex] = useState(0);
  const [knownFactsCount, setKnownFactsCount] = useState(
    initialKnownFacts?.length ?? 0
  );
  const [loading, setLoading] = useState(false);

  /**
   * Fetch known facts
   */
  const fetchKnownFacts = async (
    sessionId?: string,
    from?: number,
    howMany?: number
  ) => {
    if (!sessionID && !sessionId) return;
    setLoading(true);
    try {
      const { knownFacts, count, ...response } = await getKnownFactsPaginated(
        sessionId ?? sessionID,
        from ?? pageIndex,
        howMany ?? numberOfResults
      );

      setKnownFacts(knownFacts ?? []);
      setKnownFactsCount(count ?? 0);

      if (response.resultCode !== 0) {
        console.error(response);
        toast.error(t(getErrori18nKey(response.resultCode)));
      }
    } catch (err) {
      console.error('KNOWN_FACTS/FETCH', err);
      setKnownFacts(initialKnownFacts ?? []);
    }

    setLoading(false);
  };
  useEffect(() => {
    fetchKnownFacts();
  }, []);

  /**
   * Table selection
   */
  const [bulkDeleteModalVisible, setBulkDeleteModalVisible] = useState(false);
  const [deleteModalVisibleFor, setDeleteModalVisibleFor] = useState<string>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(
    []
  );

  return (
    <Drawer
      open={visible}
      width="80%"
      className="memori-known-facts-drawer"
      onClose={() => closeDrawer()}
      title={t('knownFacts.title')}
    >
      <p>
        {t('knownFacts.description', {
          memoriName: memori.name,
        })}
      </p>

      <Spin spinning={loading}>
        <div className="memori-known-facts-actions">
          <Button
            primary
            danger
            onClick={() => {
              setBulkDeleteModalVisible(true);
            }}
            className="memori-known-facts-delete-selected"
            disabled={selectedRowKeys?.length === 0}
            icon={<Delete />}
            loading={loading}
          >
            {t('selected')} ({selectedRowKeys?.length})
          </Button>
          <Modal
            className="memori-known-facts-modal"
            open={bulkDeleteModalVisible}
            closable
            title={
              selectedRowKeys.length > 1
                ? t('knownFacts.deleteSelectedConfirmTitle')
                : t('knownFacts.deleteConfirmTitle')
            }
            description={
              selectedRowKeys.length > 1
                ? t('knownFacts.deleteSelectedConfirmMessage', {
                    number: selectedRowKeys.length,
                  })
                : t('knownFacts.deleteConfirmMessage')
            }
            onClose={() => {
              setBulkDeleteModalVisible(false);
            }}
            footer={
              <>
                <Button
                  ghost
                  onClick={() => {
                    setBulkDeleteModalVisible(false);
                  }}
                >
                  {t('cancel')}
                </Button>
                <Button
                  primary
                  danger
                  onClick={async () => {
                    try {
                      const mutations = selectedRowKeys.map(key => {
                        let knownFactID = key as string;
                        return deleteKnownFact(sessionID, knownFactID);
                      });
                      Promise.all(mutations).then(responses => {
                        if (responses.every(r => r.resultCode === 0)) {
                          toast.success(t('knownFacts.deleteSuccess'));
                          setSelectedRowKeys([]);
                          fetchKnownFacts();
                          setBulkDeleteModalVisible(false);
                        } else {
                          let errored = responses.find(r => r.resultCode !== 0);
                          console.error(errored);
                          if (errored?.resultCode !== undefined)
                            toast.error(
                              t(getErrori18nKey(errored?.resultCode))
                            );
                        }
                      });
                    } catch (_e) {
                      let error = _e as Error;
                      toast.error(t('Error') + error.message);
                    }
                  }}
                >
                  {t('confirm')}
                </Button>
              </>
            }
          />
        </div>

        {knownFactsCount > 25 && (
          <nav className="memori--table--pagination">
            {knownFactsCount > numberOfResults && (
              <div className="memori--table--pagination--pages">
                <Button
                  shape="circle"
                  disabled={pageIndex === 0 || pageIndex < numberOfResults}
                  padded={false}
                  title={t('previous') || 'Previous'}
                  icon={<ChevronLeft />}
                  onClick={() => {
                    let from =
                      (pageIndex / numberOfResults - 1) * numberOfResults;
                    setPageIndex(from);
                    fetchKnownFacts(undefined, from, numberOfResults);
                  }}
                />
                <span className="memori--table--pagination--pages--current">
                  {Math.ceil(pageIndex / numberOfResults) + 1} /{' '}
                  {Math.ceil(knownFactsCount / numberOfResults)}
                </span>
                <Button
                  shape="circle"
                  padded={false}
                  title={t('next') || 'Next'}
                  icon={<ChevronRight />}
                  disabled={
                    (pageIndex / numberOfResults + 1) * numberOfResults >=
                    knownFactsCount
                  }
                  onClick={() => {
                    let from =
                      (pageIndex / numberOfResults + 1) * numberOfResults;
                    setPageIndex(from);
                    fetchKnownFacts(undefined, from, numberOfResults);
                  }}
                />
              </div>
            )}

            <Select
              options={[
                { label: `25 / ${t('page') || 'page'}`, value: 25 },
                { label: `50 / ${t('page') || 'page'}`, value: 50 },
                { label: `100 / ${t('page') || 'page'}`, value: 100 },
              ]}
              value={numberOfResults}
              displayValue={`${numberOfResults} / ${t('page') || 'page'}`}
              onChange={value => {
                setNumberOfResults(value);
                setPageIndex(0);
                fetchKnownFacts(undefined, 0, value);
              }}
            />
          </nav>
        )}
        <table className="memori--table">
          <thead>
            <tr>
              <th className="memori--table--column-centered">
                <Checkbox
                  checked={
                    !!knownFacts?.length &&
                    selectedRowKeys?.length === knownFacts.length
                  }
                  indeterminate={
                    !!knownFacts?.length &&
                    !!selectedRowKeys?.length &&
                    selectedRowKeys?.length !== knownFacts?.length
                  }
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedRowKeys(knownFacts.map(kf => kf.knownFactID));
                    } else {
                      setSelectedRowKeys([]);
                    }
                  }}
                />
              </th>
              <th>{t('knownFacts.text')}</th>
              <th className="mobile-hidden">{t('createdAt')}</th>
              <th className="memori--table--column-right">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {knownFacts.map(kf => (
              <tr key={kf.knownFactID}>
                <th className="memori--table--column-centered">
                  <Checkbox
                    checked={selectedRowKeys?.includes(kf.knownFactID)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedRowKeys(srk => [
                          ...new Set([...srk, kf.knownFactID]),
                        ]);
                      } else {
                        setSelectedRowKeys(
                          srk =>
                            srk.filter(
                              key => key !== kf.knownFactID
                            ) as string[]
                        );
                      }
                    }}
                  />
                </th>
                <td>{kf.text}</td>
                <td className="mobile-hidden">
                  <span className="memori--table--date">
                    {kf.creationTimestamp
                      ? new Intl.DateTimeFormat('it', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        }).format(new Date(kf.creationTimestamp))
                      : '-'}
                  </span>
                </td>
                <td className="memori--table--column-right">
                  <div className="memori--table--action-column">
                    <Button
                      danger
                      ghost
                      shape="circle"
                      icon={<Delete />}
                      disabled={selectedRowKeys?.length > 0}
                      title={t('delete') || 'Delete'}
                      onClick={() => setDeleteModalVisibleFor(kf.knownFactID)}
                    />
                    <Modal
                      className="memori-known-facts-modal"
                      open={deleteModalVisibleFor === kf.knownFactID}
                      closable
                      title={t('knownFacts.deleteConfirmTitle')}
                      description={t('knownFacts.deleteConfirmMessage')}
                      onClose={() => {
                        setDeleteModalVisibleFor(undefined);
                      }}
                      footer={
                        <>
                          <Button
                            ghost
                            onClick={() => {
                              setDeleteModalVisibleFor(undefined);
                            }}
                          >
                            {t('cancel')}
                          </Button>
                          <Button
                            primary
                            danger
                            onClick={async () => {
                              try {
                                const response = await deleteKnownFact(
                                  sessionID,
                                  kf.knownFactID
                                );
                                if (response.resultCode === 0) {
                                  toast.success(t('knownFacts.deleteSuccess'));
                                  setSelectedRowKeys([]);
                                  fetchKnownFacts();
                                  setDeleteModalVisibleFor(undefined);
                                } else {
                                  console.error(response);
                                  toast.error(
                                    t(getErrori18nKey(response.resultCode), {
                                      ns: 'common',
                                    })
                                  );
                                }
                              } catch (_e) {
                                let error = _e as Error;
                                toast.error(t('Error') + error.message);
                              }
                            }}
                          >
                            {t('confirm')}
                          </Button>
                        </>
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Spin>
    </Drawer>
  );
};

export default KnownFacts;
