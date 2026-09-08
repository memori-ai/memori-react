/// <reference types="react" />
export interface Props {
    src: string;
    poster: string;
    alt?: string;
}
declare const ModelViewer: ({ src, poster, alt }: Props) => JSX.Element;
export default ModelViewer;
