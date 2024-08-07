import React from 'react';

const MapContainer = ({ children }) => (
  <div data-testId="MapContainer">{children}</div>
);

const useMap = () => ({ setView: () => {} });

const TileLayer = () => <div data-testId="TileLayer" />;

const Marker = ({ children }) => <div data-testId="Marker">{children}</div>;

const Popup = () => <div data-testId="Popup" />;

export { MapContainer, TileLayer, Marker, Popup, useMap };
