import { Venue } from '@memori.ai/memori-api-client/dist/types';
import {
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  useRef,
  type RefObject,
  type Ref,
} from 'react';
import { useTranslation } from 'react-i18next';
import { getUncertaintyByViewport } from '../../helpers/venue';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useLeafletContext } from '@react-leaflet/core';
import L from 'leaflet';
import {
  Autocomplete,
  Button,
  createAlertOptions,
  type AutocompleteOption,
  useAlertManager,
} from '@memori.ai/ui';
import { useDebounceFn } from '../../helpers/utils';

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

export function getPlaceName(venue?: NominatimItem) {
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
}

const ITEM_PRESS_REASON = 'item-press' as const;

export const VenueCombobox = ({
  venue,
  query,
  fetching,
  suggestions,
  onQueryChange,
  onChange,
  getPlaceName,
  t,
  autocompleteRootId = 'venue-widget-search',
  inputRef: inputRefFromParent,
}: {
  venue?: Venue;
  query: string;
  fetching: boolean;
  suggestions: NominatimItem[];
  onQueryChange: (value: string, options?: { skipSearch?: boolean }) => void;
  onChange: (value: NominatimItem) => void;
  getPlaceName: (v?: NominatimItem) => string;
  t: (key: string) => string;
  autocompleteRootId?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
}) => {
  const [open, setOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [userCleared, setUserCleared] = useState(false);
  const fallbackInputRef = useRef<HTMLInputElement>(null);
  const inputRef = inputRefFromParent ?? fallbackInputRef;

  const selectedItem: NominatimItem | undefined =
    venue?.latitude != null
      ? {
          place_id: 0,
          lat: venue.latitude,
          lon: venue.longitude,
          display_name: venue.placeName ?? '',
          type: '',
          category: '',
          importance: 0,
          place_rank: 0,
          boundingbox: [0, 0, 0, 0],
        }
      : undefined;
  const closedLabel = selectedItem ? getPlaceName(selectedItem) : '';

  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const onFocus = () => {
      setInputFocused(true);
      // Blurred value came from `closedLabel` while `query` stayed "". Seed `query` so the
      // controlled input matches what the user sees; otherwise select-all + delete cannot clear.
      if (closedLabel && query === '' && !userCleared) {
        onQueryChange(closedLabel, { skipSearch: true });
      }
    };
    const onBlur = () => setInputFocused(false);
    el.addEventListener('focus', onFocus);
    el.addEventListener('blur', onBlur);
    return () => {
      el.removeEventListener('focus', onFocus);
      el.removeEventListener('blur', onBlur);
    };
  }, [open, query, closedLabel, onQueryChange, userCleared]);

  /** While editing (or after an explicit clear), show `query`; otherwise show the saved venue label. */
  const editing = inputFocused || open || query !== '' || userCleared;
  const inputValue = editing ? query : closedLabel;

  const options: AutocompleteOption[] = suggestions.map(s => ({
    value: getPlaceName(s) || s.display_name,
    label: s.display_name,
  }));

  return (
    <Autocomplete
      id={autocompleteRootId}
      inputRef={inputRef as Ref<HTMLInputElement>}
      className="memori--venue-widget-search"
      options={options}
      mode="none"
      filter={null}
      value={inputValue}
      onChange={(value, details) => {
        if (details.reason === ITEM_PRESS_REASON) {
          const item = suggestions.find(
            s => (getPlaceName(s) || s.display_name) === value
          );
          if (item) {
            setUserCleared(false);
            onQueryChange(value, { skipSearch: true });
            onChange(item);
          }
          return;
        }
        setUserCleared(value.trim() === '');
        onQueryChange(value);
      }}
      open={open}
      onOpenChange={nextOpen => setOpen(nextOpen)}
      placeholder={t('searchVenue')}
      loading={fetching}
      loadingText={`${t('loading')}...`}
      emptyText={query.trim() ? t('nothingFound') : '\u200b'}
      autoHighlight
      clearable={inputValue.trim() !== ''}
    />
  );
};

export const VenueMapPreview = ({ venue }: { venue?: Venue }) => {
  const [isClient, setIsClient] = useState(false);

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
    <div className="memori--venue-widget__map-container">
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
  );
};

