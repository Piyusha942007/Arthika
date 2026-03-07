import { useEffect, useState } from "react";
import "./Learn.css";
import treasureChest from "../../assets/images/treasure.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";

export default function Learn() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [highestUnlockedLevel, setHighestUnlockedLevel] = useState(1);
  const [highestUnlockedStage, setHighestUnlockedStage] = useState(1);
  const [completedVideos, setCompletedVideos] = useState(0);
  const [totalVideos, setTotalVideos] = useState(30);
  const [selectedLevel, setSelectedLevel] = useState(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchProgress = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/lessons/progress', {
          headers: { 'x-user-id': user.id }
        });
        if (response.ok) {
          const data = await response.json();
          setHighestUnlockedLevel(data.highestUnlockedLevel);
          setHighestUnlockedStage(data.highestUnlockedStage);
          setCompletedVideos(data.completedVideos);
          setTotalVideos(data.totalVideos);
        }
      } catch (error) {
        console.error("Failed to fetch progress", error);
      }
    };
    fetchProgress();
  }, [isLoaded, user]);

  const stepOffsets = [
    60, -40, -120, -10, 120, 0, -100, 50, 80, -30 // 10 total levels
  ];

  const steps = stepOffsets.map((offset, i) => {
    const level = i + 1;
    let status = "pending";
    if (level < highestUnlockedLevel) status = "completed"; // Reverts to default pink CSS
    else if (level === highestUnlockedLevel) status = "current";

    return { status, label: `LEVEL ${level}`, offset };
  });

  const calculatePath = () => {
    let d = `M ${300 + steps[0].offset} 0`;
    for (let i = 1; i < steps.length; i++) {
      const prevX = 300 + steps[i - 1].offset;
      const prevY = (i - 1) * 200;
      const currX = 300 + steps[i].offset;
      const currY = i * 200;
      d += ` C ${prevX} ${prevY + 100}, ${currX} ${currY - 100}, ${currX} ${currY}`;
    }
    return d;
  };

  return (
    <div className="learn-page">

      {/* Stage Selection Modal */}
      {selectedLevel && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setSelectedLevel(null)}>
          <div style={{
            background: 'white', padding: '40px', borderRadius: '15px',
            textAlign: 'center', maxWidth: '400px', width: '90%'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#f48fb1', marginBottom: '10px' }}>Level {selectedLevel}</h2>
            <p style={{ marginBottom: '25px', color: '#555' }}>Select a stage to continue.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {[1, 2, 3].map(stage => {
                let isUnlocked = false;
                if (selectedLevel < highestUnlockedLevel) isUnlocked = true;
                else if (selectedLevel === highestUnlockedLevel && stage <= highestUnlockedStage) isUnlocked = true;

                return (
                  <button
                    key={stage}
                    onClick={isUnlocked ? () => navigate(`/learn/lesson/${(selectedLevel - 1) * 3 + stage}`) : undefined}
                    style={{
                      padding: '15px 24px',
                      background: isUnlocked ? '#f48fb1' : '#f0f0f0',
                      color: isUnlocked ? 'white' : '#999',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: isUnlocked ? 'pointer' : 'not-allowed',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'background 0.3s'
                    }}
                  >
                    <span>Stage {stage}</span>
                    {!isUnlocked && <span>🔒</span>}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setSelectedLevel(null)}
              style={{ marginTop: '20px', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', textDecoration: 'underline' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <section className="progress-section">
        <h2>YOUR PROGRESS</h2>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${(completedVideos / totalVideos) * 100}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
        <p className="progress-text">{completedVideos}/{totalVideos} Lessons Mastered</p>
      </section>

      <section className="learn-content">
        <div className="info-text-top">
          <h3>Earn Stars by completing a quiz everyday!</h3>
        </div>

        <div className="path-container">
          <svg className="path-svg" viewBox="0 0 600 2000">
            <motion.path
              d={calculatePath()}
              stroke="#222"
              strokeWidth="2"
              fill="transparent"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </svg>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              className={`step ${step.status}`}
              initial={{ opacity: 0, scale: 0.5, x: step.offset }}
              whileInView={{ opacity: 1, scale: 1, x: step.offset }}
              whileHover={{
                scale: 1.15,
                x: step.offset,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              whileTap={{ scale: 0.95, x: step.offset }}
              viewport={{ once: true }}
              onClick={["current", "completed"].includes(step.status) ? () => setSelectedLevel(i + 1) : undefined}
            >
              {step.status === "current" && (
                <div className="current-indicator-wrapper">
                  <span className="level-tag">{step.label}</span>
                  <motion.div
                    className="start-now-text"
                    animate={{ x: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    Start now ➔
                  </motion.div>
                </div>
              )}
              <span className="step-number">✓</span>
            </motion.div>
          ))}

          <motion.div
            className="reward-container"
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          >
            <img src={treasureChest} alt="Reward" className="treasure-chest" />
            <p className="reward-text">Unlock Chest!</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}