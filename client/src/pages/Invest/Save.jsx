import React from "react";
import { useNavigate } from "react-router-dom";
import "./Save.css";
import dollarIcon from "../../assets/images/dollar-icon.png";

const savingGoals = [
  {
    id: 1,
    title: "College Fund",
    percentage: 50,
    colorClass: "pink-card",
    progressBg: "#DD6890",
    progressFill: "#FFCC4D",
  },
  {
    id: 2,
    title: "Business",
    percentage: 65,
    colorClass: "yellow-card",
    progressBg: "#FEFEFE",
    progressFill: "#DF769A",
  },
  {
    id: 3,
    title: "Groceries",
    percentage: 96,
    colorClass: "white-card",
    progressBg: "#DF769A",
    progressFill: "#FED05E",
  },
];

export default function Save() {
  const navigate = useNavigate();

  return (
    <div className="save-container">
      {/* HEADER SECTION */}
      <header className="save-header">
        <div className="title-wrapper">
          <h1 className="save-title">Save Money</h1>
          <div className="dollar-badge">
             <img src={dollarIcon} alt="coin" className="coin-img" />
          </div>
        </div>
      </header>

      {/* PROGRESS LIST */}
      <main className="save-content">
        {savingGoals.map((goal) => (
          <div key={goal.id} className={`goal-card ${goal.colorClass}`}>
            <div className="goal-info">
              <h2 className="goal-name">{goal.title}</h2>
              <p className="goal-stats">
                <strong>{goal.percentage}%</strong> saved
              </p>
            </div>
            <div className="progress-container" style={{ backgroundColor: goal.progressBg }}>
              <div
                className="progress-bar"
                style={{
                  width: `${goal.percentage}%`,
                  backgroundColor: goal.progressFill
                }}
              ></div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}