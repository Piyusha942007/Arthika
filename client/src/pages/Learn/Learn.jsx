import { useEffect, useState } from "react";
import axios from "axios";
import "./Learn.css";
import treasureOpen from "../../assets/images/treasure.png";
import treasureClosed from "../../assets/images/treasure_closed.png";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { allBadges } from "../../constants/badges";
import API_BASE_URL from "../../config/apiConfig";

export default function Learn() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  // --- Optimized State Initialization (Instant Load from Cache) ---
  const [highestUnlockedLevel, setHighestUnlockedLevel] = useState(() => 
    parseInt(localStorage.getItem("highestUnlockedLevel") || "1")
  );
  const [highestUnlockedStage, setHighestUnlockedStage] = useState(() => 
    parseInt(localStorage.getItem("highestUnlockedStage") || "1")
  );
  const [completedVideos, setCompletedVideos] = useState(() => 
    parseInt(localStorage.getItem("completedVideos") || "0")
  );
  const [totalVideos, setTotalVideos] = useState(() => 
    parseInt(localStorage.getItem("totalVideos") || "30")
  );
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [language, setLanguage] = useState(() => localStorage.getItem("lang") || "en");

  // --- Animation States ---
  const [isChestOpen, setIsChestOpen] = useState(false);
  const [badgeQueue, setBadgeQueue] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [flyingBadge, setFlyingBadge] = useState(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchProgress = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/lessons/progress`, {
          params: { lang: language, t: Date.now() },
          headers: { 'x-user-id': user.id }
        });
        
        const data = response.data;
        if (data) {
          // Update State
          setHighestUnlockedLevel(data.highestUnlockedLevel || 1);
          setHighestUnlockedStage(data.highestUnlockedStage || 1);
          setCompletedVideos(data.completedVideos || 0);
          setTotalVideos(data.totalVideos || 30);

          // Update Cache for next visit
          localStorage.setItem("highestUnlockedLevel", (data.highestUnlockedLevel || 1).toString());
          localStorage.setItem("highestUnlockedStage", (data.highestUnlockedStage || 1).toString());
          localStorage.setItem("completedVideos", (data.completedVideos || 0).toString());
          localStorage.setItem("totalVideos", (data.totalVideos || 30).toString());
        }
      } catch (error) {
        console.error("DEBUG: Failed to fetch progress", error);
      }
    };
    fetchProgress();
  }, [isLoaded, user, language]);

  // --- Detection of New Badges ---
  useEffect(() => {
    if (highestUnlockedLevel <= 1) return;

    const lastSeen = parseInt(localStorage.getItem("lastSeenLevel") || "1");
    if (highestUnlockedLevel > lastSeen) {
      const latestBadgeLevel = highestUnlockedLevel - 1;
      const b = allBadges.find((badge) => badge.level === latestBadgeLevel);
      if (b) {
        setBadgeQueue(prev => [...prev, b]);
        localStorage.setItem("lastSeenLevel", highestUnlockedLevel.toString());
      }
    }
  }, [highestUnlockedLevel]);

  // --- Animation Sequencer ---
  useEffect(() => {
    if (badgeQueue.length > 0 && !isAnimating) {
      handleNextBadgeAnimation();
    }
  }, [badgeQueue, isAnimating]);

  const handleNextBadgeAnimation = async () => {
    setIsAnimating(true);
    const badge = badgeQueue[0];

    // 1. Open Chest
    setIsChestOpen(true);
    await new Promise(r => setTimeout(r, 600));

    // 2. Set Flying Badge (Rising phase)
    const chestEl = document.querySelector(".reward-container");
    if (!chestEl) {
        setIsAnimating(false);
        return;
    }
    const chestRect = chestEl.getBoundingClientRect();

    setFlyingBadge({
      ...badge,
      startX: chestRect.left + chestRect.width / 2 - 40,
      startY: chestRect.top - 40,
      midY: 100, 
    });

    // 3. Wait for rise, then fly
    await new Promise(r => setTimeout(r, 800));

    const targetEl = document.getElementById("navbar-profile-pill");
    if (targetEl) {
      const targetRect = targetEl.getBoundingClientRect();
      setFlyingBadge(prev => prev ? {
        ...prev,
        targetX: targetRect.left + targetRect.width / 2 - 25,
        targetY: targetRect.top + targetRect.height / 2 - 25
      } : null);
    }

    // 4. Cleanup
    await new Promise(r => setTimeout(r, 1200));
    setFlyingBadge(null);
    setIsChestOpen(false);
    setBadgeQueue(prev => prev.slice(1));
    setIsAnimating(false);
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  const stepOffsets = [
    60, -40, -120, -10, 120, 0, -100, 50, 80, -30 
  ];

  const steps = stepOffsets.map((offset, i) => {
    const level = i + 1;
    let status = "pending";
    if (level < highestUnlockedLevel) status = "completed"; 
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
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
        <select
          value={language}
          onChange={handleLanguageChange}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="mr">मराठी</option>
        </select>
      </div>

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
            initial={false}
            animate={{ width: `${(completedVideos / totalVideos) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <p className="progress-text" key={completedVideos}>
          <span className="notranslate">{completedVideos}</span>/<span className="notranslate">{totalVideos}</span> Lessons Mastered
        </p>
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
              transition={{ duration: 1.2, ease: "easeInOut" }}
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
              onClick={() => {
                if (["current", "completed"].includes(step.status)) {
                  setSelectedLevel(i + 1);
                } else {
                  toast.info("Please complete the previous levels to unlock this one!", {
                    position: "top-center",
                    autoClose: 3000,
                  });
                }
              }}
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
            <img src={isChestOpen ? treasureOpen : treasureClosed} alt="Reward" className="treasure-chest" />
            <p className="reward-text">{isChestOpen ? "Chest Opened!" : "Unlock Chest!"}</p>
          </motion.div>

          <AnimatePresence>
            {flyingBadge && (
              <motion.div
                className="flying-badge"
                initial={{
                  opacity: 0,
                  scale: 0.5,
                  left: flyingBadge.startX,
                  top: flyingBadge.startY
                }}
                animate={{
                  opacity: 1,
                  scale: [0.5, 1.2, 1],
                  left: flyingBadge.targetX !== undefined ? [flyingBadge.startX, flyingBadge.startX, flyingBadge.targetX] : flyingBadge.startX,
                  top: flyingBadge.targetX !== undefined
                    ? [flyingBadge.startY, flyingBadge.midY, flyingBadge.targetY]
                    : [flyingBadge.startY, flyingBadge.midY],
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{
                  duration: flyingBadge.targetX !== undefined ? 1.5 : 0.8,
                  times: flyingBadge.targetX !== undefined ? [0, 0.4, 1] : [0, 1],
                  ease: "easeInOut"
                }}
              >
                <div className="badge-icon-wrapper" style={{ backgroundColor: flyingBadge.color }}>
                  <span className="badge-icon-reveal">{flyingBadge.icon}</span>
                </div>
                <div className="badge-name-reveal">{flyingBadge.name}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
}