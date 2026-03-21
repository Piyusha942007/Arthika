import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { Calculator, Building, Banknote, Calendar, ChevronRight, MessageSquare, Mic, Loader2, Sparkles, Sprout, Briefcase, Volume2, VolumeX } from "lucide-react";
import "./Save.css";
import dollarIcon from "../../assets/images/dollar-icon.png";
import { getSuggestions, askArthika } from "../../services/GeminiService";
import axios from 'axios';

export default function Save() {

  const { user } = useUser();

  const [goals, setGoals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newGoal, setNewGoal] = useState({ title: "", target: "" });
  const [savingsInput, setSavingsInput] = useState({});

  // Persona State
  const [persona, setPersona] = useState("");
  const [businessInfo, setBusinessInfo] = useState("");

  // Loan Tracker State
  const [loanDetails, setLoanDetails] = useState({ bank: "", amount: "", interest: "", duration: "" });
  const [payoffTimeline, setPayoffTimeline] = useState(null);

  // AI States
  const [aiSuggestions, setAiSuggestions] = useState("");
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(localStorage.getItem("isMuted") === "true");

  const initialLang = localStorage.getItem("lang") ? `${localStorage.getItem("lang")}-IN` : "en-IN";
  const [audioLang, setAudioLang] = useState(initialLang);

  // Constants
  const API = "http://localhost:5000/api/goals";
  const USER_API = "http://localhost:5000/api/profile"; // Original endpoint for fetching User details 
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  // Speech Recognition & Synthesis
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    const handleVoicesChanged = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log("TTS Voices loaded:", voices.length);
    };
    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    handleVoicesChanged(); // Initial call
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setChatQuestion(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Update recognition language dynamically
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = audioLang;
    }
  }, [audioLang]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    localStorage.setItem("isMuted", nextMuted);
    if (nextMuted) {
      synthRef.current?.cancel();
      setIsSpeaking(false);
    } else if (chatResponse) {
      // Proactive: If unmuting and there is a message, speak it
      speakText(chatResponse);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      synthRef.current?.cancel();
      setIsSpeaking(false);
      setChatQuestion("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speakText = (text) => {
    if (!synthRef.current || isMuted) return;

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = audioLang;

    console.log(`Attempting to speak in ${audioLang}: "${text.substring(0, 30)}..."`);
    
    const voices = synthRef.current.getVoices();
    if (voices.length === 0) {
      console.warn("No TTS voices available yet.");
    }

    const langVoices = voices.filter(voice =>
      voice.lang.includes(audioLang) || voice.lang.includes(audioLang.split('-')[0])
    );
    console.log(`Found ${langVoices.length} voices for ${audioLang}`);

    let bestVoice = null;
    if (langVoices.length > 0) {
      // ONLY use LOCAL voices (avoid 'Online' or 'Natural' as they are slow and often fail)
      bestVoice = langVoices.find(v =>
        !v.name.toLowerCase().includes('online') && 
        !v.name.toLowerCase().includes('natural') &&
        (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman') || 
         v.name.toLowerCase().includes('aditi') || v.name.toLowerCase().includes('neerja') || 
         v.name.toLowerCase().includes('swara') || v.name.toLowerCase().includes('heera'))
      );
      
      if (!bestVoice) {
        // Fallback to any local voice for that language
        bestVoice = langVoices.find(v => !v.name.toLowerCase().includes('online'));
      }
      
      if (!bestVoice) bestVoice = langVoices[0];
    }

    if (bestVoice) {
      console.log("Selecting voice:", bestVoice.name);
      utterance.voice = bestVoice;
    } else {
      console.warn("No suitable voice found for language:", audioLang);
    }

    utterance.onstart = () => {
      console.log("Speech started");
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      console.log("Speech ended");
      setIsSpeaking(false);
    };
    utterance.onerror = (e) => {
      console.error("Speech error:", e);
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  /* FETCH GOALS & PROFILE */
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${USER_API}/${userEmail}`);
        if (res.data) {
          if (res.data.workNature) {
            setBusinessInfo(res.data.workNature);
          } else if (res.data.workType) {
            setBusinessInfo(res.data.workType);
          }
          // Setting the strict profile persona that the user configures in their specific Profile Page
          if (res.data.role) {
            setPersona(res.data.role);
          } else if (res.data.persona) {
            setPersona(res.data.persona);
          } else {
            setPersona("Housewife");
          }
        }
      } catch (err) {
        console.log("No profile found or error fetching data", err);
        setPersona("Housewife");
      }
    };

    const fetchGoals = async () => {
      try {
        const res = await fetch(`${API}/${user.id}`);
        const data = await res.json();
        setGoals(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchProfile();
    fetchGoals();
  }, [user, userEmail]);


  /* FETCH GEMINI SUGGESTIONS */
  useEffect(() => {
    if (!persona) return; // Wait for persona to load

    const fetchSuggestions = async () => {
      setIsLoadingSuggestions(true);
      const tips = await getSuggestions(persona, businessInfo);
      setAiSuggestions(tips);
      setIsLoadingSuggestions(false);
    };

    fetchSuggestions();
  }, [persona, businessInfo]);


  /* ASK ARTHIKA */
  const handleAskArthika = async () => {
    if (!chatQuestion.trim()) return;
    setIsChatLoading(true);
    const res = await askArthika(persona, chatQuestion, audioLang, businessInfo);
    setChatResponse(res);
    setIsChatLoading(false);
    setChatQuestion("");
    speakText(res);
  };


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


  /* CALCULATE LOAN PAYOFF */
  const calculateLoanPayoff = () => {
    const P = parseFloat(loanDetails.amount);
    const R = parseFloat(loanDetails.interest) / 100 / 12; // monthly rate
    const N = parseFloat(loanDetails.duration) * 12; // months

    if (!P || !R || !N) return;

    // EMI formula: P x R x (1+R)^N / [(1+R)^N - 1]
    const MathPow = Math.pow(1 + R, N);
    const emi = P * R * MathPow / (MathPow - 1);
    const totalPayment = emi * N;

    setPayoffTimeline({
      monthlyEMI: emi,
      totalPayment: totalPayment,
      totalInterest: totalPayment - P
    });
  };

  /* SAVE LOAN AS A GOAL (No backend schema rewrite) */
  const saveLoanAsGoal = async () => {
    if (!payoffTimeline) return;

    try {
      const goalToSave = {
        clerkId: user.id,
        title: `Loan: ${loanDetails.bank || 'Bank'}`,
        targetAmount: Number(Math.round(payoffTimeline.totalPayment))
      };

      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goalToSave)
      });

      const savedGoal = await res.json();
      setGoals([...goals, savedGoal]);

      // Reset Loan form
      setLoanDetails({ bank: "", amount: "", interest: "", duration: "" });
      setPayoffTimeline(null);
    } catch (err) {
      console.error("Error saving loan as a goal:", err);
    }
  }


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

        {/* PERSONA DISPLAY */}
        <section className="persona-card">
          <div className="persona-header">
            <h3>Arthika Dashboard</h3>
            <span className="persona-badge" style={{ padding: '8px 15px', background: '#F48FB1', color: '#fff', borderRadius: '20px', fontWeight: 'bold' }}>
              Hello, {user?.firstName || 'User'}! ({persona || 'Housewife'})
            </span>
          </div>
          <p style={{ marginTop: '5px', fontSize: '0.9rem', color: '#555', fontWeight: '500' }}>
            This dashboard is tailored to you! You can update your persona (Housewife/Working) by going to your <b>Profile Page</b>.
          </p>

          <div className={`persona-tips ${isLoadingSuggestions ? 'ai-pulse' : ''}`} style={{ marginTop: '20px' }}>
            <Sparkles className="tip-icon" />
            <div className="tip-content">
              <h4>Today's AI Suggestions</h4>
              <div className="gemini-tips-box">
                {isLoadingSuggestions ? (
                  <p className="loading-text"><Loader2 className="spinner" size={16} /> Arthika is thinking...</p>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <div style={{ whiteSpace: 'pre-line' }}>{aiSuggestions}</div>
                    {aiSuggestions && (
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button
                          className="speak-suggestions-btn"
                          onClick={() => {
                            if (isMuted) toggleMute(); // Unmute if they click specifically to listen
                            speakText(aiSuggestions);
                          }}
                          style={{
                            background: '#000',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 15px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold'
                          }}
                        >
                          <Volume2 size={18} /> {isSpeaking ? 'Speaking...' : 'Listen to Tips'}
                        </button>
                        {isSpeaking && (
                          <button
                            onClick={() => { synthRef.current?.cancel(); setIsSpeaking(false); }}
                            style={{
                              background: '#eee',
                              border: 'none',
                              padding: '8px 15px',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              color: '#000',
                              fontWeight: 'bold',
                              fontSize: '0.85rem'
                            }}
                          >
                            Stop
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>


        {/* LOAN TRACKER CARD */}
        <section className="goal-card loan-tracker-card glassmorphism">
          <div className="goal-card-header">
            <h2>Track Loans <Calculator size={36} color="#000" style={{ verticalAlign: 'middle', marginLeft: '10px' }} /></h2>
          </div>
          <div className="loan-inputs">
            <div className="loan-input-group">
              <Building className="input-icon" />
              <select
                value={loanDetails.bank}
                onChange={(e) => setLoanDetails({ ...loanDetails, bank: e.target.value })}
              >
                <option value="">Select Indian Bank</option>
                <option value="SBI">State Bank of India (SBI)</option>
                <option value="HDFC">HDFC Bank</option>
                <option value="ICICI">ICICI Bank</option>
                <option value="PNB">Punjab National Bank</option>
                <option value="BOB">Bank of Baroda (BOB)</option>
                <option value="Axis">Axis Bank</option>
                <option value="Kotak">Kotak Mahindra Bank</option>
              </select>
            </div>

            <div className="loan-input-group">
              <Banknote className="input-icon" />
              <input
                type="number"
                placeholder="Loan Amount"
                value={loanDetails.amount}
                onChange={(e) => setLoanDetails({ ...loanDetails, amount: e.target.value })}
              />
            </div>

            <div className="loan-input-group">
              <span className="input-icon">%</span>
              <input
                type="number"
                placeholder="Interest Rate (%)"
                value={loanDetails.interest}
                onChange={(e) => setLoanDetails({ ...loanDetails, interest: e.target.value })}
              />
            </div>

            <div className="loan-input-group">
              <Calendar className="input-icon" />
              <input
                type="number"
                placeholder="Duration (Years)"
                value={loanDetails.duration}
                onChange={(e) => setLoanDetails({ ...loanDetails, duration: e.target.value })}
              />
            </div>

            <button className="primary-btn loan-calc-btn" onClick={calculateLoanPayoff}>
              Calculate Pay-off
            </button>
          </div>

          {payoffTimeline && (
            <div className="payoff-timeline">
              <h4><ChevronRight size={18} style={{ verticalAlign: 'bottom' }} /> Easy Timeline</h4>
              <div className="timeline-grid">
                <div className="timeline-stat">
                  <span>Monthly EMI</span>
                  <strong>₹{Math.round(payoffTimeline.monthlyEMI).toLocaleString("en-IN")}</strong>
                </div>
                <div className="timeline-stat">
                  <span>Total Interest</span>
                  <strong>₹{Math.round(payoffTimeline.totalInterest).toLocaleString("en-IN")}</strong>
                </div>
                <div className="timeline-stat">
                  <span>Total Amount</span>
                  <strong>₹{Math.round(payoffTimeline.totalPayment).toLocaleString("en-IN")}</strong>
                </div>
              </div>
              <button
                style={{ marginTop: '15px', background: '#000', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
                onClick={saveLoanAsGoal}
              >
                Add Loan to My Goals List Below
              </button>
            </div>
          )}
        </section>


        {/* CREATE GOAL */}
        <section className="goal-input-card">
          <h3 className="section-label">Create a New Saving Goal</h3>
          <div className="input-row">
            <input
              type="text"
              placeholder="Goal Name"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
            <input
              type="number"
              placeholder="Target Amount"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
            />
            <button onClick={handleAddGoal} className="primary-btn">
              Set Goal
            </button>
          </div>
        </section>


        {/* SEARCH */}
        <input
          className="search-bar"
          placeholder="Search your goals"
          onChange={(e) => setSearchTerm(e.target.value)}
        />


        {/* GOALS GRID */}
        <div className="goals-grid">
          {filteredGoals.map((goal) => {
            const saved = parseFloat(goal.savedAmount || 0);
            const target = parseFloat(goal.targetAmount || 1);
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
                  <p className="percentage-text"><span className="notranslate">{percentage}</span>% saved</p>
                </div>

                <p className="amount-display">
                  <span className="notranslate">₹{saved.toLocaleString("en-IN")}</span> / <span className="notranslate">₹{target.toLocaleString("en-IN")}</span>
                </p>

                <div className="save-progress-container">
                  <div
                    className="save-progress-bar notranslate"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {!isCompleted && (
                  <p className="saving-tip">
                    💡 Save <span className="notranslate">₹{monthlyTip.toLocaleString("en-IN")}</span> monthly to reach your goal in 6 months
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


        {/* ASK ARTHIKA CHAT COMPONENT */}
        <section className="ask-arthika-card glassmorphism">
            <div className="chat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3><MessageSquare size={24} /> Ask Arthika</h3>
                <p>Your Finanical Assistant to help you save and invest!</p>
              </div>
              {chatResponse && (
                <button 
                  className="listen-arthika-header-btn" 
                  onClick={() => {
                    if (isMuted) setIsMuted(false);
                    speakText(chatResponse);
                  }} 
                  style={{ 
                    background: '#F48FB1', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '8px 15px', 
                    borderRadius: '15px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Volume2 size={18} /> Listen Arthika
                </button>
              )}
            </div>

          <div className="chat-response-area">
            {isChatLoading ? (
              <div className="loading-chat"><Loader2 className="spinner" size={24} /> Thinking...</div>
            ) : (
              chatResponse && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div className="chat-bubble">{chatResponse}</div>
                  
                  {/* Show Stop button only while speaking */}
                  {isSpeaking && (
                    <button
                      onClick={() => { synthRef.current?.cancel(); setIsSpeaking(false); }}
                      style={{
                        marginTop: '5px',
                        marginLeft: '10px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#FF4081',
                        fontSize: '0.85rem',
                        fontWeight: 'bold'
                      }}
                    >
                      Stop
                    </button>
                  )}
                </div>
              )
            )}
          </div>

          <div className="chat-input-row" style={{ flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Ask about saving, loans, or business..."
              value={chatQuestion}
              onChange={(e) => setChatQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskArthika()}
              style={{ minWidth: '200px' }}
            />


            <button className="primary-btn" onClick={handleAskArthika} style={{ padding: '10px 30px' }}>
              Send
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}