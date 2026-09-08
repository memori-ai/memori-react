export declare const keys: {
    [key: string]: string;
};
export declare const getLocalConfig: <Type>(key: string, defaultValue: Type) => Type;
export declare const setLocalConfig: (key: string, value: any) => void;
export declare const removeLocalConfig: (key: string) => void;
