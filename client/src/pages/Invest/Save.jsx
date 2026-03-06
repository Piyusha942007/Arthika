import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import "./Save.css";
import dollarIcon from "../../assets/images/dollar-icon.png";

export default function Save() {

  const { user } = useUser();

  const [goals, setGoals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newGoal, setNewGoal] = useState({ title: "", target: "" });
  const [savingsInput, setSavingsInput] = useState({});

  const API = "http://localhost:5000/api/goals";


  /* FETCH GOALS */
  useEffect(() => {

    if (!user) return;

    const fetchGoals = async () => {

      try {
        const res = await fetch(`${API}/${user.id}`);
        const data = await res.json();
        setGoals(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }

    };

    fetchGoals();

  }, [user]);


  /* ADD GOAL */
  const handleAddGoal = async () => {

    if (!newGoal.title || !newGoal.target) return;

    try {

      const goalToSave = {
        clerkId: user.id,
        title: newGoal.title,
        targetAmount: Number(newGoal.target)
      };

      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goalToSave)
      });

      const savedGoal = await res.json();

      setGoals([...goals, savedGoal]);
      setNewGoal({ title: "", target: "" });

    } catch (err) {
      console.error(err);
    }

  };


  /* ADD SAVINGS */
  const handleUpdateProgress = async (id) => {

    const amountToAdd = Number(savingsInput[id]);

    if (!amountToAdd || isNaN(amountToAdd)) return;

    try {

      const res = await fetch(`${API}/add/${id}`, {

        method: "PUT",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ amount: amountToAdd })

      });

      const updatedGoal = await res.json();

      setGoals(goals.map(g => g._id === id ? updatedGoal : g));

      setSavingsInput({ ...savingsInput, [id]: "" });

    } catch (err) {
      console.error(err);
    }

  };


  /* DELETE GOAL */
  const handleDeleteGoal = async (id) => {

    try {

      await fetch(`${API}/${id}`, { method: "DELETE" });

      setGoals(goals.filter(g => g._id !== id));

    } catch (err) {
      console.error(err);
    }

  };


  /* SEARCH */
  const filteredGoals = goals.filter(g =>
    g.title.toLowerCase().includes(searchTerm.toLowerCase())
  );


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


        {/* CREATE GOAL */}

        <section className="goal-input-card">

          <h3 className="section-label">Create a New Saving Goal</h3>

          <div className="input-row">

            <input
              type="text"
              placeholder="Goal Name"
              value={newGoal.title}
              onChange={(e) =>
                setNewGoal({ ...newGoal, title: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Target Amount"
              value={newGoal.target}
              onChange={(e) =>
                setNewGoal({ ...newGoal, target: e.target.value })
              }
            />

            <button onClick={handleAddGoal} className="primary-btn">
              Set Goal
            </button>

          </div>

        </section>


        {/* SEARCH */}

        <input
          className="search-bar"
          placeholder="Search goals"
          onChange={(e) => setSearchTerm(e.target.value)}
        />


        {/* GOALS */}

        <div className="goals-grid">

          {filteredGoals.map((goal) => {

            // MATH FIX: Ensure values are treated as numbers and handle potential 0/null
            const saved = parseFloat(goal.savedAmount || 0);
            const target = parseFloat(goal.targetAmount || 1);

            // Calculation: (Current / Total) * 100
            const rawPercentage = (saved / target) * 100;
            const percentage = Math.min(Math.round(rawPercentage), 100);

            const remaining = target - saved;
            const monthlyTip = Math.ceil(remaining / 6);
            const isCompleted = percentage >= 100;

            return (

              <div key={goal._id} className={`goal-card ${isCompleted ? 'goal-completed' : ''}`}>

                <button
                  className="delete-x"
                  onClick={() => handleDeleteGoal(goal._id)}
                >
                  ✕
                </button>
                
                <div className="goal-card-header">
                  <h2>{goal.title}</h2>
                  <p className="percentage-text">{percentage}% saved</p>
                </div>

                <p className="amount-display">
                  ₹{saved.toLocaleString("en-IN")} / ₹{target.toLocaleString("en-IN")}
                </p>


                {/* PROGRESS BAR */}

                <div className="progress-container">

                  <div
                    className="progress-bar"
                    style={{ width: `${percentage}%` }}
                  />

                </div>


                {/* SMART TIP */}

                {!isCompleted && (

                  <p className="saving-tip">
                    💡 Save ₹{monthlyTip.toLocaleString("en-IN")} monthly to reach your goal in 6 months
                  </p>

                )}


                {!isCompleted && (

                  <div className="update-controls">

                    <input
                      type="number"
                      placeholder="Add savings"
                      value={savingsInput[goal._id] || ""}
                      onChange={(e) =>
                        setSavingsInput({
                          ...savingsInput,
                          [goal._id]: e.target.value
                        })
                      }
                    />

                    <button
                      className="add-savings-btn"
                      onClick={() => handleUpdateProgress(goal._id)}
                    >
                      Add Savings
                    </button>

                  </div>

                )}

              </div>

            );

          })}

        </div>

      </main>

    </div>

  );

}