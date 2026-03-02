import "./Learn.css";
import treasureChest from "../../assets/images/treasure.png";
import { useNavigate } from "react-router-dom";

export default function Learn() {
  const navigate = useNavigate();

  const steps = [
    { status: "completed" },
    { status: "completed" },
    { status: "completed" },
    { status: "completed" },
    { status: "completed" },
    { status: "current", label: "LEVEL 6" },
    { status: "pending" },
    { status: "pending" },
  ];

  return (
    <div className="learn-page">
      {/* NAVBAR */}
      <header className="learn-navbar">
        <div className="logo">Arthika</div>
        <nav className="nav-links">
          <span className="active">learn</span>
          <span>community</span>
          <span>invest</span>
          <span>profile</span>
        </nav>
      </header>

      {/* PROGRESS BAR */}
      <section className="progress-section">
        <h2>PROGRESS BAR</h2>
        <div className="progress-bar">
          <div className="progress-fill" />
        </div>
        <p className="progress-text">30/50 videos</p>
      </section>

      {/* MAIN CONTENT */}
      <section className="learn-content">
        <div className="info-text-top">
          <h3>Earn Stars by completing a quiz everyday!</h3>
        </div>

        {/* PATH */}
        <div className="path">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`step ${step.status}`}
              onClick={
                step.status === "current"
                  ? () => navigate("/learn/lesson/6")
                  : undefined
              }
            >
              {step.status === "current" && (
                <>
                  <span className="level-tag">{step.label}</span>

                  <div
                    className="start-now-bubble"
                    onClick={() => navigate("/learn/lesson/6")}
                  >
                    Start now →
                  </div>
                </>
              )}
              ✓
            </div>
          ))}
        </div>
      </section>

      {/* REWARD */}
      <section className="reward">
        <img src={treasureChest} alt="Treasure Reward" />
      </section>
    </div>
  );
}