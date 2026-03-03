import React, { useState, useEffect } from "react";
import "./Save.css";
import dollarIcon from "../../assets/images/dollar-icon.png";

export default function Save() {
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem("invest_goals");
    return savedGoals ? JSON.parse(savedGoals) : [
      { id: 1, title: "College Fund", target: 100000, saved: 0, percentage: 0, colorClass: "pink-card", progressBg: "#DD6890", progressFill: "#FFCC4D" }
    ];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [newGoal, setNewGoal] = useState({ title: "", target: "" });
  const [savingsInput, setSavingsInput] = useState({});

  useEffect(() => {
    localStorage.setItem("invest_goals", JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.target) return;
    const colorConfigs = [
      { colorClass: "pink-card", progressBg: "#DD6890", progressFill: "#FFCC4D" },
      { colorClass: "yellow-card", progressBg: "#FEFEFE", progressFill: "#DF769A" },
      { colorClass: "white-card", progressBg: "#DF769A", progressFill: "#FED05E" }
    ];
    const config = colorConfigs[goals.length % 3];
    const createdGoal = {
      id: Date.now(),
      title: newGoal.title,
      target: parseFloat(newGoal.target),
      saved: 0,
      percentage: 0,
      ...config
    };
    setGoals([...goals, createdGoal]);
    setNewGoal({ title: "", target: "" });
  };

  const handleUpdateProgress = (id, amount) => {
    const deposit = parseFloat(amount);
    if (!deposit || deposit <= 0) return;

    let errorOccurred = false;

    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const newSaved = g.saved + deposit;
        
        // ERROR CHECK: Don't let value exceed target
        if (newSaved > g.target) {
          alert(`❌ Error: You cannot save more than your target of ₹${g.target.toLocaleString('en-IN')}. Remaining needed: ₹${(g.target - g.saved).toLocaleString('en-IN')}`);
          errorOccurred = true;
          return g;
        }

        const newPerc = Math.min(Math.round((newSaved / g.target) * 100), 100);
        return { ...g, saved: newSaved, percentage: newPerc };
      }
      return g;
    }));

    if (!errorOccurred) {
      setSavingsInput({ ...savingsInput, [id]: "" });
    }
  };

  const handleDeleteGoal = (id) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      setGoals(goals.filter(g => g.id !== id));
    }
  };

  const filteredGoals = goals.filter(g => g.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="save-container">
      <header className="save-header centered">
        <div className="title-wrapper">
          <h1 className="save-title">Save Money</h1>
          <div className="dollar-badge">
             <img src={dollarIcon} alt="coin" className="coin-img" />
          </div>
        </div>
      </header>

      <main className="save-content">
        <section className="goal-input-card">
          <h3 className="section-label">Create a New Saving Goal</h3>
          <div className="input-row">
            <input type="text" placeholder="Goal Name" value={newGoal.title} onChange={(e) => setNewGoal({...newGoal, title: e.target.value})} />
            <input type="number" placeholder="Target Amount (₹)" value={newGoal.target} onChange={(e) => setNewGoal({...newGoal, target: e.target.value})} />
            <button onClick={handleAddGoal} className="primary-btn">Set Goal</button>
          </div>
        </section>

        <div className="search-section">
          <input type="text" className="search-bar" placeholder="🔍 Search your goals..." onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="goals-grid">
          {filteredGoals.map((goal) => (
            <div key={goal.id} className={`goal-card ${goal.colorClass} ${goal.percentage === 100 ? "goal-completed" : ""}`}>
              <button className="delete-x" onClick={() => handleDeleteGoal(goal.id)}>✕</button>
              
              <div className="goal-info">
                <h2 className="goal-name">{goal.title} {goal.percentage === 100 && "🎉"}</h2>
                <div className="amount-info">
                   <span className="current-amt">₹{goal.saved.toLocaleString('en-IN')}</span> 
                   <span className="target-amt">/ ₹{goal.target.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="progress-container" style={{ backgroundColor: goal.progressBg }}>
                <div className="progress-bar" style={{ width: `${goal.percentage}%`, backgroundColor: goal.progressFill }}></div>
              </div>

              {goal.percentage < 100 ? (
                <div className="update-controls">
                  <input type="number" placeholder="Amount saved today (₹)" value={savingsInput[goal.id] || ""} onChange={(e) => setSavingsInput({...savingsInput, [goal.id]: e.target.value})} />
                  <button className="add-savings-btn" onClick={() => handleUpdateProgress(goal.id, savingsInput[goal.id])}>Add Savings</button>
                </div>
              ) : (
                <div className="congrats-msg">Goal Achieved!</div>
              )}
              
              <p className="goal-perc-label"><strong>{goal.percentage}%</strong> saved</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}