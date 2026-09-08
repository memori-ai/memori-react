import React from 'react';
export interface Props {
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: number;
    label?: string | React.ReactNode;
    onChange?: (value: number) => void;
    disabled?: boolean;
}
declare const CustomSlider: ({ min, max, step, defaultValue, label, onChange, disabled, }: Props) => JSX.Element;
export default CustomSlider;
