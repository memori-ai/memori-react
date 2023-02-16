import logo from './logo.svg';
import Memori from '@memori.ai/memori-react';
import '@memori.ai/memori-react/dist/styles.css';

function App() {
  return (
    <Memori
      memoriName="Memori"
      ownerUserName="nunziofiore"
      tenantID="app.memorytwin.com"
      apiURL="https://backend.memori.ai"
      baseURL="https://app.memorytwin.com"
      uiLang="it"
      showShare
      height="100vh"
    />
  );
}

export default App;
