import { Venue } from '@memori.ai/memori-api-client/dist/types';
import { Button } from '@memori.ai/ui';
import React from 'react';
export interface PositionPopoverProps {
    venue?: Venue;
    setVenue: (venue?: Venue) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    triggerClassName?: string;
    triggerButtonVariant?: React.ComponentProps<typeof Button>['variant'];
    triggerAriaLabel: string;
    positionerClassName?: string;
    autoStartGeolocation?: boolean;
}
export interface PositionPopoverContentProps {
    venue?: Venue;
    setVenue: (venue?: Venue) => void;
    autoStartGeolocation?: boolean;
}
export declare const PositionPopoverContent: React.FC<PositionPopoverContentProps>;
declare const PositionPopover: React.FC<PositionPopoverProps>;
export default PositionPopover;
