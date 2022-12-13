import React from 'react';
import Memori from '@memori.ai/memori-react';

import './App.css';

const App = () => {
  return (
    <div className="App">
      <Memori
        memoriName="Nicola"
        ownerUserName="nzambello"
        tenantID="app.memorytwin.com"
        showShare
        apiURL="https://backend.memori.ai"
        baseURL="https://app.memorytwin.com"
        uiLang="it"
        height="100vh"
      />
    </div>
  );
};

export default App;
