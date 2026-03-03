
import "./Learn.css";
import treasureChest from "../../assets/images/treasure.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Learn() {
  const navigate = useNavigate();

  const steps = [
    { status: "completed", offset: 60 },
    { status: "completed", offset: -40 },
    { status: "completed", offset: -120 },
    { status: "completed", offset: -10 },
    { status: "completed", offset: 120 },
    { status: "current", label: "LEVEL 6", offset: 0 },
    { status: "pending", offset: -100 },
    { status: "pending", offset: 50 },
  ];

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
          <svg className="path-svg" viewBox="0 0 600 1400">
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
              onClick={step.status === "current" ? () => navigate("/learn/lesson/6") : undefined}
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