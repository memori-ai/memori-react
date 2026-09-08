import { type MouseEvent, type PointerEvent } from 'react';
export declare function usePressTooltip(defaultOpen?: boolean): {
    open: boolean;
    setOpen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    pressTriggerProps: {
        readonly onPointerDown: (e: PointerEvent) => void;
        readonly onClick: (e: MouseEvent | PointerEvent) => void;
    };
    tooltipProps: {
        readonly open: boolean;
        readonly onOpenChange: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    };
};
