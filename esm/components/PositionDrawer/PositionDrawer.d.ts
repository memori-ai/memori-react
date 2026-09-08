/// <reference types="react" />
import { Memori, Venue } from '@memori.ai/memori-api-client/dist/types';
export interface Props {
    memori: Memori;
    open: boolean;
    onClose: (venue?: Venue) => void;
    venue?: Venue;
    setVenue: (venue: Venue) => void;
    drawerClassName?: string;
}
declare const PositionDrawer: ({ memori, open, onClose, venue, setVenue, drawerClassName, }: Props) => JSX.Element;
export default PositionDrawer;
