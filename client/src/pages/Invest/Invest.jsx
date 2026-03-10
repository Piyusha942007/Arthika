import { useNavigate } from "react-router-dom";
import "./Invest.css";

// Use the filenames you provided
import saveIcon from "../../assets/images/save.png";
import learnIcon from "../../assets/images/learninvest.png";

export default function Invest() {
  const navigate = useNavigate();

  return (
    <div className="invest-container">
      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        <div className="cards-wrapper">
          
          {/* LEFT CARD */}
          <section className="invest-card black-card" onClick={() => navigate("/invest/save")}>
            <h2 className="title-pink">save your<br/>future</h2>
            <div className="icon-container">
               <img src={saveIcon} alt="Save Icon" className="card-img" />
            </div>
            <button className="btn-yellow">
              save
            </button>
          </section>

          {/* RIGHT CARD */}
          <section className="invest-card yellow-card" onClick={() => navigate("/invest/learn")}>
            <h2 className="title-white">unlock<br/>knowledge</h2>
            <div className="icon-container">
               <img src={learnIcon} alt="Learn Icon" className="card-img" />
            </div>
            <button className="btn-pink">
              learn
            </button>
          </section>

        </div>
      </main>
    </div>
  );
}