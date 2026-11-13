module.exports = {
  useLeafletContext: () => ({
    map: {
      on: () => {},
      off: () => {},
      remove: () => {},
      addLayer: () => {},
      removeLayer: () => {},
      setView: () => {},
    },
    layerContainer: {
      addLayer: () => {},
      removeLayer: () => {},
    },
  }),
};
