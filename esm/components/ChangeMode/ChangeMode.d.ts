import React from 'react';
export interface Props {
    instruct?: boolean;
    onChangeMode: (mode: 'test' | 'instruct') => void;
    canInstruct?: boolean;
}
declare const ChangeMode: React.FC<Props>;
export default ChangeMode;
