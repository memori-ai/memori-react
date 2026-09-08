export default function _default(): {
    extensions: {
        name: string;
        level: string;
        start(src: any): any;
        tokenizer(src: any, tokens: any): {
            type: string;
            header: string[];
            align: string[];
            rows: string[];
        } | undefined;
        renderer(token: any): string;
    }[];
};
