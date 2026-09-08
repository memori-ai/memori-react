import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
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
const KnownFacts = ({ apiClient, sessionID, memori, visible = true, initialKnownFacts = [], closeDrawer, }) => {
    var _a;
    const { t } = useTranslation();
    const { getKnownFactsPaginated, deleteKnownFact } = apiClient.knownFacts;
    const [knownFacts, setKnownFacts] = useState(initialKnownFacts);
    const [numberOfResults, setNumberOfResults] = useState(25);
    const [pageIndex, setPageIndex] = useState(0);
    const [knownFactsCount, setKnownFactsCount] = useState((_a = initialKnownFacts === null || initialKnownFacts === void 0 ? void 0 : initialKnownFacts.length) !== null && _a !== void 0 ? _a : 0);
    const [loading, setLoading] = useState(false);
    const fetchKnownFacts = async (sessionId, from, howMany) => {
        if (!sessionID && !sessionId)
            return;
        setLoading(true);
        try {
            const { knownFacts, count, ...response } = await getKnownFactsPaginated(sessionId !== null && sessionId !== void 0 ? sessionId : sessionID, from !== null && from !== void 0 ? from : pageIndex, howMany !== null && howMany !== void 0 ? howMany : numberOfResults);
            setKnownFacts(knownFacts !== null && knownFacts !== void 0 ? knownFacts : initialKnownFacts);
            setKnownFactsCount(count !== null && count !== void 0 ? count : 0);
            if (response.resultCode !== 0) {
                console.error(response);
                toast.error(t(getErrori18nKey(response.resultCode)));
            }
        }
        catch (err) {
            console.error('KNOWN_FACTS/FETCH', err);
            setKnownFacts(initialKnownFacts !== null && initialKnownFacts !== void 0 ? initialKnownFacts : []);
        }
        setLoading(false);
    };
    useEffect(() => {
        fetchKnownFacts();
    }, []);
    const [bulkDeleteModalVisible, setBulkDeleteModalVisible] = useState(false);
    const [deleteModalVisibleFor, setDeleteModalVisibleFor] = useState();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    return (_jsxs(Drawer, { open: visible, width: "80%", className: "memori-known-facts-drawer", onClose: () => closeDrawer(), title: t('knownFacts.title'), children: [_jsx("p", { children: t('knownFacts.description', {
                    memoriName: memori.name,
                }) }), _jsxs(Spin, { spinning: loading, children: [_jsxs("div", { className: "memori-known-facts-actions", children: [_jsxs(Button, { primary: true, danger: true, onClick: () => {
                                    setBulkDeleteModalVisible(true);
                                }, className: "memori-known-facts-delete-selected", disabled: (selectedRowKeys === null || selectedRowKeys === void 0 ? void 0 : selectedRowKeys.length) === 0, icon: _jsx(Delete, {}), loading: loading, children: [t('selected'), " (", selectedRowKeys === null || selectedRowKeys === void 0 ? void 0 : selectedRowKeys.length, ")"] }), _jsx(Modal, { className: "memori-known-facts-modal", open: bulkDeleteModalVisible, closable: true, title: selectedRowKeys.length > 1
                                    ? t('knownFacts.deleteSelectedConfirmTitle')
                                    : t('knownFacts.deleteConfirmTitle'), description: selectedRowKeys.length > 1
                                    ? t('knownFacts.deleteSelectedConfirmMessage', {
                                        number: selectedRowKeys.length,
                                    })
                                    : t('knownFacts.deleteConfirmMessage'), onClose: () => {
                                    setBulkDeleteModalVisible(false);
                                }, footer: _jsxs(_Fragment, { children: [_jsx(Button, { ghost: true, onClick: () => {
                                                setBulkDeleteModalVisible(false);
                                            }, children: t('cancel') }), _jsx(Button, { primary: true, danger: true, onClick: async () => {
                                                try {
                                                    const mutations = selectedRowKeys.map(key => {
                                                        let knownFactID = key;
                                                        return deleteKnownFact(sessionID, knownFactID);
                                                    });
                                                    Promise.all(mutations).then(responses => {
                                                        if (responses.every(r => r.resultCode === 0)) {
                                                            toast.success(t('knownFacts.deleteSuccess'));
                                                            setSelectedRowKeys([]);
                                                            fetchKnownFacts();
                                                            setBulkDeleteModalVisible(false);
                                                        }
                                                        else {
                                                            let errored = responses.find(r => r.resultCode !== 0);
                                                            console.error(errored);
                                                            if ((errored === null || errored === void 0 ? void 0 : errored.resultCode) !== undefined)
                                                                toast.error(t(getErrori18nKey(errored === null || errored === void 0 ? void 0 : errored.resultCode)));
                                                        }
                                                    });
                                                }
                                                catch (_e) {
                                                    let error = _e;
                                                    toast.error(t('Error') + error.message);
                                                }
                                            }, children: t('confirm') })] }) })] }), knownFactsCount > 25 && (_jsxs("nav", { className: "memori--table--pagination", children: [knownFactsCount > numberOfResults && (_jsxs("div", { className: "memori--table--pagination--pages", children: [_jsx(Button, { shape: "circle", disabled: pageIndex === 0 || pageIndex < numberOfResults, padded: false, title: t('previous') || 'Previous', icon: _jsx(ChevronLeft, {}), onClick: () => {
                                            let from = (pageIndex / numberOfResults - 1) * numberOfResults;
                                            setPageIndex(from);
                                            fetchKnownFacts(undefined, from, numberOfResults);
                                        } }), _jsxs("span", { className: "memori--table--pagination--pages--current", children: [Math.ceil(pageIndex / numberOfResults) + 1, " /", ' ', Math.ceil(knownFactsCount / numberOfResults)] }), _jsx(Button, { shape: "circle", padded: false, title: t('next') || 'Next', icon: _jsx(ChevronRight, {}), disabled: (pageIndex / numberOfResults + 1) * numberOfResults >=
                                            knownFactsCount, onClick: () => {
                                            let from = (pageIndex / numberOfResults + 1) * numberOfResults;
                                            setPageIndex(from);
                                            fetchKnownFacts(undefined, from, numberOfResults);
                                        } })] })), _jsx(Select, { options: [
                                    { label: `25 / ${t('page') || 'page'}`, value: 25 },
                                    { label: `50 / ${t('page') || 'page'}`, value: 50 },
                                    { label: `100 / ${t('page') || 'page'}`, value: 100 },
                                ], value: numberOfResults, displayValue: `${numberOfResults} / ${t('page') || 'page'}`, onChange: value => {
                                    setNumberOfResults(value);
                                    setPageIndex(0);
                                    fetchKnownFacts(undefined, 0, value);
                                } })] })), _jsxs("table", { className: "memori--table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "memori--table--column-centered", children: _jsx(Checkbox, { checked: !!(knownFacts === null || knownFacts === void 0 ? void 0 : knownFacts.length) &&
                                                    (selectedRowKeys === null || selectedRowKeys === void 0 ? void 0 : selectedRowKeys.length) === knownFacts.length, indeterminate: !!(knownFacts === null || knownFacts === void 0 ? void 0 : knownFacts.length) &&
                                                    !!(selectedRowKeys === null || selectedRowKeys === void 0 ? void 0 : selectedRowKeys.length) &&
                                                    (selectedRowKeys === null || selectedRowKeys === void 0 ? void 0 : selectedRowKeys.length) !== (knownFacts === null || knownFacts === void 0 ? void 0 : knownFacts.length), onChange: e => {
                                                    if (e.target.checked) {
                                                        setSelectedRowKeys(knownFacts.map(kf => kf.knownFactID));
                                                    }
                                                    else {
                                                        setSelectedRowKeys([]);
                                                    }
                                                } }) }), _jsx("th", { children: t('knownFacts.text') }), _jsx("th", { className: "mobile-hidden", children: t('createdAt') }), _jsx("th", { className: "memori--table--column-right", children: t('actions') })] }) }), _jsx("tbody", { children: knownFacts.map(kf => (_jsxs("tr", { children: [_jsx("th", { className: "memori--table--column-centered", children: _jsx(Checkbox, { checked: selectedRowKeys === null || selectedRowKeys === void 0 ? void 0 : selectedRowKeys.includes(kf.knownFactID), onChange: e => {
                                                    if (e.target.checked) {
                                                        setSelectedRowKeys(srk => [
                                                            ...new Set([...srk, kf.knownFactID]),
                                                        ]);
                                                    }
                                                    else {
                                                        setSelectedRowKeys(srk => srk.filter(key => key !== kf.knownFactID));
                                                    }
                                                } }) }), _jsx("td", { children: kf.text }), _jsx("td", { className: "mobile-hidden", children: _jsx("span", { className: "memori--table--date", children: kf.creationTimestamp
                                                    ? new Intl.DateTimeFormat('it', {
                                                        dateStyle: 'short',
                                                        timeStyle: 'short',
                                                    }).format(new Date(kf.creationTimestamp))
                                                    : '-' }) }), _jsx("td", { className: "memori--table--column-right", children: _jsxs("div", { className: "memori--table--action-column", children: [_jsx(Button, { danger: true, ghost: true, shape: "circle", icon: _jsx(Delete, {}), disabled: (selectedRowKeys === null || selectedRowKeys === void 0 ? void 0 : selectedRowKeys.length) > 0, title: t('delete') || 'Delete', onClick: () => setDeleteModalVisibleFor(kf.knownFactID) }), _jsx(Modal, { className: "memori-known-facts-modal", open: deleteModalVisibleFor === kf.knownFactID, closable: true, title: t('knownFacts.deleteConfirmTitle'), description: t('knownFacts.deleteConfirmMessage'), onClose: () => {
                                                            setDeleteModalVisibleFor(undefined);
                                                        }, footer: _jsxs(_Fragment, { children: [_jsx(Button, { ghost: true, onClick: () => {
                                                                        setDeleteModalVisibleFor(undefined);
                                                                    }, children: t('cancel') }), _jsx(Button, { primary: true, danger: true, onClick: async () => {
                                                                        try {
                                                                            const response = await deleteKnownFact(sessionID, kf.knownFactID);
                                                                            if (response.resultCode === 0) {
                                                                                toast.success(t('knownFacts.deleteSuccess'));
                                                                                setSelectedRowKeys([]);
                                                                                fetchKnownFacts();
                                                                                setDeleteModalVisibleFor(undefined);
                                                                            }
                                                                            else {
                                                                                console.error(response);
                                                                                toast.error(t(getErrori18nKey(response.resultCode), {
                                                                                    ns: 'common',
                                                                                }));
                                                                            }
                                                                        }
                                                                        catch (_e) {
                                                                            let error = _e;
                                                                            toast.error(t('Error') + error.message);
                                                                        }
                                                                    }, children: t('confirm') })] }) })] }) })] }, kf.knownFactID))) })] })] })] }));
};
export default KnownFacts;
//# sourceMappingURL=KnownFacts.js.map