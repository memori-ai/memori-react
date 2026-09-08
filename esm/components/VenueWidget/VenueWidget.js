import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useCallback, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { getUncertaintyByViewport } from '../../helpers/venue';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useLeafletContext } from '@react-leaflet/core';
import L from 'leaflet';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import { useDebounceFn } from '../../helpers/utils';
import { Combobox, Transition } from '@headlessui/react';
import cx from 'classnames';
import Spin from '../ui/Spin';
const Circle = ({ center, size, }) => {
    const context = useLeafletContext();
    useEffect(() => {
        const square = new L.Circle(center, size);
        const container = context.layerContainer || context.map;
        container.addLayer(square);
        return () => {
            container.removeLayer(square);
        };
    });
    return null;
};
const CenterAndZoomUpdater = ({ center, uncertainty, }) => {
    const [init, setInit] = useState(false);
    const map = useMap();
    const updateView = useCallback(() => {
        let zoom = uncertainty !== undefined
            ? Math.round(Math.log2((10000 * 1000) / uncertainty))
            : map.getZoom();
        map.setView(center, zoom);
    }, [center, uncertainty, map]);
    useEffect(() => {
        if (!init) {
            updateView();
            setInit(true);
        }
    }, []);
    useEffect(() => {
        updateView();
    }, [center, uncertainty, updateView]);
    return null;
};
let DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12.5, 20.5],
    shadowAnchor: [12.5, 20.5],
});
L.Marker.prototype.options.icon = DefaultIcon;
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
    const { t } = useTranslation();
    const [isClient, setIsClient] = useState(false);
    const [updatingPosition, setUpdatingPosition] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
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
                    toast.error(err.message);
                setVenue(venue);
            }
            finally {
                if (saveAndClose)
                    saveAndClose(venue);
            }
            setUpdatingPosition(false);
        }, err => {
            console.error('[POSITION ERROR]', err);
            toast.error(err.message);
            setUpdatingPosition(false);
        });
    };
    const handleSearch = useDebounceFn(async (value) => {
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
                ? getUncertaintyByViewport(value.boundingbox)
                : 2,
        });
    };
    const onQueryChange = (value) => {
        setQuery(value);
        handleSearch(value);
    };
    useEffect(() => {
        setIsClient(true);
    }, []);
    useEffect(() => {
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
    return (_jsxs("fieldset", { className: "memori--venue-widget", children: [_jsx("legend", { className: "sr-only", children: "Venue" }), _jsxs("div", { className: "memori--venue-widget__form-item", children: [_jsx("div", { className: "memori--venue-widget__geosuggest", children: updatingPosition ? (_jsx("p", { children: t('write_and_speak.updatingPosition') })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "memori--venue-widget-search", children: _jsxs(Combobox, { value: ((venue === null || venue === void 0 ? void 0 : venue.latitude) && (venue === null || venue === void 0 ? void 0 : venue.longitude)
                                            ? {
                                                place_id: 0,
                                                lat: venue === null || venue === void 0 ? void 0 : venue.latitude,
                                                lon: venue === null || venue === void 0 ? void 0 : venue.longitude,
                                                display_name: venue === null || venue === void 0 ? void 0 : venue.placeName,
                                            }
                                            : undefined), onChange: handleChange, children: [_jsx(Combobox.Input, { className: "memori--venue-widget-search--input", displayValue: (i) => i ? getPlaceName(i) : '', placeholder: t('searchVenue'), onChange: e => onQueryChange(e.target.value) }), (fetching ||
                                                suggestions.length > 0 ||
                                                (suggestions.length === 0 && query !== '')) && (_jsx(Transition, { as: Fragment, leave: "transition ease-in duration-100", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: _jsx(Combobox.Options, { className: "memori--venue-widget-search--options", children: fetching ? (_jsx(Spin, { spinning: true, children: _jsxs("div", { className: "memori--venue-widget-search--option memori--venue-widget-search--option-centered", children: [t('loading'), "..."] }) })) : suggestions.length === 0 && query !== '' ? (_jsx("div", { className: "memori--venue-widget-search--option memori--venue-widget-search--option-centered", children: t('nothingFound') })) : (suggestions === null || suggestions === void 0 ? void 0 : suggestions.map(s => (_jsx(Combobox.Option, { as: Fragment, value: s, children: ({ active, selected }) => (_jsx("li", { className: cx('memori--venue-widget-search--option', {
                                                                'memori--venue-widget-search--option-active': active,
                                                                'memori--venue-widget-search--option-selected': selected,
                                                            }), children: s.display_name })) }, s.place_id)))) }) }))] }) }), showGpsButton && (_jsx(Button, { className: "memori--venue-widget__gps-button", primary: true, loading: updatingPosition, onClick: () => {
                                        setUpdatingPosition(true);
                                        getGpsPosition();
                                    }, children: t('write_and_speak.useMyPosition') }))] })) }), _jsx("div", { children: _jsx(Button, { outlined: true, className: "memori--venue-widget__no-location-button", onClick: () => {
                                let venue = {
                                    latitude: 0,
                                    longitude: 0,
                                    placeName: 'Position',
                                    uncertainty: 0,
                                };
                                setVenue(venue);
                                if (saveAndClose)
                                    saveAndClose(venue);
                            }, children: t('write_and_speak.dontWantToProvidePosition') }) }), showUncertainty && (_jsxs("label", { className: "memori--venue-widget__select-label", children: [_jsxs("span", { children: [t('uncertain'), ": "] }), _jsxs("select", { className: "memori-select--button memori--venue-widget__uncertainty", value: parseFloat(((_a = venue === null || venue === void 0 ? void 0 : venue.uncertainty) !== null && _a !== void 0 ? _a : 0).toFixed(2)), disabled: !venue ||
                                    !venue.placeName ||
                                    !venue.latitude ||
                                    !venue.longitude, onChange: e => {
                                    setVenue({
                                        ...venue,
                                        uncertainty: parseFloat(e.target.value),
                                    });
                                }, children: [(venue === null || venue === void 0 ? void 0 : venue.uncertainty) &&
                                        ![0, 1, 2, 5, 10, 20, 50, 100].includes(venue.uncertainty) && (_jsxs("option", { value: venue.uncertainty, children: [venue.uncertainty, " Km"] })), _jsx("option", { value: 0, children: t('exactPosition') }), _jsx("option", { value: 1, children: "1 km" }), _jsx("option", { value: 2, children: "2 km" }), _jsx("option", { value: 5, children: "5 km" }), _jsx("option", { value: 10, children: "10 km" }), _jsx("option", { value: 20, children: "20 km" }), _jsx("option", { value: 50, children: "50 km" }), _jsx("option", { value: 100, children: "100 km" })] })] }))] }), _jsxs("div", { className: "memori--venue-widget__form-item", children: [(venue === null || venue === void 0 ? void 0 : venue.placeName) && venue.placeName !== 'Position' && (_jsxs("p", { className: "memori--venue--widget__place-name", children: [_jsx("strong", { children: t('venue') }), ": ", venue.placeName] })), _jsx("div", { className: "memori--venue-widget__map", children: isClient && (_jsxs(MapContainer, { className: "memori--venue-widget__map", center: (venue === null || venue === void 0 ? void 0 : venue.latitude) && (venue === null || venue === void 0 ? void 0 : venue.longitude)
                                ? [venue.latitude, venue.longitude]
                                : [44.66579, 11.48823], zoom: 13, scrollWheelZoom: true, children: [_jsx(TileLayer, { attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }), _jsx(CenterAndZoomUpdater, { center: (venue === null || venue === void 0 ? void 0 : venue.latitude) && (venue === null || venue === void 0 ? void 0 : venue.longitude)
                                        ? [venue.latitude, venue.longitude]
                                        : [44.66579, 11.48823], uncertainty: ((_b = venue === null || venue === void 0 ? void 0 : venue.uncertainty) !== null && _b !== void 0 ? _b : 0) * 1000 }), (venue === null || venue === void 0 ? void 0 : venue.latitude) && (venue === null || venue === void 0 ? void 0 : venue.longitude) && (_jsx(Marker, { position: [venue.latitude, venue.longitude], icon: DefaultIcon, children: _jsx(Popup, { children: (_c = venue.placeName) !== null && _c !== void 0 ? _c : '' }) })), (venue === null || venue === void 0 ? void 0 : venue.latitude) &&
                                    (venue === null || venue === void 0 ? void 0 : venue.longitude) &&
                                    (venue === null || venue === void 0 ? void 0 : venue.uncertainty) !== undefined && (_jsx(Circle, { center: [venue.latitude, venue.longitude], size: venue.uncertainty * 1000 }))] })) })] })] }));
};
export default VenueWidget;
//# sourceMappingURL=VenueWidget.js.map