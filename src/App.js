import "./App.css";
import appPromise from "./js/qlik/QlikConnection";
import Home from "./js/Pages/Home";
import { useState, useEffect, createContext } from "react";

export const AppContext = createContext();

require("bootstrap/dist/css/bootstrap.min.css");

function App() {
  const [app, setApp] = useState(undefined);

  useEffect(() => {
    appPromise.then((app) => {
      setApp(app);
    });
  }, []);

  if (!app) return "Carregando Qlik. Por favor aguarde.";

  return (
    <AppContext.Provider value={app}>
      <div className="App">
        <Home />
      </div>
    </AppContext.Provider>
  );
}

export default App;
