import { useState } from "react"
import { useNavigate } from "react-router-dom"

import "./Welcome.css"

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
]

export default function Welcome() {
  const navigate = useNavigate()
  const [selectedLang, setSelectedLang] = useState(localStorage.getItem("lang") || "en")

  const changeLanguage = (lang) => {
    setSelectedLang(lang)
    localStorage.setItem("lang", lang)
    let retries = 0
    const interval = setInterval(() => {
      const select = document.querySelector(".goog-te-combo")
      if (select) {
        select.value = lang
        select.dispatchEvent(new Event("change"))
        clearInterval(interval)
      } else if (retries > 20) {
        clearInterval(interval)
      }
      retries++
    }, 400)
  }

  return (
    <div className="welcome-container">
      <h1 className="logo">Arthika</h1>
      <h2 className="title">Welcome to Arthika</h2>
      <p className="subtitle">Choose your language</p>

      <div className="grid">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`lang-btn ${selectedLang === lang.code ? 'selected' : ''}`}
            onClick={() => changeLanguage(lang.code)}
          >
            {lang.label}
          </button>
        ))}
      </div>

      <button className="proceed" onClick={() => navigate("/login")} style={{ boxShadow: "0 4px 15px rgba(251,192,45,0.4)" }}>
        Proceed →
      </button>
    </div>
  )
}