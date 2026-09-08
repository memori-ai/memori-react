/// <reference types="react" />
import { Venue } from '@memori.ai/memori-api-client/dist/types';
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
declare const VenueWidget: ({ venue, setVenue, showUncertainty, showGpsButton, saveAndClose, }: Props) => JSX.Element;
export default VenueWidget;
