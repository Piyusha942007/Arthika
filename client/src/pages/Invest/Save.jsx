import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { Calculator, Building, Banknote, Calendar, ChevronRight, MessageSquare, Mic, Loader2, Sparkles, Sprout, Briefcase, Play, Pause, RefreshCw } from "lucide-react";
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

  const [persona, setPersona] = useState("");
  const [userName, setUserName] = useState(user?.fullName || "User");
  const [businessInfo, setBusinessInfo] = useState("");
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);

  const supportedLanguages = [
      { code: "en-IN", name: "English", googCode: "en" },
      { code: "hi-IN", name: "हिंदी (Hindi)", googCode: "hi" },
      { code: "mr-IN", name: "मराठी (Marathi)", googCode: "mr" },
      { code: "gu-IN", name: "ગુજરાતી (Gujarati)", googCode: "gu" },
      { code: "bn-IN", name: "বাংলা (Bengali)", googCode: "bn" },
      { code: "te-IN", name: "తెలుగు (Telugu)", googCode: "te" },
      { code: "ta-IN", name: "தமிழ் (Tamil)", googCode: "ta" },
      { code: "ur-IN", name: "اردو (Urdu)", googCode: "ur" },
      { code: "ml-IN", name: "മലയാളം (Malayalam)", googCode: "ml" }
  ];

  // Loan Tracker State
  const [loanDetails, setLoanDetails] = useState({ bank: "", scheme: "", amount: "", interest: "", duration: "" });
  const [payoffTimeline, setPayoffTimeline] = useState(null);

  // AI States
  const [aiSuggestions, setAiSuggestions] = useState("");
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const initialLang = localStorage.getItem("lang") ? `${localStorage.getItem("lang")}-IN` : "en-IN";
  const [audioLang, setAudioLang] = useState(initialLang);

  // Constants
  const API = "http://localhost:5000/api/goals";
  const USER_API = "http://localhost:5000/api/profile"; // Original endpoint for fetching User details 
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const loanData = {
    SBI: [
      { name: "Lakhpati Didi Digital Loan", interest: 8.5, tenure: 6 },
      { name: "Stree Shakti Package", interest: 9.0, tenure: 7 },
      { name: "SBI Dairy Plus", interest: 9.5, tenure: 5 },
      { name: "Mahila Atmanirbhar Achiever", interest: 10, tenure: 10 },
      { name: "PM Svanidhi (Women)", interest: 7.0, tenure: 2 }
    ],
    HDFC: [
      { name: "Smart-Up Rural Women", interest: 10.5, tenure: 5 },
      { name: "Pragati Loan", interest: 11, tenure: 3 },
      { name: "Rural Housing Extension", interest: 9.2, tenure: 15 },
      { name: "Sustainable Agri Finance", interest: 8.8, tenure: 7 }
    ],
    ICICI: [
      { name: "SHG Bank Linkage", interest: 9, tenure: 5 },
      { name: "Udyogini Scheme", interest: 5, tenure: 7 },
      { name: "Insta Agri Gold Loan", interest: 8.5, tenure: 1 },
      { name: "Micro Enterprise Loan", interest: 11.5, tenure: 5 }
    ],
    PNB: [
      { name: "PNB Digi Shrestha", interest: 9.2, tenure: 5 },
      { name: "Mahila Udyam Nidhi", interest: 8.15, tenure: 10 },
      { name: "PNB Mahila Samriddhi", interest: 9.5, tenure: 7 },
      { name: "Krishi Mahila Card", interest: 7.0, tenure: 1 }
    ],
    BOB: [
      { name: "BOB Nari Shakti", interest: 8.4, tenure: 7 },
      { name: "Baroda Kisan Pride", interest: 8.7, tenure: 7 },
      { name: "Animal Husbandry KCC", interest: 7.0, tenure: 5 },
      { name: "Sanitation Loan", interest: 9.0, tenure: 5 }
    ],
    Axis: [
      { name: "Axis Asha Housing", interest: 8.75, tenure: 25 },
      { name: "Bharat Microfinance", interest: 12, tenure: 2 },
      { name: "Silk Personal Loan", interest: 11, tenure: 5 },
      { name: "SBB Loan", interest: 10.5, tenure: 5 }
    ],
    Kotak: [
      { name: "Kotak Silk Business", interest: 10.99, tenure: 5 },
      { name: "Rural Micro Business Loan", interest: 11.5, tenure: 3 },
      { name: "Education Loan for Daughters", interest: 9.5, tenure: 10 },
      { name: "Kotak KCC", interest: 7.0, tenure: 1 }
    ]
  };

  // Speech Recognition
  const recognitionRef = useRef(null);

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

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setChatQuestion("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  /* FETCH GOALS & PROFILE */
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${USER_API}/${userEmail}`);
        
        if (user?.fullName) {
          setUserName(user.fullName);
        } else if (res.data && res.data.name) {
          setUserName(res.data.name);
        }

        if (res.data) {

          if (res.data.workNature) {
            setBusinessInfo(res.data.workNature);
          } else if (res.data.workType) {
            setBusinessInfo(res.data.workType);
          }

          let occupationStr = res.data.occupation || res.data.role || res.data.persona || "Housewife";
          if (occupationStr.toLowerCase().includes("working")) {
             setPersona("Working Woman");
          } else if (occupationStr.toLowerCase().includes("housewife")) {
             setPersona("Housewife");
          } else {
             setPersona(occupationStr);
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
      const tips = await getSuggestions(persona, businessInfo, goals);
      setAiSuggestions(tips);
      setIsLoadingSuggestions(false);
    };

    // Add slight delay so goals array has time to fetch before building the prompt
    const timeout = setTimeout(fetchSuggestions, 800);
    return () => clearTimeout(timeout);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persona]);


  /* TEXT TO SPEECH */
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = audioLang || "en-IN";
    
    const voices = window.speechSynthesis.getVoices();
    const langVoices = voices.filter(voice => voice.lang.includes(audioLang) || voice.lang.includes(audioLang.split('-')[0]));

    let bestVoice = null;
    if (langVoices.length > 0) {
        bestVoice = langVoices.find(v =>
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('woman') ||
            v.name.toLowerCase().includes('google') ||
            v.name.toLowerCase().includes('swara') ||
            v.name.toLowerCase().includes('neerja') ||
            v.name.toLowerCase().includes('aditi') ||
            v.name.toLowerCase().includes('madhur')
        );
        if (!bestVoice) bestVoice = langVoices[0];
    }

    if (bestVoice) {
        utterance.voice = bestVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  const pauseSpeech = () => window.speechSynthesis.pause();
  const resumeSpeech = () => window.speechSynthesis.resume();
  const replaySpeech = () => {
    if (chatResponse) speak(chatResponse);
  };

  /* ASK ARTHIKA */
  const handleAskArthika = async () => {
    if (!chatQuestion.trim()) return;
    setIsChatLoading(true);
    const langObj = supportedLanguages.find(l => l.code === audioLang) || supportedLanguages[0];
    const res = await askArthika(persona, chatQuestion, langObj.name, businessInfo, goals);
    setChatResponse(res);
    setIsChatLoading(false);
    setChatQuestion("");
    speak(res);
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
        title: `${loanDetails.scheme || 'Loan'} from ${loanDetails.bank || 'Bank'}`,
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
      setLoanDetails({ bank: "", scheme: "", amount: "", interest: "", duration: "" });
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
              Hello {userName} ({persona})
            </span>
          </div>
          <p style={{ marginTop: '5px', fontSize: '0.9rem', color: '#555', fontWeight: '500' }}>
            This dashboard is tailored to you! You can update your persona (Housewife/Working) by going to your <b>Profile Page</b>.
          </p>

          {persona === "Working Woman" && (
            <div className="business-input-container" style={{ marginTop: "15px", background: "#fdfdfd", padding: "15px", borderRadius: "10px", border: "1px solid #eee" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#333' }}>
                  Tell me about your business/work (Ask Arthika will give personalized ideas!):
                </label>
                {!isEditingBusiness && businessInfo && (
                  <button 
                    onClick={() => setIsEditingBusiness(true)}
                    style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "16px" }}
                    title="Edit Business Info"
                  >
                    ✏️
                  </button>
                )}
              </div>
              
              {isEditingBusiness || !businessInfo ? (
                <div>
                  <textarea
                    value={businessInfo}
                    onChange={(e) => setBusinessInfo(e.target.value)}
                    placeholder="E.g., I run a tailoring shop and want to expand..."
                    rows={2}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "10px" }}
                  />
                  <button 
                    onClick={async () => {
                      setIsEditingBusiness(false);
                      try {
                        await axios.put("http://localhost:5000/api/profile/update-work", {
                          email: userEmail,
                          workNature: businessInfo
                        });
                      } catch (err) {
                        console.error("Failed to update work nature", err);
                      }
                    }}
                    style={{ background: "#000", color: "#fff", padding: "6px 15px", borderRadius: "12px", border: "none", fontWeight: "bold", cursor: "pointer" }}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p style={{ margin: 0, padding: "10px", background: "#fff", borderRadius: "8px", border: "1px solid #e0e0e0", fontStyle: "italic", color: "#555" }}>
                  {businessInfo}
                </p>
              )}
            </div>
          )}

          <div className={`persona-tips ${isLoadingSuggestions ? 'ai-pulse' : ''}`} style={{ marginTop: '20px' }}>
            <Sparkles className="tip-icon" />
            <div className="tip-content">
              <h4>Today's AI Suggestions</h4>
              <div className="gemini-tips-box">
                {isLoadingSuggestions ? (
                  <p className="loading-text"><Loader2 className="spinner" size={16} /> Arthika is thinking...</p>
                ) : (
                  <div style={{ whiteSpace: 'pre-line' }}>{aiSuggestions}</div>
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
                onChange={(e) => setLoanDetails({ ...loanDetails, bank: e.target.value, scheme: "", interest: "", duration: "" })}
              >
                <option value="">Select Indian Bank</option>
                {Object.keys(loanData).map((bank) => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>

            {loanDetails.bank && (
              <div className="loan-input-group">
                <Briefcase className="input-icon" />
                <select
                  value={loanDetails.scheme}
                  onChange={(e) => {
                    const selectedScheme = e.target.value;
                    const schemeObj = loanData[loanDetails.bank].find(s => s.name === selectedScheme);
                    if (schemeObj) {
                      setLoanDetails({ 
                        ...loanDetails, 
                        scheme: selectedScheme, 
                        interest: schemeObj.interest, 
                        duration: schemeObj.tenure 
                      });
                    } else {
                      setLoanDetails({ ...loanDetails, scheme: selectedScheme });
                    }
                  }}
                >
                  <option value="">Select Loan Scheme</option>
                  {loanData[loanDetails.bank].map((scheme) => (
                    <option key={scheme.name} value={scheme.name}>{scheme.name}</option>
                  ))}
                </select>
              </div>
            )}

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
          <div className="chat-header">
            <h3><MessageSquare size={24} /> Ask Arthika</h3>
            <p>Your Finanical Assistant to help you save and invest!</p>
          </div>

          <div className="chat-response-area">
            {isChatLoading ? (
              <div className="loading-chat"><Loader2 className="spinner" size={24} /> Thinking...</div>
            ) : (
              chatResponse && (
                <div className="chat-response-container">
                  <div className="chat-bubble">{chatResponse}</div>
                  <div className="tts-controls" style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
                    <button className="icon-btn" onClick={() => resumeSpeech()} title="Play" style={{ background: '#f5f5f5', border: '1px solid #ddd', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Play size={18} color="#555" /></button>
                    <button className="icon-btn" onClick={pauseSpeech} title="Pause" style={{ background: '#f5f5f5', border: '1px solid #ddd', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Pause size={18} color="#555" /></button>
                    <button className="icon-btn" onClick={replaySpeech} title="Replay" style={{ background: '#f5f5f5', border: '1px solid #ddd', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RefreshCw size={18} color="#555" /></button>
                  </div>
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

            <select
              value={audioLang}
              onChange={(e) => setAudioLang(e.target.value)}
              className="language-dropdown"
              style={{
                padding: '10px 15px',
                borderRadius: '15px',
                border: '3px solid #000',
                fontWeight: 'bold',
                outline: 'none',
                width: 'max-content'
              }}
            >
              {supportedLanguages.map(lang => (
                 <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>

            <button className={`mic-btn ${isListening ? 'listening' : ''}`} onClick={toggleListen} title="Speak with Arthika">
              <Mic size={24} />
            </button>

            <button className="primary-btn shrink-btn" onClick={handleAskArthika}>
              Send
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}