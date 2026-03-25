import { useEffect, useState } from "react";
import axios from "axios";
import "./Learn.css";
import treasureOpen from "../../assets/images/treasure.png";
import treasureClosed from "../../assets/images/treasure_closed.png";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
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
  const [totalCoins, setTotalCoins] = useState(() => {
    const cached = localStorage.getItem("totalCoins");
    const parsed = parseInt(cached);
    return isNaN(parsed) ? 0 : parsed;
  });
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [language] = useState(() => localStorage.getItem("lang") || "en");

  // Coin Counting Animation Logic
  const springCoins = useSpring(0, { stiffness: 40, damping: 20 });
  const displayCoins = useTransform(springCoins, (latest) => Math.floor(latest));

  useEffect(() => {
    springCoins.set(totalCoins || 0);
  }, [totalCoins, springCoins]);

  // --- Animation States ---
  const [isChestOpen, setIsChestOpen] = useState(false);
  const [badgeQueue, setBadgeQueue] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [flyingBadge, setFlyingBadge] = useState(null);

  // Burst Animation on Mount
  const [burstCoins, setBurstCoins] = useState([]);
  useEffect(() => {
    const coins = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      angle: (Math.random() * 360) * (Math.PI / 180),
      distance: 60 + Math.random() * 120,
      delay: Math.random() * 0.2
    }));
    setBurstCoins(coins);
    setTimeout(() => setBurstCoins([]), 2000);
  }, []);

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
          setTotalCoins(data.totalCoins || 0);

          // Update Cache for next visit
          localStorage.setItem("highestUnlockedLevel", (data.highestUnlockedLevel || 1).toString());
          localStorage.setItem("highestUnlockedStage", (data.highestUnlockedStage || 1).toString());
          localStorage.setItem("completedVideos", (data.completedVideos || 0).toString());
          localStorage.setItem("totalVideos", (data.totalVideos || 30).toString());
          localStorage.setItem("totalCoins", (data.totalCoins || 0).toString());
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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.1 } 
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="learn-page">
      {/* Coin Bank Display - Positioned fixed below Navbar */}
      <div style={{ position: 'fixed', top: '100px', right: '30px', zIndex: 9999 }}>
        <motion.div 
          style={{ 
            pointerEvents: 'auto',
            cursor: 'pointer'
          }}
          initial={{ scale: 0, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          whileHover={{ scale: 1.1, translateY: -2 }}
          whileTap={{ scale: 0.95 }}
          id="coin-bank"
        >
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(10px)',
            padding: '12px 24px', 
            borderRadius: '35px',
            border: '4px solid #ffcc4d', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            boxShadow: '0 8px 32px rgba(255, 204, 77, 0.3)', 
            fontWeight: '900', 
            fontSize: '24px',
            color: '#333',
            minWidth: '120px',
            justifyContent: 'center'
          }}>
            <motion.span 
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              style={{ fontSize: '32px' }}
            >
              🪙
            </motion.span>
            <motion.span className="notranslate">{displayCoins}</motion.span>
          </div>
        </motion.div>

        {/* Burst Animation Coins */}
        <AnimatePresence>
          {burstCoins.map((coin) => (
            <motion.div
              key={coin.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
              animate={{ 
                x: Math.cos(coin.angle) * coin.distance,
                y: Math.sin(coin.angle) * coin.distance,
                opacity: 0,
                scale: 1
              }}
              transition={{ duration: 1, delay: coin.delay, ease: "easeOut" }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                fontSize: '32px',
                pointerEvents: 'none'
              }}
            >
              🪙
            </motion.div>
          ))}
        </AnimatePresence>
      </div>


      {/* Stage Selection Modal */}
      <AnimatePresence>
        {selectedLevel && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }} 
            onClick={() => setSelectedLevel(null)}
          >
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                background: 'rgba(255, 255, 255, 0.95)', 
                padding: '40px', 
                borderRadius: '30px',
                textAlign: 'center', 
                maxWidth: '450px', 
                width: '90%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.3)'
              }} 
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ 
                color: '#333', 
                fontSize: '2.2rem', 
                marginBottom: '10px',
                background: 'linear-gradient(45deg, #f48fb1, #ffcc4d)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '900'
              }}>Level {selectedLevel}</h2>
              <p style={{ marginBottom: '30px', color: '#666', fontSize: '1.1rem' }}>Choose your challenge!</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {[1, 2, 3].map(stage => {
                  let isUnlocked = false;
                  if (selectedLevel < highestUnlockedLevel) isUnlocked = true;
                  else if (selectedLevel === highestUnlockedLevel && stage <= highestUnlockedStage) isUnlocked = true;

                  return (
                    <motion.button
                      key={stage}
                      variants={itemVariants}
                      whileHover={isUnlocked ? { scale: 1.05, x: 10, backgroundColor: '#f48fb1', color: '#fff' } : {}}
                      whileTap={isUnlocked ? { scale: 0.95 } : {}}
                      onClick={isUnlocked ? () => navigate(`/learn/lesson/${(selectedLevel - 1) * 3 + stage}`) : undefined}
                      style={{
                        padding: '18px 28px',
                        background: isUnlocked ? 'rgba(244, 143, 177, 0.1)' : 'rgba(240, 240, 240, 0.5)',
                        color: isUnlocked ? '#f48fb1' : '#999',
                        border: isUnlocked ? '2px solid #f48fb1' : '2px solid #eee',
                        borderRadius: '20px',
                        cursor: isUnlocked ? 'pointer' : 'not-allowed',
                        fontWeight: '800',
                        fontSize: '1.2rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isUnlocked ? '0 4px 12px rgba(244, 143, 177, 0.15)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ 
                          width: '35px', height: '35px', borderRadius: '50%', 
                          background: isUnlocked ? '#f48fb1' : '#ccc', 
                          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.9rem'
                        }}>{stage}</span>
                        <span>Stage {stage}</span>
                      </div>
                      {!isUnlocked && <span style={{ fontSize: '1.4rem' }}>🔒</span>}
                      {isUnlocked && <span style={{ fontSize: '1.2rem' }}>➔</span>}
                    </motion.button>
                  );
                })}
              </div>
              
              <motion.button
                whileHover={{ color: '#333', scale: 1.05 }}
                onClick={() => setSelectedLevel(null)}
                style={{ 
                  marginTop: '30px', 
                  background: 'transparent', 
                  border: 'none', 
                  color: '#aaa', 
                  cursor: 'pointer', 
                  fontWeight: '600',
                  fontSize: '1rem' 
                }}>
                Wait, I'll come back later
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.section 
        className="progress-section"
        whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(244, 143, 177, 0.4)' }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <h2 style={{ letterSpacing: '2px', fontSize: '1.4rem' }}>YOUR JOURNEY</h2>
        <div className="progress-bar" style={{ height: '24px', borderRadius: '12px' }}>
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${(completedVideos / totalVideos) * 100}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
        <p className="progress-text" key={completedVideos} style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', marginTop: '15px' }}>
          <span className="notranslate" style={{ color: '#fff' }}>{completedVideos}</span> / <span className="notranslate">{totalVideos}</span> Lessons Mastered
        </p>
      </motion.section>

      <section className="learn-content">
        <div className="info-text-top">
          <h3>Progress through levels to unlock the treasure! 💎</h3>
        </div>

        <div className="path-container" style={{ marginTop: '40px' }}>
          <svg className="path-svg" viewBox="0 0 600 2000">
            <motion.path
              d={calculatePath()}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="4"
              fill="transparent"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
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
                  toast.info("Master previous levels to unlock this one! ✨", {
                    position: "bottom-center",
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
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    Play Here! ➔
                  </motion.div>
                </div>
              )}
              <span className="step-number" style={{ fontSize: step.status === 'completed' ? '1.5rem' : '1.1rem' }}>
                {step.status === 'completed' ? '⭐' : i + 1}
              </span>
            </motion.div>
          ))}

          <motion.div
            className="reward-container"
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }}
          >
            <img src={isChestOpen ? treasureOpen : treasureClosed} alt="Reward" className="treasure-chest" />
            <p className="reward-text" style={{ fontWeight: '900', color: '#ffcc4d' }}>{isChestOpen ? "YOU GOT IT!" : "FINAL REWARD"}</p>
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
                <div className="badge-icon-wrapper" style={{ backgroundColor: flyingBadge.color, width: '80px', height: '80px', borderRadius: '50%', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
                  <span className="badge-icon-reveal" style={{ fontSize: '2.5rem' }}>{flyingBadge.icon}</span>
                </div>
                <div className="badge-name-reveal" style={{ fontWeight: '900', marginTop: '15px' }}>{flyingBadge.name}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
}