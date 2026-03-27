import { useState, useEffect, useCallback, useMemo } from "react";
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
  const [showAnswers, setShowAnswers] = useState(false);
  
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
      const res = await fetch(`${API_BASE_URL}/api/lessons/${level}/${stage}/quiz?lang=${lang}`, {
        headers: { 'x-user-id': user.id }
      });
      const data = await res.json();
      console.log("DEBUG: Quiz Data received:", data);
      if (res.ok) {
        setQuizData(data.questions || []);
        setShowQuiz(true);
      } else {
        setErrorMsg("Failed to load quiz. Please try again.");
      }
    } catch (error) {
      console.error("Failed to fetch quiz", error);
    }
  };

  // Handle direct quiz jump via query param
  const queryParams = useMemo(() => new URLSearchParams(window.location.search), []);
  useEffect(() => {
    const isMastered = ((level - 1) * 3 + stage <= completedVideos);
    if (queryParams.get("quiz") === "true" && !showQuiz && !isLoading && videoUrl && isMastered) {
      onVideoEnded();
    }
  }, [queryParams, showQuiz, isLoading, videoUrl, onVideoEnded]);

  const handleAnswerChange = (questionId, optionIndex) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleQuizSubmit = async () => {
    try {
      const lang = localStorage.getItem("lang") || "en";
      const userAnswers = Object.keys(selectedAnswers).sort().map(key => selectedAnswers[key]);

      const res = await fetch(`${API_BASE_URL}/api/lessons/${level}/${stage}/complete`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'x-user-id': user.id 
        },
        body: JSON.stringify({ userAnswers, lang })
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
        setQuizError("Wrong answer(s), try again ❌");
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
        <div className="lesson-coin-wrapper">
          <motion.div 
            className="lesson-coin-card"
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
            <div className="video-wrapper-hover">
              <video
                key={videoUrl}
                controls
                autoPlay
                width="100%"
                src={videoUrl}
                onEnded={onVideoEnded}
                style={{ backgroundColor: 'black', borderRadius: '30px', minHeight: '200px' }}
                onError={(e) => {
                  console.error("Video Error:", e);
                  if (videoUrl) setErrorMsg("Video failed to play. You can still try the quiz.");
                }}
              >
                Your browser does not support the video tag.
              </video>
              {!videoUrl && !isLoading && !errorMsg && (
                <div style={{ padding: '20px', background: '#fff', borderRadius: '20px', margin: '10px 0' }}>
                   <p>Video not available. You can try the quiz directly.</p>
                   <button onClick={onVideoEnded} className="quiz-btn" style={{ fontSize: '1rem', padding: '10px' }}>GO TO QUIZ</button>
                </div>
              )}
            </div>
          ) : (
            <div className="quiz-container">
              {!passed ? (
                <div className="quiz-box">
                  <h4 style={{ fontSize: '22px', marginBottom: '20px' }}>Video Finished! Answer the quiz:</h4>
                  {quizData.map((q, qIndex) => (
                    <div key={qIndex} className="quiz-question" style={{ marginBottom: '20px', textAlign: 'left' }}>
                      <p style={{ fontWeight: '800', marginBottom: '10px' }}>{q.questionText || q.question}</p>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {q.options.map((option, oIndex) => (
                          <li 
                            key={oIndex} 
                            onClick={() => handleAnswerChange(qIndex, oIndex)}
                            className={`quiz-option ${selectedAnswers[qIndex] === oIndex ? "selected" : ""}`}
                            style={{ 
                              fontWeight: '300', // Thin font weight
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px'
                            }}
                          >
                            <span className="option-circle" />
                            {option}
                          </li>
                        ))}
                      </ul>
                      {quizReview && quizReview[qIndex] !== undefined && !quizReview[qIndex] && (
                        <p style={{ color: '#d32f2f', fontSize: '14px', marginTop: '5px', fontWeight: 'bold' }}>Wrong answer(s), try again ❌</p>
                      )}
                    </div>
                  ))}
                  {quizData.length === 0 && <p>Loading questions...</p>}
                  {quizError && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <p style={{ color: '#d32f2f', fontWeight: 'bold', marginTop: '15px', fontSize: '1.5rem' }}>
                        {quizError}
                      </p>
                      {quizReview && (
                        <button
                          onClick={() => setShowAnswers(!showAnswers)}
                          className="view-answers-btn"
                          style={{
                            background: '#f48fb1',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '1rem'
                          }}
                        >
                          {showAnswers ? "HIDE ANSWERS" : "VIEW ANSWERS"}
                        </button>
                      )}
                    </div>
                  )}

                  {showAnswers && quizReview && (
                    <div className="answers-review-box" style={{ marginTop: '20px', padding: '20px', background: '#fff', borderRadius: '20px', textAlign: 'left', border: '2px solid #f48fb1' }}>
                      <h5 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#f48fb1' }}>Review Answers:</h5>
                      {quizReview.map((item, idx) => (
                        <div key={idx} style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                          <p style={{ fontWeight: 'bold' }}>Q{idx + 1}: {item.questionText}</p>
                          <p style={{ color: item.isCorrect ? '#2e7d32' : '#d32f2f' }}>
                            Your Answer: {item.userAnswer} {item.isCorrect ? "✅" : "❌"}
                          </p>
                          {!item.isCorrect && (
                            <>
                              <p style={{ color: '#2e7d32', fontWeight: 'bold' }}>Correct Answer: {item.correctAnswer}</p>
                              <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#666' }}>💡 {item.explanation}</p>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <button 
                    onClick={handleQuizSubmit}
                    className="quiz-btn"
                    style={{ marginTop: '20px', background: '#333', color: 'white' }}
                    disabled={Object.keys(selectedAnswers).length === 0}
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
                    <h2 style={{ fontSize: '3rem' }}>{stage === 3 ? "🎉 LEVEL COMPLETE! 🎓" : "🎉 STAGE COMPLETE! 🚀"}</h2>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '30px' }}>
                      {stage === 3 ? "Level completed, go to next level 🌟" : "Stage completed, move to next stage ✨"}
                    </p>
                    
                    {parseInt(id) < totalVideos && (
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: '#fce4ec' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setShowQuiz(false);
                          setPassed(false);
                          setSelectedAnswers({});
                          setQuizError("");
                          setQuizReview(null);
                          setShowAnswers(false);
                          navigate(`/learn/lesson/${parseInt(id) + 1}`);
                        }}
                        className="quiz-btn"
                        style={{ 
                          background: '#fff', 
                          color: '#f48fb1', 
                          border: '4px solid #f48fb1',
                          fontSize: '1.5rem',
                          padding: '15px 40px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '15px'
                        }}
                      >
                        {stage === 3 ? "GO TO NEXT LEVEL" : "GO TO NEXT STAGE"}
                        <span style={{ fontSize: '2rem' }}>➜</span>
                      </motion.button>
                    )}
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