import React from 'react';
import { Memori, Venue } from '@memori.ai/memori-api-client/dist/types';
import { Drawer } from '@memori.ai/ui';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import VenueWidget from '../VenueWidget/VenueWidget';

export interface Props {
  memori: Memori;
  open: boolean;
  onClose: (venue?: Venue) => void;
  venue?: Venue;
  setVenue: (venue: Venue) => void;
  /** Optional class for the drawer root (e.g. for z-index when layout is WEBSITE_ASSISTANT). */
  drawerClassName?: string;
}

const PositionDrawer = ({
  memori,
  open,
  onClose,
  venue,
  setVenue,
  drawerClassName,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Drawer
      className={cx('memori-position-drawer', drawerClassName)}
      open={open}
      onClose={() => onClose(venue)}
      title={t('widget.position') || 'Position'}
      size="md"
    >
      <p>{t('write_and_speak.requirePositionHelp', { name: memori.name })}</p>
      <VenueWidget
        venue={venue}
        setVenue={setVenue}
        showUncertainty={false}
        saveAndClose={venue => {
          setVenue(venue);
          onClose(venue);
        }}
      />
    </Drawer>
  );
};

export default PositionDrawer;
