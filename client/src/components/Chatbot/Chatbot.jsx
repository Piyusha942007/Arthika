import { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

import { supportedLanguages, getCodeFromGoog, getInitialLang, getLanguageName } from "../../utils/languageUtils";


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
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = async (event) => {
                const transcript = event.results[0][0].transcript;
                handleUserMessage(transcript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        } else {
            console.warn("Speech Recognition API not supported in this browser.");
        }
    }, []);

    const toggleListen = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            synthRef.current.cancel();
            setIsSpeaking(false);

            try {
                if (recognitionRef.current) {
                    recognitionRef.current.lang = selectedLang;
                }
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const speakText = (text) => {
        if (!synthRef.current || isMutedRef.current) return;

        synthRef.current.cancel();

        // Small delay for engine stability
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = selectedLang;

            const voices = synthRef.current.getVoices();
            const langVoices = voices.filter(voice => voice.lang.includes(selectedLang) || voice.lang.includes(selectedLang.split('-')[0]));

            // Priority system to find a comforting rural female voice depending on Browser Engine
            let bestVoice = null;
            if (langVoices.length > 0) {
                // 1. Try to find local female voices
                bestVoice = langVoices.find(v =>
                    !v.name.toLowerCase().includes('online') &&
                    !v.name.toLowerCase().includes('natural') &&
                    (v.name.toLowerCase().includes('female') ||
                        v.name.toLowerCase().includes('woman') ||
                        v.name.toLowerCase().includes('google') || // Google Chrome default female
                        v.name.toLowerCase().includes('swara') ||  // Edge default Hindi Female
                        v.name.toLowerCase().includes('neerja') || // Windows OS default Hindi Female
                        v.name.toLowerCase().includes('aditi') ||  // macOS default Hindi Female
                        v.name.toLowerCase().includes('madhur'))   // Edge default Marathi Female
                );

                // 2. Try to find any local voice to avoid Online failures
                if (!bestVoice) {
                    bestVoice = langVoices.find(v =>
                        !v.name.toLowerCase().includes('online') &&
                        !v.name.toLowerCase().includes('natural')
                    );
                }

                // 3. Fallback
                if (!bestVoice) bestVoice = langVoices[0];
            }

            if (bestVoice) {
                utterance.voice = bestVoice;
            }

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = (e) => {
                setIsSpeaking(false);
                console.error("Speech error:", e);
                // Retry with any local voice if online failed
                if (e.error === 'synthesis-failed' && bestVoice?.name.toLowerCase().includes('online')) {
                    const fallbackVoice = voices.find(v => !v.name.toLowerCase().includes('online'));
                    if (fallbackVoice) {
                        const retryUtterance = new SpeechSynthesisUtterance(text);
                        retryUtterance.voice = fallbackVoice;
                        retryUtterance.lang = fallbackVoice.lang;
                        synthRef.current.speak(retryUtterance);
                    }
                }
            };

            synthRef.current.speak(utterance);
        }, 100);
    };


    const handleUserMessage = async (text) => {
        if (!text.trim()) return;

        const newMessages = [...messages, { role: "user", text }];
        setMessages(newMessages);

        try {
            const response = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, language: getLanguageName(selectedLang) })
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
                                onChange={(e) => {
                                    const newLang = e.target.value;
                                    setSelectedLang(newLang);
                                    localStorage.setItem("lang", newLang);
                                }}
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

                    </div>

                    <div className="chatbot-input">
                        <div className="voice-controls">
                            <button
                                className={`mic-btn \${isListening ? 'listening' : ''}`}
                                onClick={toggleListen}
                                title={isListening ? "Stop Listening" : "Start Speaking"}
                            >
                                🎤
                            </button>
                            <p className="mic-hint">{isListening ? "Listening..." : "Tap mic to speak"}</p>
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
