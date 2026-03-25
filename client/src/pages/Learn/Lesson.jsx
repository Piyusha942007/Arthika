import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import API_BASE_URL from "../../config/apiConfig";
import "./Lesson.css";

export default function Lesson() {
  const { user, isLoaded } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();

  // Derived level and stage from ID (ID is 1-indexed overall stage number)
  const totalStageIndex = parseInt(id);
  const level = Math.ceil(totalStageIndex / 3);
  const stage = ((totalStageIndex - 1) % 3) + 1;

  const [videoUrl, setVideoUrl] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [passed, setPassed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [quizError, setQuizError] = useState("");
  const [quizReview, setQuizReview] = useState(null);
  
  // Progress states
  const [completedVideos, setCompletedVideos] = useState(0);
  const [totalVideos, setTotalVideos] = useState(30);
  const [totalCoins, setTotalCoins] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);

  // Animation states
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [flyingCoins, setFlyingCoins] = useState([]);

  // Burst Animation on Mount
  const [burstCoins, setBurstCoins] = useState([]);
  useEffect(() => {
    const coins = Array.from({ length: 6 }).map((_, i) => ({
      id: `burst-${i}`,
      angle: (Math.random() * 360) * (Math.PI / 180),
      distance: 40 + Math.random() * 80,
      delay: Math.random() * 0.2
    }));
    setBurstCoins(coins);
    setTimeout(() => setBurstCoins([]), 2000);
  }, []);

  const [language] = useState(() => localStorage.getItem("lang") || "en");

  // Coin Counting Animation Logic
  const springCoins = useSpring(0, { stiffness: 40, damping: 20 });
  const displayCoins = useTransform(springCoins, (latest) => Math.floor(latest));

  useEffect(() => {
    springCoins.set(totalCoins || 0);
  }, [totalCoins, springCoins]);

  const fetchProgressAndVideo = useCallback(async () => {
    if (!isLoaded || !user) return;
    setIsLoading(true);
    setErrorMsg("");

    try {
      const lang = localStorage.getItem("lang") || "en";
      
      // Fetch progress
      const progressRes = await fetch(`${API_BASE_URL}/api/lessons/progress?lang=${lang}&t=${Date.now()}`, {
        headers: { 'x-user-id': user.id }
      });
      
      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setCompletedVideos(progressData.completedVideos);
        setTotalVideos(progressData.totalVideos);
        setTotalCoins(progressData.totalCoins || 0);
      }

      // Fetch video
      const videoRes = await fetch(`${API_BASE_URL}/api/lessons/${level}/${stage}?lang=${lang}`, {
        headers: { 'x-user-id': user.id }
      });
      
      const videoData = await videoRes.json();

      if (videoRes.ok) {
        setVideoUrl(videoData.videoUrl);
        setErrorMsg("");
      } else {
        setErrorMsg(videoData.details ? `${videoData.message} (${videoData.details})` : videoData.message);
        setVideoUrl("");
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
      setErrorMsg("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, user, level, stage]);

  useEffect(() => {
    fetchProgressAndVideo();
  }, [fetchProgressAndVideo]);

  const onVideoEnded = async () => {
    try {
      const lang = localStorage.getItem("lang") || "en";
      const res = await fetch(`${API_BASE_URL}/api/lessons/quiz/${level}/${stage}?lang=${lang}`, {
        headers: { 'x-user-id': user.id }
      });
      const data = await res.json();
      if (res.ok) {
        setQuizData(data.quiz);
        setShowQuiz(true);
      }
    } catch (error) {
      console.error("Failed to fetch quiz", error);
    }
  };

  const handleAnswerChange = (questionId, option) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleQuizSubmit = async () => {
    try {
      const lang = localStorage.getItem("lang") || "en";
      const res = await fetch(`${API_BASE_URL}/api/lessons/complete`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'x-user-id': user.id 
        },
        body: JSON.stringify({ level, stage, answers: selectedAnswers, lang })
      });
      const data = await res.json();

      if (res.ok && data.passed) {
        setPassed(true);
        setQuizError("");
        setQuizReview(null);
        
        // Handle coins
        if (data.coinsEarned > 0) {
          setCoinsEarned(data.coinsEarned);
          setTotalCoins(data.totalCoins);
          triggerCoinAnimation(data.coinsEarned);
        }

        // Refresh the progress bar to instantly reflect the new completed lesson
        setCompletedVideos(prev => prev + 1);
      } else {
        setQuizError(data.message);
        if (data.review) setQuizReview(data.review);
      }
    } catch (error) {
      console.error("Failed to verify quiz", error);
      setQuizError("Server error verifying quiz");
    }
  };

  const triggerCoinAnimation = (amount) => {
    const coinCount = Math.min(Math.floor(amount / 5) || 5, 10); 
    const newCoins = Array.from({ length: coinCount }).map((_, i) => ({
      id: i,
      delay: i * 0.1,
    }));
    
    setFlyingCoins(newCoins);
    setShowCoinAnimation(true);

    setTimeout(() => {
      setShowCoinAnimation(false);
      setFlyingCoins([]);
    }, 2000);
  };

  return (
    <div className="lesson-page">
      <div style={{ padding: '20px', paddingBottom: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '90%', maxWidth: '1100px' }}>
        <button
          onClick={() => navigate('/learn')}
          style={{ background: 'transparent', color: '#f48fb1', border: '2px solid #f48fb1', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ← Back to Map
        </button>

        {/* Coin Bank Display - Consistent with Learn Page */}
        <div style={{ position: 'relative' }}>
          <motion.div 
            style={{ 
              background: 'rgba(255, 255, 255, 0.9)', 
              backdropFilter: 'blur(10px)',
              padding: '8px 16px', 
              borderRadius: '30px',
              border: '3px solid #ffcc4d', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              boxShadow: '0 4px 15px rgba(255, 204, 77, 0.25)', 
              fontWeight: '900', 
              fontSize: '20px',
              color: '#333',
              cursor: 'pointer'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1, rotate: [0, -2, 2, 0] }}
            whileTap={{ scale: 0.95 }}
            id="lesson-coin-bank"
          >
            <motion.span 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              style={{ fontSize: '24px' }}
            >
              🪙
            </motion.span>
            <motion.span className="notranslate">{displayCoins}</motion.span>
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
                  top: '20%',
                  left: '40%',
                  fontSize: '20px',
                  pointerEvents: 'none'
                }}
              >
                🪙
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <motion.div 
        className="lesson-progress"
        whileHover={{ scale: 1.02, filter: 'brightness(1.05)' }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <h2 style={{ letterSpacing: '2px', color: 'white', fontSize: '1.8rem' }}>YOUR PROGRESS</h2>
        <div className="progress-track" style={{ height: '30px', borderRadius: '15px' }}>
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${(completedVideos / totalVideos) * 100}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          ></motion.div>
        </div>
        <p key={completedVideos} style={{ fontWeight: '800', fontSize: '1.2rem', color: '#fff' }}>
          <span className="notranslate">{completedVideos}</span> / <span className="notranslate">{totalVideos}</span> lessons mastered
        </p>
      </motion.div>

      <div className="lesson-card">
        <h3>Level {level} - Stage {stage}</h3>

        <div className="video-box">
          {isLoading ? (
            <p>Loading video...</p>
          ) : errorMsg ? (
            <div className="locked-message" style={{ padding: '40px', color: '#ff4d4d', textAlign: 'center' }}>
              <h2>🔒 {errorMsg}</h2>
            </div>
          ) : !showQuiz ? (
            <video
              key={videoUrl}
              controls
              autoPlay
              width="100%"
              src={videoUrl}
              onEnded={onVideoEnded}
              style={{ backgroundColor: 'black', borderRadius: '30px' }}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="quiz-container">
              {!passed ? (
                <div className="quiz-box">
                  <h4 style={{ fontSize: '22px', marginBottom: '20px' }}>Video Finished! Answer the quiz:</h4>
                  {quizData.map((q, qIndex) => (
                    <div key={qIndex} className="quiz-question" style={{ marginBottom: '20px', textAlign: 'left' }}>
                      <p style={{ fontWeight: '800', marginBottom: '10px' }}>{q.question}</p>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {q.options.map((option, oIndex) => (
                          <li 
                            key={oIndex} 
                            onClick={() => handleAnswerChange(qIndex, option)}
                            className={`quiz-option ${selectedAnswers[qIndex] === option ? 'selected' : ''}`}
                            style={{ 
                              padding: '12px 20px', 
                              margin: '5px 0', 
                              borderRadius: '12px', 
                              border: '2px solid transparent',
                              cursor: 'pointer',
                              background: selectedAnswers[qIndex] === option ? '#f48fb1' : '#fff',
                              color: selectedAnswers[qIndex] === option ? '#fff' : '#333',
                              fontWeight: '600'
                            }}
                          >
                            {option}
                          </li>
                        ))}
                      </ul>
                      {quizReview && quizReview[qIndex] !== undefined && !quizReview[qIndex] && (
                        <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>Incorrect. Try again!</p>
                      )}
                    </div>
                  ))}
                  {quizError && <p style={{ color: 'red', fontWeight: 'bold' }}>{quizError}</p>}
                  <button 
                    onClick={handleQuizSubmit}
                    className="quiz-btn"
                    style={{ marginTop: '20px', background: '#333', color: 'white' }}
                  >
                    SUBMIT ANSWERS
                  </button>
                </div>
              ) : (
                <div className="passed-message" style={{ padding: '40px', color: '#2e7d32' }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                  >
                    <h2 style={{ fontSize: '3rem' }}>🎉 STAGE COMPLETE!</h2>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Great job! You earned some coins!</p>
                  </motion.div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Coin Animation Overlay */}
      <AnimatePresence>
        {showCoinAnimation && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 10000 }}>
            {flyingCoins.map((coin) => (
              <motion.div
                key={coin.id}
                initial={{ x: '50vw', y: '50vh', opacity: 1, scale: 1 }}
                animate={{
                  x: window.innerWidth - 80, 
                  y: 120, 
                  opacity: 0,
                  scale: 0.5
                }}
                transition={{
                  duration: 0.8,
                  delay: coin.delay,
                  ease: "backIn"
                }}
                style={{
                  position: 'absolute',
                  fontSize: '40px'
                }}
              >
                🪙
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="lesson-footer"></div>
    </div>
  );
}