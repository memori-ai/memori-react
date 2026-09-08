"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const Drawer_1 = tslib_1.__importDefault(require("../ui/Drawer"));
const Spin_1 = tslib_1.__importDefault(require("../ui/Spin"));
const Modal_1 = tslib_1.__importDefault(require("../ui/Modal"));
const react_hot_toast_1 = tslib_1.__importDefault(require("react-hot-toast"));
const error_1 = require("../../helpers/error");
const react_i18next_1 = require("react-i18next");
const Delete_1 = tslib_1.__importDefault(require("../icons/Delete"));
const Checkbox_1 = tslib_1.__importDefault(require("../ui/Checkbox"));
const Select_1 = tslib_1.__importDefault(require("../ui/Select"));
const ChevronLeft_1 = tslib_1.__importDefault(require("../icons/ChevronLeft"));
const ChevronRight_1 = tslib_1.__importDefault(require("../icons/ChevronRight"));
const KnownFacts = ({ apiClient, sessionID, memori, visible = true, initialKnownFacts = [], closeDrawer, }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const { getKnownFactsPaginated, deleteKnownFact } = apiClient.knownFacts;
    const [knownFacts, setKnownFacts] = (0, react_1.useState)(initialKnownFacts);
    const [numberOfResults, setNumberOfResults] = (0, react_1.useState)(25);
    const [pageIndex, setPageIndex] = (0, react_1.useState)(0);
    const [knownFactsCount, setKnownFactsCount] = (0, react_1.useState)((_a = initialKnownFacts === null || initialKnownFacts === void 0 ? void 0 : initialKnownFacts.length) !== null && _a !== void 0 ? _a : 0);
    const [loading, setLoading] = (0, react_1.useState)(false);
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
                react_hot_toast_1.default.error(t((0, error_1.getErrori18nKey)(response.resultCode)));
            }
        }
        catch (err) {
            console.error('KNOWN_FACTS/FETCH', err);
            setKnownFacts(initialKnownFacts !== null && initialKnownFacts !== void 0 ? initialKnownFacts : []);
        }
        setLoading(false);
    };
    (0, react_1.useEffect)(() => {
        fetchKnownFacts();
    }, []);
    const [bulkDeleteModalVisible, setBulkDeleteModalVisible] = (0, react_1.useState)(false);
    const [deleteModalVisibleFor, setDeleteModalVisibleFor] = (0, react_1.useState)();
    const [selectedRowKeys, setSelectedRowKeys] = (0, react_1.useState)([]);
    return ((0, jsx_runtime_1.jsxs)(Drawer_1.default, { open: visible, width: "80%", className: "memori-known-facts-drawer", onClose: () => closeDrawer(), title: t('knownFacts.title'), children: [(0, jsx_runtime_1.jsx)("p", { children: t('knownFacts.description', {
                    memoriName: memori.name,
                }) }), (0, jsx_runtime_1.jsxs)(Spin_1.default, { spinning: loading, children: [(0, jsx_runtime_1.jsxs)("div", { className: "memori-known-facts-actions", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { primary: true, danger: true, onClick: () => {
                                    setBulkDeleteModalVisible(true);
                                }, className: "memori-known-facts-delete-selected", disabled: (selectedRowKeys === null || selectedRowKeys === void 0 ? void 0 : selectedRowKeys.length) === 0, icon: (0, jsx_runtime_1.jsx)(Delete_1.default, {}), loading: loading, children: [t('selected'), " (", selectedRowKeys === null || selectedRowKeys === void 0 ? void 0 : selectedRowKeys.length, ")"] }), (0, jsx_runtime_1.jsx)(Modal_1.default, { className: "memori-known-facts-modal", open: bulkDeleteModalVisible, closable: true, title: selectedRowKeys.length > 1
                                    ? t('knownFacts.deleteSelectedConfirmTitle')
                                    : t('knownFacts.deleteConfirmTitle'), description: selectedRowKeys.length > 1
                                    ? t('knownFacts.deleteSelectedConfirmMessage', {
                                        number: selectedRowKeys.length,
                                    })
                                    : t('knownFacts.deleteConfirmMessage'), onClose: () => {
                                    setBulkDeleteModalVisible(false);
                                }, footer: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { ghost: true, onClick: () => {
                                                setBulkDeleteModalVisible(false);
                                            }, children: t('cancel') }), (0, jsx_runtime_1.jsx)(Button_1.default, { primary: true, danger: true, onClick: async () => {
                                                try {
                                                    const mutations = selectedRowKeys.map(key => {
                                                        let knownFactID = key;
                                                        return deleteKnownFact(sessionID, knownFactID);
                                                    });
                                                    Promise.all(mutations).then(responses => {
                                                        if (responses.every(r => r.resultCode === 0)) {
                                                            react_hot_toast_1.default.success(t('knownFacts.deleteSuccess'));
                                                            setSelectedRowKeys([]);
                                                            fetchKnownFacts();
                                                            setBulkDeleteModalVisible(false);
                                                        }
                                                        else {
                                                            let errored = responses.find(r => r.resultCode !== 0);
                                                            console.error(errored);
                                                            if ((errored === null || errored === void 0 ? void 0 : errored.resultCode) !== undefined)
                                                                react_hot_toast_1.default.error(t((0, error_1.getErrori18nKey)(errored === null || errored === void 0 ? void 0 : errored.resultCode)));
                                                        }
                                                    });
                                                }
                                                catch (_e) {
                                                    let error = _e;
                                                    react_hot_toast_1.default.error(t('Error') + error.message);
                                                }
                                            }, children: t('confirm') })] }) })] }), knownFactsCount > 25 && ((0, jsx_runtime_1.jsxs)("nav", { className: "memori--table--pagination", children: [knownFactsCount > numberOfResults && ((0, jsx_runtime_1.jsxs)("div", { className: "memori--table--pagination--pages", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { shape: "circle", disabled: pageIndex === 0 || pageIndex < numberOfResults, padded: false, title: t('previous') || 'Previous', icon: (0, jsx_runtime_1.jsx)(ChevronLeft_1.default, {}), onClick: () => {
                                            let from = (pageIndex / numberOfResults - 1) * numberOfResults;
                                            setPageIndex(from);
                                            fetchKnownFacts(undefined, from, numberOfResults);
                                        } }), (0, jsx_runtime_1.jsxs)("span", { className: "memori--table--pagination--pages--current", children: [Math.ceil(pageIndex / numberOfResults) + 1, " /", ' ', Math.ceil(knownFactsCount / numberOfResults)] }), (0, jsx_runtime_1.jsx)(Button_1.default, { shape: "circle", padded: false, title: t('next') || 'Next', icon: (0, jsx_runtime_1.jsx)(ChevronRight_1.default, {}), disabled: (pageIndex / numberOfResults + 1) * numberOfResults >=
                                            knownFactsCount, onClick: () => {
                                            let from = (pageIndex / numberOfResults + 1) * numberOfResults;
                                            setPageIndex(from);
                                            fetchKnownFacts(undefined, from, numberOfResults);
                                        } })] })), (0, jsx_runtime_1.jsx)(Select_1.default, { options: [
                                    { label: `25 / ${t('page') || 'page'}`, value: 25 },
                                    { label: `50 / ${t('page') || 'page'}`, value: 50 },
                                    { label: `100 / ${t('page') || 'page'}`, value: 100 },
                                ], value: numberOfResults, displayValue: `${numberOfResults} / ${t('page') || 'page'}`, onChange: value => {
                                    setNumberOfResults(value);
                                    setPageIndex(0);
                                    fetchKnownFacts(undefined, 0, value);
                                } })] })), (0, jsx_runtime_1.jsxs)("table", { className: "memori--table", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "memori--table--column-centered", children: (0, jsx_runtime_1.jsx)(Checkbox_1.default, { checked: !!(knownFacts === null || knownFacts === void 0 ? void 0 : knownFacts.length) &&
                                                    (selectedRowKeys === null || selectedRowKeys === void 0 ? void 0 : selectedRowKeys.length) === knownFacts.length, indeterminate: !!(knownFacts === null || knownFacts === void 0 ? void 0 : knownFacts.length) &&
                                                    !!(selectedRowKeys === null || selectedRowKeys === void 0 ? void 0 : selectedRowKeys.length) &&
                                                    (selectedRowKeys === null || selectedRowKeys === void 0 ? void 0 : selectedRowKeys.length) !== (knownFacts === null || knownFacts === void 0 ? void 0 : knownFacts.length), onChange: e => {
                                                    if (e.target.checked) {
                                                        setSelectedRowKeys(knownFacts.map(kf => kf.knownFactID));
                                                    }
                                                    else {
                                                        setSelectedRowKeys([]);
                                                    }
                                                } }) }), (0, jsx_runtime_1.jsx)("th", { children: t('knownFacts.text') }), (0, jsx_runtime_1.jsx)("th", { className: "mobile-hidden", children: t('createdAt') }), (0, jsx_runtime_1.jsx)("th", { className: "memori--table--column-right", children: t('actions') })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: knownFacts.map(kf => ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "memori--table--column-centered", children: (0, jsx_runtime_1.jsx)(Checkbox_1.default, { checked: selectedRowKeys === null || selectedRowKeys === void 0 ? void 0 : selectedRowKeys.includes(kf.knownFactID), onChange: e => {
                                                    if (e.target.checked) {
                                                        setSelectedRowKeys(srk => [
                                                            ...new Set([...srk, kf.knownFactID]),
                                                        ]);
                                                    }
                                                    else {
                                                        setSelectedRowKeys(srk => srk.filter(key => key !== kf.knownFactID));
                                                    }
                                                } }) }), (0, jsx_runtime_1.jsx)("td", { children: kf.text }), (0, jsx_runtime_1.jsx)("td", { className: "mobile-hidden", children: (0, jsx_runtime_1.jsx)("span", { className: "memori--table--date", children: kf.creationTimestamp
                                                    ? new Intl.DateTimeFormat('it', {
                                                        dateStyle: 'short',
                                                        timeStyle: 'short',
                                                    }).format(new Date(kf.creationTimestamp))
                                                    : '-' }) }), (0, jsx_runtime_1.jsx)("td", { className: "memori--table--column-right", children: (0, jsx_runtime_1.jsxs)("div", { className: "memori--table--action-column", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { danger: true, ghost: true, shape: "circle", icon: (0, jsx_runtime_1.jsx)(Delete_1.default, {}), disabled: (selectedRowKeys === null || selectedRowKeys === void 0 ? void 0 : selectedRowKeys.length) > 0, title: t('delete') || 'Delete', onClick: () => setDeleteModalVisibleFor(kf.knownFactID) }), (0, jsx_runtime_1.jsx)(Modal_1.default, { className: "memori-known-facts-modal", open: deleteModalVisibleFor === kf.knownFactID, closable: true, title: t('knownFacts.deleteConfirmTitle'), description: t('knownFacts.deleteConfirmMessage'), onClose: () => {
                                                            setDeleteModalVisibleFor(undefined);
                                                        }, footer: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { ghost: true, onClick: () => {
                                                                        setDeleteModalVisibleFor(undefined);
                                                                    }, children: t('cancel') }), (0, jsx_runtime_1.jsx)(Button_1.default, { primary: true, danger: true, onClick: async () => {
                                                                        try {
                                                                            const response = await deleteKnownFact(sessionID, kf.knownFactID);
                                                                            if (response.resultCode === 0) {
                                                                                react_hot_toast_1.default.success(t('knownFacts.deleteSuccess'));
                                                                                setSelectedRowKeys([]);
                                                                                fetchKnownFacts();
                                                                                setDeleteModalVisibleFor(undefined);
                                                                            }
                                                                            else {
                                                                                console.error(response);
                                                                                react_hot_toast_1.default.error(t((0, error_1.getErrori18nKey)(response.resultCode), {
                                                                                    ns: 'common',
                                                                                }));
                                                                            }
                                                                        }
                                                                        catch (_e) {
                                                                            let error = _e;
                                                                            react_hot_toast_1.default.error(t('Error') + error.message);
                                                                        }
                                                                    }, children: t('confirm') })] }) })] }) })] }, kf.knownFactID))) })] })] })] }));
};
exports.default = KnownFacts;
//# sourceMappingURL=KnownFacts.js.map