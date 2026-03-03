import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react"; // Import Clerk hook
import "./Save.css";
import dollarIcon from "../../assets/images/dollar-icon.png";

export default function Save() {
  const { user } = useUser(); // Get unique user ID
  const [displayGoals, setDisplayGoals] = useState([]);

  const fetchGoals = async () => {
    if (!user) return;
    try {
      // Send userId so the backend knows who is asking
      const response = await fetch(`http://localhost:5000/api/invest/goals?userId=${user.id}`);
      const data = await response.json();
      setDisplayGoals(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const handleSaveMoney = async (goalTitle) => {
    if (!user) return;
    try {
      const response = await fetch("http://localhost:5000/api/invest/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send userId so the backend updates the correct record
        body: JSON.stringify({ title: goalTitle, userId: user.id }),
      });
      if (response.ok) fetchGoals();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  return (
    <div className="save-container">
      <header className="save-header">
        <div className="title-wrapper">
          <h1 className="save-title">Save Money</h1>
          <div className="dollar-badge">
            <img src={dollarIcon} alt="coin" className="coin-img" />
          </div>
        </div>
        <p style={{textAlign: 'center', color: '#666'}}>
          Logged in as: <strong>{user?.firstName || "Guest"}</strong>
        </p>
      </header>

      <main className="save-content">
        {displayGoals.map((goal, index) => (
          <div key={index} className={`goal-card ${goal.colorClass}`} onClick={() => handleSaveMoney(goal.title)} style={{ cursor: 'pointer' }}>
            <div className="goal-info">
              <h2 className="goal-name">{goal.title}</h2>
              <p className="goal-stats"><strong>{goal.percentage}%</strong> saved</p>
            </div>
            <div className="progress-container" style={{ backgroundColor: goal.progressBg }}>
              <div className="progress-bar" style={{ width: `${goal.percentage}%`, backgroundColor: goal.progressFill, transition: 'width 0.4s' }}></div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}