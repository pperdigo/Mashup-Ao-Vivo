import "./App.css";
import appPromise from "./js/qlik/QlikConnection";
import Home from "./js/Pages/Home";
import Page2 from "./js/Pages/TooltipWithChart";
import { useState, useEffect, createContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

require("bootstrap/dist/css/bootstrap.min.css");

export const AppContext = createContext();
const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/tooltip-with-chart",
    element: <Page2 />,
  },
]);
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
        {/* <Home /> */}
        <RouterProvider router={routes} />
      </div>
    </AppContext.Provider>
  );
}

export default App;
