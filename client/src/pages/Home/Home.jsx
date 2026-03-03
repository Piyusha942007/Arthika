import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import heroImg from "../../assets/images/hero.png";
import learnImg from "../../assets/images/learn.png";
import communityImg from "../../assets/images/community.png";
import goalIcon from "../../assets/images/goalIcon.png";
import schemeIcon from "../../assets/images/schemeIcon.png";

export default function Home() {
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();
    const nav = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const ensureUsername = async () => {
            if (isLoaded && user && !user.username) {
                try {
                    let autoUsername = user.firstName || (user.primaryEmailAddress && user.primaryEmailAddress.emailAddress.split("@")[0]) || "user" + Math.floor(Math.random() * 10000);
                    autoUsername = autoUsername.toLowerCase().replace(/[^a-z0-9]/g, "");
                    if (autoUsername.length < 4) autoUsername += Math.floor(Math.random() * 1000);
                    await user.update({ username: autoUsername });
                } catch (err) {
                    console.error("Failed to sync auto-username:", err);
                }
            }
        };
        ensureUsername();
    }, [isLoaded, user]);

    return (
        <div className="home">

            {/* HERO SECTION */}
            <section className="hero">
                <div className="hero-text">
                    {user?.username && <h1 className="logo" style={{ marginBottom: "1rem", fontSize: "2.5rem" }}>Welcome {user.username}</h1>}
                    <h2>Financial confidence<br />starts here</h2>
                    <p>
                        Arthika is a tool which helps you learn finance and be independent
                        on your own terms
                    </p>

                    <div className="hero-buttons">
                        {/* Updated Hero Button */}
                        <button className="primary" onClick={() => nav("/learn")}>Learn</button>
                        <button className="secondary">Invest</button>
                    </div>
                </div>

                <div className="hero-image">
                    <img src={heroImg} alt="Finance Illustration" />
                </div>
            </section>

            {/* FEATURES */}
            <section className="features">
                <h2 className="section-title">FEATURES WE OFFER</h2>

                <div className="feature-block learn-section">
                    <h3 className="pink">Learn to Earn</h3>
                    <div className="feature-content">
                        <img src={learnImg} alt="Learning" />
                        <ul>
                            <li>Interactive quizzes to test your knowledge</li>
                            <li className="highlight">Watch lessons in your language</li>
                            <li>Track daily progress</li>
                        </ul>
                    </div>
                    {/* Updated Feature Section Button */}
                    <button className="outline-yellow" onClick={() => nav("/learn")}>Go to learn page</button>
                </div>

                {/* Invest Smartly */}
                <div className="feature-block invest-section">
                    <h3 className="pink">Invest Smartly</h3>
                    <div className="cards">
                        <div className="card yellow">
                            <img src={goalIcon} alt="Goal Icon" />
                            <h4>Goal-Based Planning</h4>
                            <p>Start saving for milestones like a college fund or business venture.</p>
                        </div>
                        <div className="card yellow">
                            <img src={schemeIcon} alt="Scheme Icon" />
                            <h4>Government Schemes</h4>
                            <p>Explore bank-specific perks and government-backed programs.</p>
                        </div>
                    </div>
                    <button className="outline-pink">Go to invest page</button>
                </div>

                {/* Community */}
                <div className="feature-block community-block">
                    <h3 className="pink">Build a Community</h3>
                    <img src={communityImg} alt="Community" className="community-img" />
                    <div className="community-actions">
                        <button className="yellow">Get Expert Help</button>
                        <button className="yellow">Grow with SHGs</button>
                    </div>
                    <button className="outline-black">Join a community</button>
                </div>
            </section>

            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-brand">
                        <h2 className="footer-logo">Arthika</h2>
                        <p>A multilingual financial empowerment platform designed to make money management easy, accessible, and secure.</p>
                    </div>
                    <div className="footer-links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li onClick={() => nav("/")} style={{cursor:'pointer'}}>Home</li>
                            <li onClick={() => nav("/learn")} style={{cursor:'pointer'}}>Learn</li>
                            <li>Dashboard</li>
                            <li>Contact</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 Arthika. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}