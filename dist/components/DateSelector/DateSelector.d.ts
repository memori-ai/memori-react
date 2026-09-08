/// <reference types="react" />
import { DateTime } from 'luxon';
export interface Props {
    defaultDate?: string | Date;
    disabled?: boolean;
    minAge?: number;
    onChange: (date: DateTime | undefined) => void;
}
declare const DateSelector: import("react").MemoExoticComponent<({ defaultDate, onChange, disabled, minAge }: Props) => JSX.Element>;
export default DateSelector;
