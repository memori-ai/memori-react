import { Venue } from '@memori.ai/memori-api-client/dist/types';
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

export type NominatimItem = {
  place_id: number;
  lat: number;
  lon: number;
  display_name: string;
  type: string;
  category: string;
  importance: number;
  place_rank: number;
  address?: {
    house_number?: string;
    road?: string;
    hamlet?: string;
    village?: string;
    suburb?: string;
    town?: string;
    city?: string;
    municipality?: string;
    county?: string;
    state?: string;
    country: string;
  };
  boundingbox: [number, number, number, number];
};

export interface Props {
  venue?: Venue;
  setVenue: (venue: Venue) => void;
  showUncertainty?: boolean;
  showGpsButton?: boolean;
  saveAndClose?: (venue: Venue) => void;
}

const Circle = ({
  center,
  size,
}: {
  center: [number, number];
  size: number;
}) => {
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

const CenterAndZoomUpdater = ({
  center,
  uncertainty,
}: {
  center: [number, number];
  uncertainty?: number;
}) => {
  const [init, setInit] = useState(false);
  const map = useMap();

  const updateView = useCallback(() => {
    let zoom =
      uncertainty !== undefined
        ? Math.round(Math.log2((10000 * 1000) / uncertainty))
        : map.getZoom();
    map.setView(center, zoom);
  }, [center, uncertainty, map]);

  useEffect(() => {
    if (!init) {
      updateView();
      setInit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

const getPlaceName = (venue?: NominatimItem) => {
  let placeName = 'Position';

  if (venue?.address) {
    placeName = [
      venue.address.village || venue.address.suburb,
      venue.address.town ||
        venue.address.city ||
        venue.address.county ||
        venue.address.state,
      venue.address.country,
    ]
      // remove undefined values
      .filter(Boolean)
      // remove duplicates
      .filter((v, i, a) => a.indexOf(v) === i)
      .join(', ');
  } else if (venue?.display_name) {
    placeName = venue.display_name;
  }

  return placeName;
};

const VenueWidget = ({
  venue,
  setVenue,
  showUncertainty = false,
  showGpsButton = true,
  saveAndClose,
}: Props) => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [updatingPosition, setUpdatingPosition] = useState(false);

  const [fetching, setFetching] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<NominatimItem[]>([]);

  const getGpsPosition = async () => {
    setUpdatingPosition(true);

    navigator.geolocation.getCurrentPosition(
      async coords => {
        let venue: Venue = {
          latitude: coords.coords.latitude,
          longitude: coords.coords.longitude,
          placeName: 'Position',
          uncertainty: coords.coords.accuracy / 1000,
        };

        try {
          const result = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.coords.latitude}&lon=${coords.coords.longitude}&format=jsonv2&addressdetails=1`
          );
          const response = (await result.json()) as NominatimItem;

          const placeName = getPlaceName(response);
          venue = {
            latitude: coords.coords.latitude,
            longitude: coords.coords.longitude,
            placeName: placeName,
            uncertainty: coords.coords.accuracy / 1000,
          };
          setVenue(venue);
        } catch (e) {
          let err = e as Error;
          console.error('[POSITION ERROR]', err);
          if (err?.message) toast.error(err.message);

          setVenue(venue);
        } finally {
          if (saveAndClose) saveAndClose(venue);
        }

        setUpdatingPosition(false);
      },
      err => {
        console.error('[POSITION ERROR]', err);
        toast.error(err.message);
        setUpdatingPosition(false);
      }
    );
  };

  const handleSearch = useDebounceFn(async (value: string) => {
    setFetching(true);

    try {
      let response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${value}&format=jsonv2&limit=5&addressdetails=1`
      );
      let data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  }, 1000);

  const handleChange = (value: NominatimItem) => {
    console.log(value);
    const placeName = getPlaceName(value);

    setVenue({
      latitude: value.lat,
      longitude: value.lon,
      placeName: placeName,
      uncertainty: value?.boundingbox
        ? getUncertaintyByViewport(value.boundingbox)
        : 2,
    } as Venue);
  };

  const onQueryChange = (value: string) => {
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

  return (
    <fieldset className="memori--venue-widget">
      <legend className="sr-only">Venue</legend>
      <div className="memori--venue-widget__form-item">
        <div className="memori--venue-widget__geosuggest">
          {updatingPosition ? (
            <p>{t('write_and_speak.updatingPosition')}</p>
          ) : (
            <>
              <div className="memori--venue-widget-search">
                <Combobox
                  value={
                    (venue?.latitude && venue?.longitude
                      ? {
                          place_id: 0,
                          lat: venue?.latitude,
                          lon: venue?.longitude,
                          display_name: venue?.placeName,
                        }
                      : undefined) as NominatimItem | undefined
                  }
                  onChange={handleChange}
                >
                  <Combobox.Input
                    className="memori--venue-widget-search--input"
                    displayValue={(i: NominatimItem) =>
                      i ? getPlaceName(i) : ''
                    }
                    placeholder={t('searchVenue')}
                    onChange={e => onQueryChange(e.target.value)}
                  />
                  {(fetching ||
                    suggestions.length > 0 ||
                    (suggestions.length === 0 && query !== '')) && (
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Combobox.Options className="memori--venue-widget-search--options">
                        {fetching ? (
                          <Spin spinning>
                            <center className="memori--venue-widget-search--option">
                              {t('loading')}...
                            </center>
                          </Spin>
                        ) : suggestions.length === 0 && query !== '' ? (
                          <center className="memori--venue-widget-search--option">
                            {t('nothingFound')}
                          </center>
                        ) : (
                          suggestions?.map(s => (
                            <Combobox.Option
                              as={Fragment}
                              key={s.place_id}
                              value={s}
                            >
                              {({ active, selected }) => (
                                <li
                                  className={cx(
                                    'memori--venue-widget-search--option',
                                    {
                                      'memori--venue-widget-search--option-active':
                                        active,
                                      'memori--venue-widget-search--option-selected':
                                        selected,
                                    }
                                  )}
                                >
                                  {s.display_name}
                                </li>
                              )}
                            </Combobox.Option>
                          ))
                        )}
                      </Combobox.Options>
                    </Transition>
                  )}
                </Combobox>
              </div>

              {showGpsButton && (
                <Button
                  className="memori--venue-widget__gps-button"
                  primary
                  loading={updatingPosition}
                  onClick={() => {
                    setUpdatingPosition(true);
                    getGpsPosition();
                  }}
                >
                  {t('write_and_speak.useMyPosition')}
                </Button>
              )}
            </>
          )}
        </div>
        <div>
          <Button
            outlined
            className="memori--venue-widget__no-location-button"
            onClick={() => {
              let venue: Venue = {
                latitude: 0,
                longitude: 0,
                placeName: 'Position',
                uncertainty: 0,
              };
              setVenue(venue);
              if (saveAndClose) saveAndClose(venue);
            }}
          >
            {t('write_and_speak.dontWantToProvidePosition')}
          </Button>
        </div>
        {showUncertainty && (
          <label className="memori--venue-widget__select-label">
            <span>{t('uncertain')}: </span>
            <select
              className="memori-select--button memori--venue-widget__uncertainty"
              value={parseFloat((venue?.uncertainty ?? 0).toFixed(2))}
              disabled={
                !venue ||
                !venue.placeName ||
                !venue.latitude ||
                !venue.longitude
              }
              onChange={e => {
                setVenue({
                  ...venue,
                  uncertainty: parseFloat(e.target.value),
                } as Venue);
              }}
            >
              {venue?.uncertainty &&
                ![0, 1, 2, 5, 10, 20, 50, 100].includes(venue.uncertainty) && (
                  <option value={venue.uncertainty}>
                    {venue.uncertainty} Km
                  </option>
                )}
              <option value={0}>{t('exactPosition')}</option>
              <option value={1}>1 km</option>
              <option value={2}>2 km</option>
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={20}>20 km</option>
              <option value={50}>50 km</option>
              <option value={100}>100 km</option>
            </select>
          </label>
        )}
      </div>
      <div className="memori--venue-widget__form-item">
        {venue?.placeName && venue.placeName !== 'Position' && (
          <p className="memori--venue--widget__place-name">
            <strong>{t('venue')}</strong>: {venue.placeName}
          </p>
        )}
        <div className="memori--venue-widget__map">
          {isClient && (
            <MapContainer
              className="memori--venue-widget__map"
              center={
                venue?.latitude && venue?.longitude
                  ? [venue.latitude, venue.longitude]
                  : [44.66579, 11.48823]
              }
              zoom={13}
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <CenterAndZoomUpdater
                center={
                  venue?.latitude && venue?.longitude
                    ? [venue.latitude, venue.longitude]
                    : [44.66579, 11.48823]
                }
                uncertainty={(venue?.uncertainty ?? 0) * 1000}
              />
              {venue?.latitude && venue?.longitude && (
                <Marker
                  position={[venue.latitude, venue.longitude]}
                  icon={DefaultIcon}
                >
                  <Popup>{venue.placeName ?? ''}</Popup>
                </Marker>
              )}
              {venue?.latitude &&
                venue?.longitude &&
                venue?.uncertainty !== undefined && (
                  <Circle
                    center={[venue.latitude, venue.longitude]}
                    size={venue.uncertainty * 1000}
                  />
                )}
            </MapContainer>
          )}
        </div>
      </div>
    </fieldset>
  );
};

export default VenueWidget;
