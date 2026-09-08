import React from 'react';
export interface Props {
    sendOnEnter: 'keypress' | 'click';
    setSendOnEnter: (value: 'keypress' | 'click') => void;
}
declare const SendOnEnterMenu: React.FC<Props>;
export default SendOnEnterMenu;
