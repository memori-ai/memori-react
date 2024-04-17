import React from 'react';
import { Venue } from '@memori.ai/memori-api-client/dist/types';
import Drawer from '../ui/Drawer';
import { useTranslation } from 'react-i18next';
import VenueWidget from '../VenueWidget/VenueWidget';

export interface Props {
  open: boolean;
  onClose: (venue?: Venue) => void;
  venue?: Venue;
  setVenue: (venue?: Venue) => void;
}

const PositionDrawer = ({ open, onClose, venue, setVenue }: Props) => {
  const { t } = useTranslation();
  return (
    <Drawer
      className="memori-position-drawer"
      open={open}
      onClose={() => onClose(venue)}
      title={t('widget.position') || 'Position'}
      animated={false}
    >
      <VenueWidget venue={venue} setVenue={setVenue} showUncertainty={false} />
    </Drawer>
  );
};

export default PositionDrawer;
