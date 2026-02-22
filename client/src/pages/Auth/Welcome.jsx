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

  const changeLanguage = (lang) => {
    const select = document.querySelector(".goog-te-combo")
    if (!select) return
    select.value = lang
    select.dispatchEvent(new Event("change"))
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
            className="lang-btn"
            onClick={() => changeLanguage(lang.code)}
          >
            {lang.label}
          </button>
        ))}
      </div>

      <button className="proceed" onClick={() => navigate("/login")}>
        Proceed →
      </button>
    </div>
  )
}