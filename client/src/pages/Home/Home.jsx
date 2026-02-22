import "./Home.css";
import heroImg from "../../assets/images/hero.png";
import learnImg from "../../assets/images/learn.png";
import communityImg from "../../assets/images/community.png";
import goalIcon from "../../assets/images/goalIcon.png";
import schemeIcon from "../../assets/images/schemeIcon.png";
export default function Home() {
    return (
        <div className="home">

            {/* NAVBAR */}
            <header className="navbar">
                <h1 className="logo">Arthika</h1>
                <nav>
                    <span>Learn</span>
                    <span>Community</span>
                    <span>Invest</span>
                    <span>Profile</span>
                </nav>
            </header>

            {/* HERO SECTION */}
            <section className="hero">
                <div className="hero-text">
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