import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./pages/Home.js";
import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'light';
  });
  
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
        
  return (
    <BrowserRouter>
      <Home
        theme={theme}
        toggleTheme={toggleTheme}
      /> 
    </BrowserRouter>
  );
}

export default App;
