import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <App />
  </StrictMode>,
)

const savedLang = localStorage.getItem("lang");
if (savedLang) {
  const interval = setInterval(() => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = savedLang;
      select.dispatchEvent(new Event("change"));
      clearInterval(interval);
    }
  }, 500);
}