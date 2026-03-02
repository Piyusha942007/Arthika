import { useNavigate } from "react-router-dom";
import "./Invest.css";

// Use the filenames you provided
import saveIcon from "../../assets/images/save.png";
import learnIcon from "../../assets/images/learninvest.png";

export default function Invest() {
  const navigate = useNavigate();

  return (
    <div className="invest-container">
      {/* NAVBAR */}
      <nav className="invest-navbar">
        <h1 className="logo">Arthika</h1>
        <div className="nav-links">
          <span>learn</span>
          <span>community</span>
          <span className="active">invest</span>
          <span>profile</span>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        <div className="cards-wrapper">
          
          {/* LEFT CARD */}
          <section className="invest-card black-card">
            <h2 className="title-pink">save your<br/>future</h2>
            <div className="icon-container">
               <img src={saveIcon} alt="Save Icon" className="card-img" />
            </div>
            <button className="btn-yellow" onClick={() => navigate("/invest/save")}>
              save
            </button>
          </section>

          {/* RIGHT CARD */}
          <section className="invest-card yellow-card">
            <h2 className="title-white">unlock<br/>knowledge</h2>
            <div className="icon-container">
               <img src={learnIcon} alt="Learn Icon" className="card-img" />
            </div>
            <button className="btn-pink" onClick={() => navigate("/invest/learn")}>
              learn
            </button>
          </section>

        </div>
      </main>

      {/* FOOTER BAR */}
      <div className="footer-gradient"></div>
    </div>
  );
}