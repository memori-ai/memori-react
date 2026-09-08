"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const venue_1 = require("../../helpers/venue");
const react_leaflet_1 = require("react-leaflet");
const core_1 = require("@react-leaflet/core");
const leaflet_1 = tslib_1.__importDefault(require("leaflet"));
const react_hot_toast_1 = tslib_1.__importDefault(require("react-hot-toast"));
const Button_1 = tslib_1.__importDefault(require("../ui/Button"));
const utils_1 = require("../../helpers/utils");
const react_2 = require("@headlessui/react");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const Spin_1 = tslib_1.__importDefault(require("../ui/Spin"));
const Circle = ({ center, size, }) => {
    const context = (0, core_1.useLeafletContext)();
    (0, react_1.useEffect)(() => {
        const square = new leaflet_1.default.Circle(center, size);
        const container = context.layerContainer || context.map;
        container.addLayer(square);
        return () => {
            container.removeLayer(square);
        };
    });
    return null;
};
const CenterAndZoomUpdater = ({ center, uncertainty, }) => {
    const [init, setInit] = (0, react_1.useState)(false);
    const map = (0, react_leaflet_1.useMap)();
    const updateView = (0, react_1.useCallback)(() => {
        let zoom = uncertainty !== undefined
            ? Math.round(Math.log2((10000 * 1000) / uncertainty))
            : map.getZoom();
        map.setView(center, zoom);
    }, [center, uncertainty, map]);
    (0, react_1.useEffect)(() => {
        if (!init) {
            updateView();
            setInit(true);
        }
    }, []);
    (0, react_1.useEffect)(() => {
        updateView();
    }, [center, uncertainty, updateView]);
    return null;
};
let DefaultIcon = leaflet_1.default.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12.5, 20.5],
    shadowAnchor: [12.5, 20.5],
});
leaflet_1.default.Marker.prototype.options.icon = DefaultIcon;
const getPlaceName = (venue) => {
    let placeName = 'Position';
    if (venue === null || venue === void 0 ? void 0 : venue.address) {
        placeName = [
            venue.address.village || venue.address.suburb,
            venue.address.town ||
                venue.address.city ||
                venue.address.county ||
                venue.address.state,
            venue.address.country,
        ]
            .filter(Boolean)
            .filter((v, i, a) => a.indexOf(v) === i)
            .join(', ');
    }
    else if (venue === null || venue === void 0 ? void 0 : venue.display_name) {
        placeName = venue.display_name;
    }
    return placeName;
};
const VenueWidget = ({ venue, setVenue, showUncertainty = false, showGpsButton = true, saveAndClose, }) => {
    var _a, _b, _c;
    const { t } = (0, react_i18next_1.useTranslation)();
    const [isClient, setIsClient] = (0, react_1.useState)(false);
    const [updatingPosition, setUpdatingPosition] = (0, react_1.useState)(false);
    const [fetching, setFetching] = (0, react_1.useState)(false);
    const [query, setQuery] = (0, react_1.useState)('');
    const [suggestions, setSuggestions] = (0, react_1.useState)([]);
    const getGpsPosition = async () => {
        setUpdatingPosition(true);
        navigator.geolocation.getCurrentPosition(async (coords) => {
            let venue = {
                latitude: coords.coords.latitude,
                longitude: coords.coords.longitude,
                placeName: 'Position',
                uncertainty: coords.coords.accuracy / 1000,
            };
            try {
                const result = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.coords.latitude}&lon=${coords.coords.longitude}&format=jsonv2&addressdetails=1`);
                const response = (await result.json());
                const placeName = getPlaceName(response);
                venue = {
                    latitude: coords.coords.latitude,
                    longitude: coords.coords.longitude,
                    placeName: placeName,
                    uncertainty: coords.coords.accuracy / 1000,
                };
                setVenue(venue);
            }
            catch (e) {
                let err = e;
                console.error('[POSITION ERROR]', err);
                if (err === null || err === void 0 ? void 0 : err.message)
                    react_hot_toast_1.default.error(err.message);
                setVenue(venue);
            }
            finally {
                if (saveAndClose)
                    saveAndClose(venue);
            }
            setUpdatingPosition(false);
        }, err => {
            console.error('[POSITION ERROR]', err);
            react_hot_toast_1.default.error(err.message);
            setUpdatingPosition(false);
        });
    };
    const handleSearch = (0, utils_1.useDebounceFn)(async (value) => {
        setFetching(true);
        try {
            let response = await fetch(`https://nominatim.openstreetmap.org/search?q=${value}&format=jsonv2&limit=5&addressdetails=1`);
            let data = await response.json();
            setSuggestions(data);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setFetching(false);
        }
    }, 1000);
    const handleChange = (value) => {
        const placeName = getPlaceName(value);
        setVenue({
            latitude: value.lat,
            longitude: value.lon,
            placeName: placeName,
            uncertainty: (value === null || value === void 0 ? void 0 : value.boundingbox)
                ? (0, venue_1.getUncertaintyByViewport)(value.boundingbox)
                : 2,
        });
    };
    const onQueryChange = (value) => {
        setQuery(value);
        handleSearch(value);
    };
    (0, react_1.useEffect)(() => {
        setIsClient(true);
    }, []);
    (0, react_1.useEffect)(() => {
        const leafletCSS = document.createElement('link');
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        leafletCSS.rel = 'stylesheet';
        leafletCSS.integrity =
            'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        leafletCSS.crossOrigin = '';
        document.head.appendChild(leafletCSS);
        return () => {
            document.head.removeChild(leafletCSS);
        };
    }, []);
    return ((0, jsx_runtime_1.jsxs)("fieldset", { className: "memori--venue-widget", children: [(0, jsx_runtime_1.jsx)("legend", { className: "sr-only", children: "Venue" }), (0, jsx_runtime_1.jsxs)("div", { className: "memori--venue-widget__form-item", children: [(0, jsx_runtime_1.jsx)("div", { className: "memori--venue-widget__geosuggest", children: updatingPosition ? ((0, jsx_runtime_1.jsx)("p", { children: t('write_and_speak.updatingPosition') })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "memori--venue-widget-search", children: (0, jsx_runtime_1.jsxs)(react_2.Combobox, { value: ((venue === null || venue === void 0 ? void 0 : venue.latitude) && (venue === null || venue === void 0 ? void 0 : venue.longitude)
                                            ? {
                                                place_id: 0,
                                                lat: venue === null || venue === void 0 ? void 0 : venue.latitude,
                                                lon: venue === null || venue === void 0 ? void 0 : venue.longitude,
                                                display_name: venue === null || venue === void 0 ? void 0 : venue.placeName,
                                            }
                                            : undefined), onChange: handleChange, children: [(0, jsx_runtime_1.jsx)(react_2.Combobox.Input, { className: "memori--venue-widget-search--input", displayValue: (i) => i ? getPlaceName(i) : '', placeholder: t('searchVenue'), onChange: e => onQueryChange(e.target.value) }), (fetching ||
                                                suggestions.length > 0 ||
                                                (suggestions.length === 0 && query !== '')) && ((0, jsx_runtime_1.jsx)(react_2.Transition, { as: react_1.Fragment, leave: "transition ease-in duration-100", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: (0, jsx_runtime_1.jsx)(react_2.Combobox.Options, { className: "memori--venue-widget-search--options", children: fetching ? ((0, jsx_runtime_1.jsx)(Spin_1.default, { spinning: true, children: (0, jsx_runtime_1.jsxs)("div", { className: "memori--venue-widget-search--option memori--venue-widget-search--option-centered", children: [t('loading'), "..."] }) })) : suggestions.length === 0 && query !== '' ? ((0, jsx_runtime_1.jsx)("div", { className: "memori--venue-widget-search--option memori--venue-widget-search--option-centered", children: t('nothingFound') })) : (suggestions === null || suggestions === void 0 ? void 0 : suggestions.map(s => ((0, jsx_runtime_1.jsx)(react_2.Combobox.Option, { as: react_1.Fragment, value: s, children: ({ active, selected }) => ((0, jsx_runtime_1.jsx)("li", { className: (0, classnames_1.default)('memori--venue-widget-search--option', {
                                                                'memori--venue-widget-search--option-active': active,
                                                                'memori--venue-widget-search--option-selected': selected,
                                                            }), children: s.display_name })) }, s.place_id)))) }) }))] }) }), showGpsButton && ((0, jsx_runtime_1.jsx)(Button_1.default, { className: "memori--venue-widget__gps-button", primary: true, loading: updatingPosition, onClick: () => {
                                        setUpdatingPosition(true);
                                        getGpsPosition();
                                    }, children: t('write_and_speak.useMyPosition') }))] })) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(Button_1.default, { outlined: true, className: "memori--venue-widget__no-location-button", onClick: () => {
                                let venue = {
                                    latitude: 0,
                                    longitude: 0,
                                    placeName: 'Position',
                                    uncertainty: 0,
                                };
                                setVenue(venue);
                                if (saveAndClose)
                                    saveAndClose(venue);
                            }, children: t('write_and_speak.dontWantToProvidePosition') }) }), showUncertainty && ((0, jsx_runtime_1.jsxs)("label", { className: "memori--venue-widget__select-label", children: [(0, jsx_runtime_1.jsxs)("span", { children: [t('uncertain'), ": "] }), (0, jsx_runtime_1.jsxs)("select", { className: "memori-select--button memori--venue-widget__uncertainty", value: parseFloat(((_a = venue === null || venue === void 0 ? void 0 : venue.uncertainty) !== null && _a !== void 0 ? _a : 0).toFixed(2)), disabled: !venue ||
                                    !venue.placeName ||
                                    !venue.latitude ||
                                    !venue.longitude, onChange: e => {
                                    setVenue({
                                        ...venue,
                                        uncertainty: parseFloat(e.target.value),
                                    });
                                }, children: [(venue === null || venue === void 0 ? void 0 : venue.uncertainty) &&
                                        ![0, 1, 2, 5, 10, 20, 50, 100].includes(venue.uncertainty) && ((0, jsx_runtime_1.jsxs)("option", { value: venue.uncertainty, children: [venue.uncertainty, " Km"] })), (0, jsx_runtime_1.jsx)("option", { value: 0, children: t('exactPosition') }), (0, jsx_runtime_1.jsx)("option", { value: 1, children: "1 km" }), (0, jsx_runtime_1.jsx)("option", { value: 2, children: "2 km" }), (0, jsx_runtime_1.jsx)("option", { value: 5, children: "5 km" }), (0, jsx_runtime_1.jsx)("option", { value: 10, children: "10 km" }), (0, jsx_runtime_1.jsx)("option", { value: 20, children: "20 km" }), (0, jsx_runtime_1.jsx)("option", { value: 50, children: "50 km" }), (0, jsx_runtime_1.jsx)("option", { value: 100, children: "100 km" })] })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "memori--venue-widget__form-item", children: [(venue === null || venue === void 0 ? void 0 : venue.placeName) && venue.placeName !== 'Position' && ((0, jsx_runtime_1.jsxs)("p", { className: "memori--venue--widget__place-name", children: [(0, jsx_runtime_1.jsx)("strong", { children: t('venue') }), ": ", venue.placeName] })), (0, jsx_runtime_1.jsx)("div", { className: "memori--venue-widget__map", children: isClient && ((0, jsx_runtime_1.jsxs)(react_leaflet_1.MapContainer, { className: "memori--venue-widget__map", center: (venue === null || venue === void 0 ? void 0 : venue.latitude) && (venue === null || venue === void 0 ? void 0 : venue.longitude)
                                ? [venue.latitude, venue.longitude]
                                : [44.66579, 11.48823], zoom: 13, scrollWheelZoom: true, children: [(0, jsx_runtime_1.jsx)(react_leaflet_1.TileLayer, { attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }), (0, jsx_runtime_1.jsx)(CenterAndZoomUpdater, { center: (venue === null || venue === void 0 ? void 0 : venue.latitude) && (venue === null || venue === void 0 ? void 0 : venue.longitude)
                                        ? [venue.latitude, venue.longitude]
                                        : [44.66579, 11.48823], uncertainty: ((_b = venue === null || venue === void 0 ? void 0 : venue.uncertainty) !== null && _b !== void 0 ? _b : 0) * 1000 }), (venue === null || venue === void 0 ? void 0 : venue.latitude) && (venue === null || venue === void 0 ? void 0 : venue.longitude) && ((0, jsx_runtime_1.jsx)(react_leaflet_1.Marker, { position: [venue.latitude, venue.longitude], icon: DefaultIcon, children: (0, jsx_runtime_1.jsx)(react_leaflet_1.Popup, { children: (_c = venue.placeName) !== null && _c !== void 0 ? _c : '' }) })), (venue === null || venue === void 0 ? void 0 : venue.latitude) &&
                                    (venue === null || venue === void 0 ? void 0 : venue.longitude) &&
                                    (venue === null || venue === void 0 ? void 0 : venue.uncertainty) !== undefined && ((0, jsx_runtime_1.jsx)(Circle, { center: [venue.latitude, venue.longitude], size: venue.uncertainty * 1000 }))] })) })] })] }));
};
exports.default = VenueWidget;
//# sourceMappingURL=VenueWidget.js.map