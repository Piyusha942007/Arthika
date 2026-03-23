import { useState, useRef, useEffect } from "react";
import API_BASE_URL from "../../config/apiConfig";
import "./Chatbot.css";

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

const getCodeFromGoog = (shortCode) => {
    const match = supportedLanguages.find(l => l.googCode === shortCode);
    return match ? match.code : "en-IN";
};

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "bot", text: "Hello! I am Arthika. How can I help you with your finances today? You can speak to me in your own language." }
    ]);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const isMutedRef = useRef(false);
    const lastBotMessageRef = useRef("Hello! I am Arthika. How can I help you with your finances today? You can speak to me in your own language.");
    const [inputText, setInputText] = useState("");
    const [micError, setMicError] = useState(null); // 'not-allowed', 'network', or null

    const prefilledQuestions = [
        "How can I save money?",
        "Schemes for women",
        "How to start a business?",
        "What is an SHG?"
    ];

    const toggleMute = () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        isMutedRef.current = newMuted;

        if (newMuted) {
            synthRef.current?.cancel();
            setIsSpeaking(false);
        } else {
            // Unmuted! Replay the last bot message.
            if (lastBotMessageRef.current) {
                speakText(lastBotMessageRef.current);
            }
        }
    };

    const getInitialLang = () => {
        const select = document.querySelector(".goog-te-combo");
        if (select && select.value) {
            return getCodeFromGoog(select.value);
        }
        const match = document.cookie.match(/googtrans=\/en\/(.*?)(;|$)/);
        if (match && match[1]) {
            return getCodeFromGoog(match[1]);
        }
        return "en-IN"; // Default
    };

    const [selectedLang, setSelectedLang] = useState(getInitialLang());

    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    useEffect(() => {
        window.speechSynthesis.getVoices();
    }, []);

    useEffect(() => {
        const checkLang = () => {
            const select = document.querySelector(".goog-te-combo");
            if (select && select.value) {
                setSelectedLang(getCodeFromGoog(select.value));
            }
        };

        checkLang();

        const observer = new MutationObserver(checkLang);
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // We still need to check for API support on load
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition API not supported in this browser.");
        }
    }, []);

    const toggleListen = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            // 1. Resume SpeechSynthesis on user gesture for mobile
            if (synthRef.current?.paused) {
                synthRef.current.resume();
            }
            synthRef.current?.cancel();
            setIsSpeaking(false);

            // 2. Initialize SpeechRecognition INSIDE the click handler for Safari/Mobile
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert("Speech recognition is not supported in this browser. Please try Chrome or Safari.");
                return;
            }

            if (!recognitionRef.current) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;

                recognitionRef.current.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    handleUserMessage(transcript);
                };

                recognitionRef.current.onerror = (event) => {
                    console.error("Speech recognition error:", event.error);
                    setIsListening(false);
                    if (event.error === 'not-allowed') {
                        setMicError('not-allowed');
                    } else if (event.error === 'network') {
                        setMicError('network');
                    }
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };
            }

            try {
                recognitionRef.current.lang = selectedLang;
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                console.error("Start error:", e);
                recognitionRef.current?.stop();
                setIsListening(false);
            }
        }
    };

    const speakText = (text) => {
        if (!synthRef.current || isMutedRef.current) return;

        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = selectedLang;

        const voices = synthRef.current.getVoices();
        const langVoices = voices.filter(voice => voice.lang.includes(selectedLang) || voice.lang.includes(selectedLang.split('-')[0]));

        // Priority system to find a comforting rural female voice depending on Browser Engine
        let bestVoice = null;
        if (langVoices.length > 0) {
            bestVoice = langVoices.find(v =>
                v.name.toLowerCase().includes('female') ||
                v.name.toLowerCase().includes('woman') ||
                v.name.toLowerCase().includes('google') || // Google Chrome default female
                v.name.toLowerCase().includes('swara') ||  // Edge default Hindi Female
                v.name.toLowerCase().includes('neerja') || // Windows OS default Hindi Female
                v.name.toLowerCase().includes('aditi') ||  // macOS default Hindi Female
                v.name.toLowerCase().includes('madhur')    // Edge default Marathi Female
            );

            // If still no explicitly female-named voice, fall back to the first available language voice
            if (!bestVoice) bestVoice = langVoices[0];
        }

        if (bestVoice) {
            utterance.voice = bestVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        synthRef.current.speak(utterance);
    };

    const handleUserMessage = async (text) => {
        if (!text.trim()) return;

        const newMessages = [...messages, { role: "user", text }];
        setMessages(newMessages);

        try {
            const langObj = supportedLanguages.find(l => l.code === selectedLang) || supportedLanguages[0];

            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, language: langObj.name })
            });

            const textData = await response.text();
            let data = {};
            try {
                data = JSON.parse(textData);
            } catch (e) {
                console.warn("Backend didn't return JSON", textData);
            }

            if (response.ok && data.reply) {
                setMessages([...newMessages, { role: "bot", text: data.reply }]);
                lastBotMessageRef.current = data.reply;
                speakText(data.reply);
            } else {
                throw new Error(data.error || "Server encountered an error.");
            }
        } catch (err) {
            console.error(err);
            const errorMsg = "Sorry, I am having trouble connecting to my brain right now. " + (err.message || "");
            setMessages([...newMessages, { role: "bot", text: errorMsg }]);
            lastBotMessageRef.current = errorMsg;
            speakText(errorMsg);
        }
    };

    const handleTextSubmit = (e) => {
        e.preventDefault();
        if (inputText.trim()) {
            handleUserMessage(inputText);
            setInputText("");
        }
    };

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div>
                            <h3>Arthika AI</h3>
                            <select
                                className="lang-selector"
                                value={selectedLang}
                                onChange={(e) => setSelectedLang(e.target.value)}
                            >
                                {supportedLanguages.map(lang => (
                                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <button
                                onClick={toggleMute}
                                title={isMuted ? "Unmute Bot" : "Mute Bot"}
                                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem" }}
                            >
                                {isMuted ? "🔇" : "🔊"}
                            </button>
                            <button className="close-btn" onClick={() => setIsOpen(false)}>✖</button>
                        </div>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.role}`}>
                                {msg.role === "bot" && <div className="avatar">🤖</div>}
                                <div className="bubble">{msg.text}</div>
                            </div>
                        ))}

                        {messages.length === 1 && (
                            <div className="prefilled-container" style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '8px', 
                                marginTop: '10px',
                                paddingLeft: '34px' // Align with bot bubble (avatar 24px + gap 10px)
                            }}>
                                <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: '#888', fontWeight: 'bold' }}>Quick Questions:</p>
                                {prefilledQuestions.map((q, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => handleUserMessage(q)}
                                        style={{ 
                                            textAlign: 'left',
                                            padding: '10px 15px', 
                                            borderRadius: '12px', 
                                            border: '1px solid #F8EBCB', 
                                            background: '#fff', 
                                            fontSize: '0.9rem', 
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                            color: '#333',
                                            width: 'fit-content',
                                            maxWidth: '100%'
                                        }}
                                        onMouseOver={(e) => { e.currentTarget.style.background = '#FFCC4D'; e.currentTarget.style.color = '#fff'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#333'; }}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="chatbot-input">
                        <div className="voice-controls">
                            <button
                                className={`mic-btn ${isListening ? 'listening' : ''} ${micError ? 'error' : ''}`}
                                onClick={() => {
                                    setMicError(null);
                                    toggleListen();
                                }}
                                title={isListening ? "Stop Listening" : "Start Speaking"}
                            >
                                {micError === 'not-allowed' ? "🚫" : (isListening ? "⏹️" : "🎤")}
                            </button>
                            <p className="mic-hint">
                                {micError === 'not-allowed' ? (
                                    <span style={{ color: '#d32f2f', textAlign: 'center' }}>
                                        Mic blocked. <button onClick={() => alert("To enable: \n1. Tap the lock icon or 'Aa' in the URL bar.\n2. Tap 'Site Settings'.\n3. Set Microphone to 'Allow'.")} style={{ background: 'none', border: 'none', color: '#007bff', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>How to unblock?</button>
                                    </span>
                                ) : (
                                    isListening ? "Listening..." : "Tap mic to speak"
                                )}
                            </p>
                        </div>

                        <form className="text-input-form" onSubmit={handleTextSubmit}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <button type="submit" disabled={!inputText.trim()}>Send</button>
                        </form>
                    </div>
                </div>
            )}

            {!isOpen && (
                <button className="chatbot-fab" onClick={() => setIsOpen(true)}>
                    <span className="fab-icon">💬</span>
                </button>
            )}
        </div>
    );
}
