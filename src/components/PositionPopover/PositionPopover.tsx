import { Venue } from '@memori.ai/memori-api-client/dist/types';
import {
  Button,
  Popover,
  useAlertManager,
  createAlertOptions,
} from '@memori.ai/ui';
import { MapPin, Pencil } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getUncertaintyByViewport } from '../../helpers/venue';
import { useDebounceFn } from '../../helpers/utils';
import {
  VenueCombobox,
  VenueMapPreview,
  getPlaceName,
  type NominatimItem,
} from '../VenueWidget/VenueWidget';
import cx from 'classnames';

function hasShareableCoords(v?: Venue): boolean {
  return !!(v?.latitude && v?.longitude);
}

export interface PositionPopoverProps {
  venue?: Venue;
  setVenue: (venue?: Venue) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerClassName?: string;
  triggerButtonVariant?: React.ComponentProps<typeof Button>['variant'];
  triggerAriaLabel: string;
  positionerClassName?: string;
}

const PositionPopover: React.FC<PositionPopoverProps> = ({
  venue,
  setVenue,
  open,
  onOpenChange,
  triggerClassName,
  triggerButtonVariant = 'primary',
  triggerAriaLabel,
  positionerClassName,
}) => {
  const { t } = useTranslation();
  const { add } = useAlertManager();
  const [geolocationLoading, setGeolocationLoading] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [permissionDeniedMessage, setPermissionDeniedMessage] = useState<
    string | null
  >(null);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<NominatimItem[]>([]);
  const geoGenRef = useRef(0);
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const editingRef = useRef(false);
  editingRef.current = editingLocation;

  const sharingActive = geolocationLoading || hasShareableCoords(venue);

  const handleSearch = useDebounceFn(async (value: string) => {
    setFetching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          value
        )}&format=jsonv2&limit=5&addressdetails=1`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch {
      setGeocodingError(String(t('widget.geocodingFailed')));
    } finally {
      setFetching(false);
    }
  }, 1000);

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

  const handleAutocompletePick = useCallback(
    (value: NominatimItem) => {
      const placeName = getPlaceName(value);
      setVenue({
        latitude: value.lat,
        longitude: value.lon,
        placeName,
        uncertainty: value?.boundingbox
          ? getUncertaintyByViewport(value.boundingbox)
          : 2,
      } as Venue);
      setEditingLocation(false);
      setQuery('');
      setSuggestions([]);
      setGeocodingError(null);
      setPermissionDeniedMessage(null);
    },
    [setVenue, t]
  );

  const startGeolocation = useCallback(() => {
    const gen = ++geoGenRef.current;
    setPermissionDeniedMessage(null);
    setGeocodingError(null);
    setGeolocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async pos => {
        if (gen !== geoGenRef.current) return;
        let next: Venue = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          placeName: '',
          uncertainty: pos.coords.accuracy / 1000,
        };
        try {
          const result = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=jsonv2&addressdetails=1`
          );
          const response = (await result.json()) as NominatimItem;
          const placeName = getPlaceName(response);
          next = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            placeName,
            uncertainty: pos.coords.accuracy / 1000,
          };
          setVenue(next);
        } catch (e) {
          console.error('[PositionPopover] reverse geocode failed', e);
          setGeocodingError(String(t('widget.geocodingFailed')));
          setVenue(next);
        } finally {
          if (gen === geoGenRef.current) {
            setGeolocationLoading(false);
            add(
              createAlertOptions({
                description:
                  t('widget.positionSharingEnabled') ||
                  'Position sharing has been enabled.',
                severity: 'success',
              })
            );
          }
        }
      },
      err => {
        if (gen !== geoGenRef.current) return;
        setGeolocationLoading(false);
        setVenue(undefined);
        const code = (err as { code?: number }).code;
        if (code === 1) {
          setPermissionDeniedMessage(
            String(t('widget.positionUnavailableManual'))
          );
          setEditingLocation(true);
        } else {
          setGeocodingError(String(t('widget.geocodingFailed')));
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, [setVenue, t, add]);

  const toggleSharing = useCallback(() => {
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

  useEffect(() => {
    if (!editingLocation) return;
    const id = requestAnimationFrame(() => {
      autocompleteInputRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [editingLocation]);

  const handleRootOpenChange = useCallback(
    (
      nextOpen: boolean,
      details?: { reason?: string; preventUnmountOnClose?: () => void }
    ) => {
      if (
        !nextOpen &&
        editingRef.current &&
        details?.reason === 'escape-key' &&
        details.preventUnmountOnClose
      ) {
        details.preventUnmountOnClose();
        setEditingLocation(false);
        setQuery('');
        return;
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange]
  );

  const inlineError = permissionDeniedMessage || geocodingError;

  return (
    <Popover
      open={open}
      onOpenChange={handleRootOpenChange}
      modal={false}
      placement="bottom-end"
      sideOffset={8}
      contentClassName="memori-position-popover__popup"
      slotProps={{
        trigger: {
          className: triggerClassName,
          render: (props: React.ComponentProps<typeof Button>) => (
            <Button
              {...props}
              type="button"
              variant={triggerButtonVariant}
              className={cx(
                'memori-header--button',
                'memori-header--button--position',
                sharingActive && 'memori-header--button--position--active'
              )}
              aria-label={triggerAriaLabel}
              aria-expanded={open}
              icon={<MapPin aria-hidden />}
            />
          ),
        },
        positioner: {
          className: cx(
            'memori-position-popover__positioner',
            positionerClassName
          ),
        },
      }}
      content={
        <>
          <div className="memori-position-popover__row memori-position-popover__switch-row">
            <span className="memori-position-popover__switch-label">
              {t('widget.shareLocation')}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={sharingActive}
              aria-label={String(t('widget.shareLocationAria'))}
              className={cx('memori-position-popover__switch', {
                'memori-position-popover__switch--on': sharingActive,
              })}
              onClick={toggleSharing}
            >
              <span className="memori-position-popover__switch-thumb" />
            </button>
          </div>

          {(sharingActive || geolocationLoading || editingLocation) && (
            <div className="memori-position-popover__tag-block">
              {geolocationLoading ? (
                <div
                  className="memori-position-popover__tag memori-position-popover__tag--loading"
                  aria-busy="true"
                  aria-live="polite"
                >
                  <span
                    className="memori-position-popover__spinner"
                    aria-hidden
                  />
                  <span className="memori-position-popover__tag-skeleton" />
                </div>
              ) : editingLocation ? (
                <div className="memori-position-popover__autocomplete-wrap">
                  <VenueCombobox
                    venue={venue}
                    query={query}
                    fetching={fetching}
                    suggestions={suggestions}
                    onQueryChange={onQueryChange}
                    onChange={handleAutocompletePick}
                    getPlaceName={getPlaceName}
                    t={t}
                    autocompleteRootId="memori-position-popover-venue-search"
                    inputRef={autocompleteInputRef}
                  />
                </div>
              ) : (
                <div className="memori-position-popover__tag">
                  <span className="memori-position-popover__tag-text">
                    {venue?.placeName?.trim()
                      ? venue.placeName
                      : t('widget.positionResolving')}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    icon={<Pencil size={16} strokeWidth={2} aria-hidden />}
                    size="sm"
                    className="memori-position-popover__tag-edit"
                    aria-label={String(t('widget.editPositionAria'))}
                    onClick={() => {
                      setEditingLocation(true);
                      setPermissionDeniedMessage(null);
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {inlineError && (
            <p className="memori-position-popover__error" role="alert">
              {inlineError}
            </p>
          )}

          {hasShareableCoords(venue) && !geolocationLoading && (
            <div className="memori-position-popover__map">
              <VenueMapPreview venue={venue} />
            </div>
          )}
        </>
      }
    >
      {null}
    </Popover>
  );
};

export default PositionPopover;
