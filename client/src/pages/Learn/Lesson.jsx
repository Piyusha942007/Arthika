import { useEffect } from "react"; // 1. Import useEffect
import "./Lesson.css";
import shgs from "../../assets/images/shg.png";

export default function Lesson() {
  
  // 2. Add this Hook to force the window to the top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="lesson-page">
      {/* NAVBAR */}
      <div className="lesson-navbar">
        <div className="logo">Arthika</div>
        <div className="nav-links">
          <span className="active">learn</span>
          <span>community</span>
          <span>invest</span>
          <span>profile</span>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="lesson-progress">
        <h2>PROGRESS BAR</h2>
        <div className="progress-track">
          <div className="progress-fill"></div>
        </div>
        <p>30/50 videos</p>
      </div>

      {/* VIDEO CARD */}
      <div className="lesson-card">
        <h3>Lesson 06) What is a SHG?</h3>

        <div className="video-box">
          <img src={shgs} alt="Lesson" />
        </div>

        <div className="video-controls">
          <span>↺ 10</span>
          <span>⏸</span>
          <span>10 ↻</span>
        </div>
      </div>

      {/* QUIZ CTA */}
      <div className="quiz-btn">TAKE A QUIZ!</div>

      {/* QUESTION */}
      <div className="quiz-box">
        <div className="quiz-header">
          <h4>Q1) What is the full form of SHGS?</h4>
          <span className="timer-text">1M</span>
        </div>

        <ul>
          <li>A) Self help groups</li>
          <li>|B) Self health groups</li>
          <li>C) Selfish help groups</li>
          <li>D) Selfless help groups</li>
        </ul>
      </div>

      {/* FOOTER GRADIENT */}
      <div className="lesson-footer-gradient"></div>
    </div>
  );
}