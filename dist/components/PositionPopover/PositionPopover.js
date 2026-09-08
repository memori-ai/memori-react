"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionPopoverContent = void 0;
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_1 = require("@memori.ai/ui");
const IconButton_1 = tslib_1.__importDefault(require("../IconButton/IconButton"));
const lucide_react_1 = require("lucide-react");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const venue_1 = require("../../helpers/venue");
const utils_1 = require("../../helpers/utils");
const VenueWidget_1 = require("../VenueWidget/VenueWidget");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
function hasShareableCoords(v) {
    return !!((v === null || v === void 0 ? void 0 : v.latitude) && (v === null || v === void 0 ? void 0 : v.longitude));
}
const PositionPopoverContent = ({ venue, setVenue, autoStartGeolocation = false, }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const [geolocationLoading, setGeolocationLoading] = (0, react_1.useState)(false);
    const [editingLocation, setEditingLocation] = (0, react_1.useState)(false);
    const [permissionDeniedMessage, setPermissionDeniedMessage] = (0, react_1.useState)(null);
    const [geocodingError, setGeocodingError] = (0, react_1.useState)(null);
    const [fetching, setFetching] = (0, react_1.useState)(false);
    const [query, setQuery] = (0, react_1.useState)('');
    const [suggestions, setSuggestions] = (0, react_1.useState)([]);
    const geoGenRef = (0, react_1.useRef)(0);
    const autocompleteInputRef = (0, react_1.useRef)(null);
    const autoStartedRef = (0, react_1.useRef)(false);
    const sharingActive = geolocationLoading || hasShareableCoords(venue);
    const handleSearch = (0, utils_1.useDebounceFn)(async (value) => {
        setFetching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=jsonv2&limit=5&addressdetails=1`);
            const data = await response.json();
            setSuggestions(data);
        }
        catch (_a) {
            setGeocodingError(String(t('widget.geocodingFailed')));
        }
        finally {
            setFetching(false);
        }
    }, 1000);
    const onQueryChange = (0, react_1.useCallback)((value, opts) => {
        setQuery(value);
        if (opts === null || opts === void 0 ? void 0 : opts.skipSearch)
            return;
        if (!value.trim()) {
            setSuggestions([]);
            return;
        }
        handleSearch(value);
    }, [handleSearch]);
    const handleAutocompletePick = (0, react_1.useCallback)((value) => {
        const placeName = (0, VenueWidget_1.getPlaceName)(value);
        setVenue({
            latitude: value.lat,
            longitude: value.lon,
            placeName,
            uncertainty: (value === null || value === void 0 ? void 0 : value.boundingbox)
                ? (0, venue_1.getUncertaintyByViewport)(value.boundingbox)
                : 2,
        });
        setEditingLocation(false);
        setQuery('');
        setSuggestions([]);
        setGeocodingError(null);
        setPermissionDeniedMessage(null);
    }, [setVenue, t]);
    const startGeolocation = (0, react_1.useCallback)(() => {
        const gen = ++geoGenRef.current;
        setPermissionDeniedMessage(null);
        setGeocodingError(null);
        setGeolocationLoading(true);
        navigator.geolocation.getCurrentPosition(async (pos) => {
            if (gen !== geoGenRef.current)
                return;
            let next = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                placeName: '',
                uncertainty: pos.coords.accuracy / 1000,
            };
            try {
                const result = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=jsonv2&addressdetails=1`);
                const response = (await result.json());
                const placeName = (0, VenueWidget_1.getPlaceName)(response);
                next = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    placeName,
                    uncertainty: pos.coords.accuracy / 1000,
                };
                setVenue(next);
            }
            catch (e) {
                console.error('[PositionPopover] reverse geocode failed', e);
                setGeocodingError(String(t('widget.geocodingFailed')));
                setVenue(next);
            }
            finally {
                if (gen === geoGenRef.current) {
                    setGeolocationLoading(false);
                }
            }
        }, err => {
            if (gen !== geoGenRef.current)
                return;
            setGeolocationLoading(false);
            setVenue(undefined);
            const code = err.code;
            if (code === 1) {
                setPermissionDeniedMessage(String(t('widget.positionUnavailableManual')));
                setEditingLocation(true);
            }
            else {
                setGeocodingError(String(t('widget.geocodingFailed')));
            }
        }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
    }, [setVenue, t]);
    const toggleSharing = (0, react_1.useCallback)(() => {
        setPermissionDeniedMessage(null);
        setGeocodingError(null);
        if (sharingActive && !geolocationLoading) {
            geoGenRef.current += 1;
            setVenue({
                latitude: 0,
                longitude: 0,
                placeName: '',
                uncertainty: 0,
            });
            setEditingLocation(false);
            setQuery('');
            setSuggestions([]);
            return;
        }
        if (geolocationLoading) {
            geoGenRef.current += 1;
            setGeolocationLoading(false);
            setVenue(undefined);
            return;
        }
        startGeolocation();
    }, [geolocationLoading, setVenue, sharingActive, startGeolocation]);
    (0, react_1.useEffect)(() => {
        if (!autoStartGeolocation) {
            autoStartedRef.current = false;
            return;
        }
        if (autoStartedRef.current)
            return;
        if (hasShareableCoords(venue) || geolocationLoading)
            return;
        autoStartedRef.current = true;
        startGeolocation();
    }, [autoStartGeolocation, geolocationLoading, startGeolocation, venue]);
    (0, react_1.useEffect)(() => {
        if (!editingLocation)
            return;
        const id = requestAnimationFrame(() => {
            var _a;
            (_a = autocompleteInputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        });
        return () => cancelAnimationFrame(id);
    }, [editingLocation]);
    const inlineError = permissionDeniedMessage || geocodingError;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "memori-position-popover__row memori-position-popover__switch-row", children: (0, jsx_runtime_1.jsxs)("button", { type: "button", className: "memori-dropdown--auth-row", onClick: () => {
                        toggleSharing();
                    }, children: [(0, jsx_runtime_1.jsx)("span", { className: "memori-dropdown--auth-icon-wrap", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { size: 16 }) }), (0, jsx_runtime_1.jsxs)("span", { className: "memori-dropdown--auth-copy", children: [(0, jsx_runtime_1.jsx)("span", { className: "memori-dropdown--auth-title", children: t('widget.shareLocation') || 'Share my location' }), (0, jsx_runtime_1.jsx)("span", { className: "memori-dropdown--auth-subtitle", children: t('widget.shareLocationHint') ||
                                        'Get answers tailored to where you are' })] }), (0, jsx_runtime_1.jsx)("span", { className: (0, classnames_1.default)('memori-dropdown--switch', sharingActive && 'memori-dropdown--switch--on'), "aria-hidden": true })] }) }), (sharingActive || geolocationLoading || editingLocation) && ((0, jsx_runtime_1.jsx)("div", { className: "memori-position-popover__tag-block", children: geolocationLoading ? ((0, jsx_runtime_1.jsxs)("div", { className: "memori-position-popover__tag memori-position-popover__tag--loading", "aria-busy": "true", "aria-live": "polite", children: [(0, jsx_runtime_1.jsx)("span", { className: "memori-position-popover__spinner", "aria-hidden": true }), (0, jsx_runtime_1.jsx)("span", { className: "memori-position-popover__tag-skeleton" })] })) : editingLocation ? ((0, jsx_runtime_1.jsx)("div", { className: "memori-position-popover__autocomplete-wrap", children: (0, jsx_runtime_1.jsx)(VenueWidget_1.VenueCombobox, { venue: venue, query: query, fetching: fetching, suggestions: suggestions, onQueryChange: onQueryChange, onChange: handleAutocompletePick, getPlaceName: VenueWidget_1.getPlaceName, t: t, autocompleteRootId: "memori-position-popover-venue-search", inputRef: autocompleteInputRef }) })) : ((0, jsx_runtime_1.jsxs)("div", { className: "memori-position-popover__tag", children: [(0, jsx_runtime_1.jsx)("span", { className: "memori-position-popover__tag-text", children: ((_a = venue === null || venue === void 0 ? void 0 : venue.placeName) === null || _a === void 0 ? void 0 : _a.trim())
                                ? venue.placeName
                                : t('widget.positionResolving') }), (0, jsx_runtime_1.jsx)(ui_1.Button, { type: "button", variant: "ghost", icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Pencil, { size: 16, strokeWidth: 2, "aria-hidden": true }), size: "sm", className: "memori-position-popover__tag-edit", "aria-label": String(t('widget.editPositionAria')), onClick: () => {
                                setEditingLocation(true);
                                setPermissionDeniedMessage(null);
                            } })] })) })), inlineError && ((0, jsx_runtime_1.jsx)("p", { className: "memori-position-popover__error", role: "alert", children: inlineError })), hasShareableCoords(venue) && !geolocationLoading && ((0, jsx_runtime_1.jsx)("div", { className: "memori-position-popover__map", children: (0, jsx_runtime_1.jsx)(VenueWidget_1.VenueMapPreview, { venue: venue }) }))] }));
};
exports.PositionPopoverContent = PositionPopoverContent;
const PositionPopover = ({ venue, setVenue, open, onOpenChange, triggerClassName, triggerButtonVariant = 'toolbar', triggerAriaLabel, positionerClassName, autoStartGeolocation = false, }) => {
    const sharingActive = hasShareableCoords(venue);
    return ((0, jsx_runtime_1.jsx)(ui_1.Popover, { open: open, onOpenChange: onOpenChange, modal: false, closable: false, placement: "bottom-end", sideOffset: 8, contentClassName: "memori-position-popover__popup", slotProps: {
            trigger: {
                className: triggerClassName,
                render: (props) => {
                    return ((0, jsx_runtime_1.jsx)(IconButton_1.default, { ...props, type: "button", variant: triggerButtonVariant, active: open, className: (0, classnames_1.default)('memori-header--button', 'memori-header--button--position', sharingActive && 'memori-header--button--position--active', triggerClassName), "aria-label": triggerAriaLabel, "aria-expanded": open, icon: (0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { "aria-hidden": true }) }));
                },
            },
            positioner: {
                className: (0, classnames_1.default)('memori-position-popover__positioner', positionerClassName),
            },
        }, content: (0, jsx_runtime_1.jsx)(exports.PositionPopoverContent, { venue: venue, setVenue: setVenue, autoStartGeolocation: open && autoStartGeolocation }), children: null }));
};
exports.default = PositionPopover;
//# sourceMappingURL=PositionPopover.js.map