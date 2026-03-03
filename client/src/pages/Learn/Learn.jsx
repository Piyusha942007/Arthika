
import "./Learn.css";
import treasureChest from "../../assets/images/treasure.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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

  const pathD = `
    M 300 40 
    C 550 140, 50 240, 300 400
    C 550 560, 50 660, 300 820
    C 550 980, 50 1080, 300 1200
  `;

  return (
    <div className="learn-page">

      <section className="progress-section">
        <h2>YOUR PROGRESS</h2>
        <div className="progress-bar">
          <motion.div 
            className="progress-fill" 
            initial={{ width: 0 }}
            animate={{ width: "60%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
        <p className="progress-text">30/50 Lessons Mastered</p>
      </section>

      <section className="learn-content">
        <div className="info-text-top">
          <h3>Earn Stars by completing a quiz everyday!</h3>
        </div>

        <div className="path-container">
          <svg className="path-svg" viewBox="0 0 600 1300" preserveAspectRatio="none">
            <motion.path
              d={pathD}
              stroke="#444"
              strokeWidth="6"
              strokeDasharray="16 16"
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
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ 
                scale: 1.15, 
                transition: { type: "spring", stiffness: 400, damping: 10 } 
              }}
              whileTap={{ scale: 0.95 }}
              viewport={{ once: true }}
              onClick={step.status === "current" ? () => navigate("/learn/lesson/6") : undefined}
            >
              {step.status === "current" && (
                <div className="current-indicator-wrapper">
                  <span className="level-tag">{step.label}</span>
                  <motion.div 
                    className="start-now-bubble"
                    animate={{ x: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    Start now →
                  </motion.div>
                </div>
              )}
              <span className="step-number">
                {step.status === "completed" ? "✓" : i + 1}
              </span>
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