const VenueWidget = ({
  venue,
  setVenue,
  showUncertainty = false,
  showGpsButton = true,
  saveAndClose,
}: Props) => {
  const { t } = useTranslation();
  const { add } = useAlertManager();
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
          placeName: '',
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
          add(
            createAlertOptions({
              description: placeName
                ? t('write_and_speak.locationSavedWithPlace', { place: placeName })
                : t('write_and_speak.locationSaved'),
              severity: 'success',
            })
          );
        } catch (e) {
          let err = e as Error;
          console.error('[POSITION ERROR]', err);
          if (err?.message) add(createAlertOptions({ description: err.message, severity: 'error' }));

          setVenue(venue);
        } finally {
          if (saveAndClose) saveAndClose(venue);
        }

        setUpdatingPosition(false);
      },
      err => {
        console.error('[POSITION ERROR]', err);
        const geoErr = err as any;
        let message = err.message || t('write_and_speak.locationErrorGeneric');
        if (geoErr?.code === 1) message = t('write_and_speak.locationPermissionDenied');
        else if (geoErr?.code === 2) message = t('write_and_speak.locationUnavailable');
        else if (geoErr?.code === 3) message = t('write_and_speak.locationRequestTimedOut');
        add(createAlertOptions({ description: message, severity: 'error' }));
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
    const placeName = getPlaceName(value);

    setVenue({
      latitude: value.lat,
      longitude: value.lon,
      placeName: placeName,
      uncertainty: value?.boundingbox
        ? getUncertaintyByViewport(value.boundingbox)
        : 2,
    } as Venue);
    add(
      createAlertOptions({
        description: t('write_and_speak.placeSelected', { place: placeName }),
        severity: 'success',
      })
    );
  };

  const onQueryChange = useCallback(
    (value: string, opts?: { skipSearch?: boolean }) => {
      setQuery(value);
      if (opts?.skipSearch) return;
      if (!value.trim()) {
        setSuggestions([]);
        return;
      }
      handleSearch(value);
    },
    [handleSearch]
  );

  return (
    <fieldset className="memori--venue-widget">
      <legend className="sr-only">Venue</legend>

      <div className="memori--venue-widget__form-item memori--venue-widget__controls">
        <div className="memori--venue-widget__geosuggest">
          {updatingPosition ? (
            <p className="memori--venue-widget__updating-message">
              {t('write_and_speak.updatingPosition')}
            </p>
          ) : (
            <>
              <div className="memori--venue-widget__search-wrap">
                <VenueCombobox
                  venue={venue}
                  query={query}
                  fetching={fetching}
                  suggestions={suggestions}
                  onQueryChange={onQueryChange}
                  onChange={handleChange}
                  getPlaceName={getPlaceName}
                  t={t}
                />
              </div>
              {showGpsButton && (
                <Button
                  className="memori--venue-widget__gps-button"
                  variant="primary"
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

        <div className="memori--venue-widget__actions">
          <Button
            variant="outline"
            className="memori--venue-widget__no-location-button"
            title={String(t('write_and_speak.skipLocationTitle'))}
            onClick={() => {
              let venue: Venue = {
                latitude: 0,
                longitude: 0,
                placeName: '',
                uncertainty: 0,
              };
              setVenue(venue);
              add(
                createAlertOptions({
                  description: t('write_and_speak.locationSkippedConfirm'),
                  severity: 'success',
                })
              );
              if (saveAndClose) saveAndClose(venue);
            }}
          >
            {t('write_and_speak.dontWantToProvidePosition')}
          </Button>
        </div>

        {showUncertainty && (
          <div className="memori--venue-widget__uncertainty-wrap">
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
          </div>
        )}
      </div>

      <div className="memori--venue-widget__form-item memori--venue-widget__map-section">
        {venue?.placeName && venue.placeName !== '' && (
          <p className="memori--venue-widget__place-name">
            <strong>{t('venue')}</strong>: {venue.placeName}
          </p>
        )}
        <VenueMapPreview venue={venue} />
      </div>
    </fieldset>
  );
};

export default VenueWidget;
