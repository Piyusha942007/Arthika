import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../../assets/images/arthikalogo.jpeg";
import "./Welcome.css";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "mr", label: "मराठी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "bn", label: "বাংলা" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
  { code: "ur", label: "اردو" },
  { code: "ml", label: "മലയാളം" },
];

export default function Welcome() {
  const nav = useNavigate();
  const [selectedLang, setSelectedLang] = useState(localStorage.getItem("lang") || "en");

  const changeLanguage = (langCode) => {
    setSelectedLang(langCode);
    localStorage.setItem("lang", langCode);
    let retries = 0;
    const interval = setInterval(() => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event("change"));
        clearInterval(interval);
      } else if (retries > 10) {
        clearInterval(interval);
      }
      retries++;
    }, 500);
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content-wrapper">
        
        {/* Left Side: Branding */}
        <div className="left-panel">
          <img src={logoImg} alt="Arthika" className="side-logo" />
          <h1 className="brand-name-center">Arthika</h1>
          <p className="side-tagline">Your money, your decision</p>
        </div>

        {/* Right Side: Language Selection */}
        <div className="right-panel">
          <h2 className="side-heading">Welcome To Arthika</h2>
          <p className="side-subtitle">Choose Your Language</p>
          
          <div className="side-grid">
            {languages.map((lang) => (
              <button 
                key={lang.code} 
                className={`side-lang-btn ${selectedLang === lang.code ? 'selected' : ''}`}
                onClick={() => changeLanguage(lang.code)}
                style={{
                  borderColor: selectedLang === lang.code ? '#FBC02D' : '#eee',
                  background: selectedLang === lang.code ? '#FFF9E3' : 'white',
                  transform: selectedLang === lang.code ? 'translateY(-3px)' : 'none',
                  boxShadow: selectedLang === lang.code ? '0 5px 15px rgba(0, 0, 0, 0.05)' : 'none',
                  fontWeight: selectedLang === lang.code ? '800' : '600'
                }}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <button className="side-proceed" onClick={() => nav("/login")}>
            Proceed →
          </button>
        </div>

      </div>
    </div>
  );
}