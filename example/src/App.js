import logo from './logo.svg';
import Memori from '@memori.ai/memori-react';
import '@memori.ai/memori-react/dist/styles.css';

function App() {
  return (
    <Memori
      memoriName="Memori"
      ownerUserName="memoridev"
      tenantID="aisuru.com"
      apiURL="https://backend.memori.ai"
      baseURL="https://aisuru.com"
      uiLang="it"
      showShare
      height="100vh"
    />
  );
}

export default App;
