import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import "./Lesson.css";

export default function Lesson() {
  const { user, isLoaded } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Quiz States
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]); // Array of selected option indexes
  const [quizError, setQuizError] = useState("");
  const [passed, setPassed] = useState(false); // Used to show "Next Stage Unlocked" button

  // Progress states
  const [completedVideos, setCompletedVideos] = useState(0);
  const [totalVideos, setTotalVideos] = useState(30);

  // Calculate Level and Stage based on a single continuous ID (assuming 3 stages per level)
  const numericId = parseInt(id) || 1;
  const level = Math.ceil(numericId / 3) || 1;
  const stage = numericId % 3 === 0 ? 3 : numericId % 3;

  useEffect(() => {
    window.scrollTo(0, 0);

    // Reset all quiz states when navigating to a new video since React Router doesn't unmount the component
    setShowQuiz(false);
    setPassed(false);
    setQuizQuestions([]);
    setUserAnswers([]);
    setQuizError("");

    if (!isLoaded || !user) return;

    const fetchProgressAndVideo = async () => {
      setIsLoading(true);
      try {
        // Fetch progress
        const progressRes = await fetch('http://localhost:5000/api/lessons/progress', {
          headers: { 'x-user-id': user.id }
        });
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setCompletedVideos(progressData.completedVideos);
          setTotalVideos(progressData.totalVideos);
        }

        // Fetch video
        const videoRes = await fetch(`http://localhost:5000/api/lessons/${level}/${stage}`, {
          method: 'GET',
          headers: { 'x-user-id': user.id }
        });

        const videoData = await videoRes.json();

        if (videoRes.ok) {
          setVideoUrl(videoData.videoUrl);
          setErrorMsg("");
        } else {
          setErrorMsg(videoData.message);
          setVideoUrl("");
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        setErrorMsg("Failed to connect to server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressAndVideo();
  }, [level, stage, isLoaded, user]);

  // Triggered when video finishes playing
  const onVideoEnded = async () => {
    if (!user) return;
    // Fetch Quiz
    try {
      const response = await fetch(`http://localhost:5000/api/lessons/${level}/${stage}/quiz`, {
        headers: { 'x-user-id': user.id }
      });
      const data = await response.json();
      if (response.ok) {
        setQuizQuestions(data.questions);
        setUserAnswers(new Array(data.questions.length).fill(null)); // Initialize empty answers
        setShowQuiz(true);
      }
    } catch (error) {
      console.error("Failed to load quiz", error);
    }
  };

  const handleOptionSelect = (qIndex, oIndex) => {
    const newAnswers = [...userAnswers];
    newAnswers[qIndex] = oIndex;
    setUserAnswers(newAnswers);
  };

  const submitQuiz = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:5000/api/lessons/${level}/${stage}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify({ userAnswers })
      });

      const data = await response.json();

      if (response.ok) {
        setQuizError("");
        setPassed(true);
        // Refresh the progress bar to instantly reflect the new completed lesson
        setCompletedVideos(prev => prev + 1);
      } else {
        setQuizError(data.message); // e.g. "Quiz failed. Try again!"
      }
    } catch (error) {
      console.error("Failed to verify quiz", error);
      setQuizError("Server error verifying quiz");
    }
  };

  return (
    <div className="lesson-page">
      <div style={{ padding: '20px', paddingBottom: '0' }}>
        <button
          onClick={() => navigate('/learn')}
          style={{ background: 'transparent', color: '#f48fb1', border: '2px solid #f48fb1', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ← Back to Map
        </button>
      </div>

      <div className="lesson-progress">
        <h2>PROGRESS BAR</h2>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${(completedVideos / totalVideos) * 100}%` }}
          ></div>
        </div>
        <p>{completedVideos}/{totalVideos} videos completed</p>
      </div>

      <div className="lesson-card">
        <h3>Level {level} - Stage {stage}</h3>

        <div className="video-box">
          {isLoading ? (
            <p>Loading video...</p>
          ) : errorMsg ? (
            <div className="locked-message" style={{ padding: '40px', color: 'red', textAlign: 'center' }}>
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
              style={{ backgroundColor: 'black' }}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="quiz-box">
              {passed ? (
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ fontSize: '32px', color: '#d81b60', marginBottom: '20px' }}>🎉 Quiz Passed! {stage === 3 ? "New Level Unlocked!" : "Stage Complete!"}</h2>
                  <div
                    className="quiz-btn"
                    onClick={() => navigate(stage === 3 ? '/learn' : `/learn/lesson/${numericId + 1}`)}
                  >
                    {stage === 3 ? 'RETURN TO MAP ➔' : 'GO TO NEXT STAGE ➔'}
                  </div>
                </div>
              ) : (
                <>
                  <div className="quiz-header">
                    <span>Time for a Quiz!</span>
                    {quizError && <span style={{ color: 'red', fontSize: '18px' }}>{quizError}</span>}
                  </div>

                  {quizQuestions.map((q, qIndex) => (
                    <div key={qIndex} style={{ marginBottom: '40px', textAlign: 'left' }}>
                      <h4 style={{ fontSize: '24px', marginBottom: '15px', fontWeight: 'bold' }}>Q{qIndex + 1}) {q.questionText}</h4>
                      <ul>
                        {q.options.map((opt, oIndex) => (
                          <li
                            key={oIndex}
                            className={`quiz-option ${userAnswers[qIndex] === oIndex ? 'selected' : ''}`}
                            onClick={() => handleOptionSelect(qIndex, oIndex)}
                          >
                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'flex-start', width: '100%', pointerEvents: 'none', margin: 0 }}>
                              <input
                                type="radio"
                                name={`question-${qIndex}`}
                                value={oIndex}
                                onChange={() => handleOptionSelect(qIndex, oIndex)}
                                checked={userAnswers[qIndex] === oIndex}
                                style={{
                                  width: 'auto',
                                  padding: 0,
                                  margin: '6px 15px 0 0',
                                  transform: 'scale(1.5)',
                                  pointerEvents: 'auto',
                                  flexShrink: 0,
                                  border: 'none'
                                }}
                              />
                              <span style={{ flex: 1 }}>{opt}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <div className="quiz-btn" onClick={submitQuiz}>
                    SUBMIT ANSWERS
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="lesson-footer-gradient"></div>
    </div>
  );
}