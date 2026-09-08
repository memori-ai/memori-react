/// <reference types="react" />
export interface Props<T = any> {
    className?: string;
    value?: T;
    name?: string;
    displayValue?: string;
    onChange: (value: T) => void;
    options: {
        value: T;
        label: any;
    }[];
    disabled?: boolean;
    label?: string;
    placeholder?: string;
}
declare const Select: ({ className, value, name, displayValue, options, onChange, disabled, label, placeholder, }: Props) => JSX.Element;
export default Select;
