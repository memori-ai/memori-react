import React from 'react';
import { Memori, Venue } from '@memori.ai/memori-api-client/dist/types';
import { Drawer } from '@memori.ai/ui';
import { useTranslation } from 'react-i18next';
import VenueWidget from '../VenueWidget/VenueWidget';

export interface Props {
  memori: Memori;
  open: boolean;
  onClose: (venue?: Venue) => void;
  venue?: Venue;
  setVenue: (venue: Venue) => void;
}

const PositionDrawer = ({ memori, open, onClose, venue, setVenue }: Props) => {
  const { t } = useTranslation();

  return (
    <Drawer
      className="memori-position-drawer"
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
