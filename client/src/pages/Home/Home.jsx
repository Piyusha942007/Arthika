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
                    // Auto-generate username from email prefix or first name
                    let autoUsername = user.firstName || (user.primaryEmailAddress && user.primaryEmailAddress.emailAddress.split("@")[0]) || "user" + Math.floor(Math.random() * 10000);

                    // Ensure it's valid (Clerk usernames usually require alphanumeric, lowercase, min length)
                    autoUsername = autoUsername.toLowerCase().replace(/[^a-z0-9]/g, "");
                    if (autoUsername.length < 4) autoUsername += Math.floor(Math.random() * 1000);

                    // If autoUsername is still invalid or duplicate, this might throw, but it runs silently
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

            {/* NAVBAR */}
            <header className="navbar">
                <h1 className="logo">Arthika</h1>
                <nav>
                    <span>Learn</span>
                    <span>Community</span>
                    <span>Invest</span>
                    <div className="profile-menu-container" style={{ position: "relative", display: "inline-block" }}>
                        <span
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
                        >
                            Profile {dropdownOpen ? "▲" : "▼"}
                        </span>

                        {dropdownOpen && (
                            <div className="profile-dropdown" style={{
                                position: "absolute",
                                top: "100%",
                                right: 0,
                                marginTop: "10px",
                                backgroundColor: "white",
                                color: "black",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                borderRadius: "8px",
                                overflow: "hidden",
                                zIndex: 1000,
                                minWidth: "120px"
                            }}>
                                <button
                                    onClick={() => signOut(() => nav("/"))}
                                    style={{
                                        width: "100%",
                                        padding: "10px 15px",
                                        background: "transparent",
                                        border: "none",
                                        color: "#ef4444",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        textAlign: "left",
                                        fontSize: "14px"
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                >
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
            </header>

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
                        <button className="primary">Learn</button>
                        <button className="secondary">Invest</button>
                    </div>
                </div>

                <div className="hero-image">
                    <img src={heroImg} alt="Finance Illustration" />
                    <h3></h3>
                </div>
            </section>

            {/* FEATURES */}
            <section className="features">
                <h2 className="section-title">FEATURES WE OFFER</h2>

                {/* Learn to Earn */}

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

                    <button className="outline-yellow">Go to learn page</button>
                </div>

                {/* Invest Smartly */}
                <div className="feature-block invest-section">
                    <h3 className="pink">Invest Smartly</h3>

                    <div className="cards">
                        <div className="card yellow">
                            <img src={goalIcon} alt="Goal Icon" />
                            <h4>Goal-Based Planning</h4>
                            <p>
                                Start saving for specific life milestones like a college fund,
                                family groceries, or a new business venture.
                            </p>
                        </div>

                        <div className="card yellow">
                            <img src={schemeIcon} alt="Scheme Icon" />
                            <h4>Government Schemes</h4>
                            <p>
                                Explore and choose from different bank-specific perks and
                                government-backed savings programs.
                            </p>
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

            <footer class="footer">
                <div class="footer-container">
                    <div class="footer-brand">
                        <h2 class="footer-logo">Arthika</h2>
                        <p>A multilingual financial empowerment platform designed to make money management easy, accessible, and secure.</p>
                        <div class="social-icons">
                            <i class="fab fa-facebook"></i>
                            <i class="fab fa-x-twitter"></i>
                            <i class="fab fa-instagram"></i>
                            <i class="fab fa-linkedin"></i>
                        </div>
                    </div>

                    <div class="footer-links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li>About us</li>
                            <li>Features</li>
                            <li>Dashboard</li>
                            <li>Contact</li>
                        </ul>
                    </div>

                    <div class="footer-links">
                        <h3>Support</h3>
                        <ul>
                            <li>Help Center</li>
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>© 2026 Arthika. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}