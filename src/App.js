import './App.css';
import Home from './js/Pages/Home'
import appPromise from './js/qlik/QlikConnection'
import { useState, useEffect, createContext } from 'react'

export const AppContext = createContext()

function App() {
  const [app, setApp] = useState()
  
  useEffect(()=>{
    appPromise.then( app => {
      setApp(app)
    })
  }, [])


  if (!app) return 'Carregando Qlik. Por favor aguarde.'

  return (
    <AppContext.Provider value = {app}>
      <div className="App">
        <Home/>
      </div>
    </AppContext.Provider>
    
  );
}

export default App;
