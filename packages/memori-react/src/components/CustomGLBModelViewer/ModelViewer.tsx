import React, { useEffect } from 'react';

export interface Props {
  src: string;
  poster: string;
  alt?: string;
}

const ModelViewer = ({ src, poster, alt = '' }: Props) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    script.type = 'module';
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  return (
    <div className="model-viewer">
      {/* @ts-ignore */}
      <model-viewer
        src={src}
        ios-src=""
        poster={poster}
        alt={alt}
        shadow-intensity="1"
        disable-zoom
        camera-controls
        autoplay
      />
    </div>
  );
};

export default ModelViewer;
