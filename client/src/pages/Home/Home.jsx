import "./Home.css"
import heroImg from "../../assets/images/hero.png"
import learnImg from "../../assets/images/learn.png"
import communityImg from "../../assets/images/community.png"

export default function Home() {
  return (
    <div className="home-container">

      {/* Navbar */}
      <nav className="navbar">
        <div className="brand">Arthika</div>
        <ul className="nav-links">
          <li>Learn</li>
          <li>Community</li>
          <li>Invest</li>
          <li>Profile</li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Financial confidence starts here</h1>
          <p>
            Arthika is a tool which helps you learn finance and be independent
            on your own terms.
          </p>
          <div className="hero-buttons">
            <button className="primary">Learn</button>
            <button className="secondary">Invest</button>
          </div>
        </div>

        <div className="hero-image">
          <img src={heroImg} alt="Financial confidence" />
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <h2>FEATURES WE OFFER</h2>

        {/* Learn to Earn */}
        <div className="feature-block">
          <img src={learnImg} alt="Learn" />
          <div className="feature-content">
            <h3 className="pink">Learn to Earn</h3>
            <ul>
              <li>Interactive quizzes to test your knowledge</li>
              <li>Watch lessons in your language</li>
              <li>Track daily progress</li>
            </ul>
            <button className="outline-yellow">Go to learn page</button>
          </div>
        </div>

        {/* Invest Smartly */}
        <div className="feature-block reverse">
          <div className="feature-content">
            <h3 className="pink">Invest Smartly</h3>
            <div className="cards">
              <div className="card yellow">
                <h4>Goal-Based Planning</h4>
                <p>
                  Start saving for specific life milestones like a college fund,
                  family groceries, or a new business venture.
                </p>
              </div>

              <div className="card yellow">
                <h4>Government Schemes</h4>
                <p>
                  Explore and choose from different bank-specific perks and
                  government-backed savings programs.
                </p>
              </div>
            </div>
            <button className="outline-pink">Go to invest page</button>
          </div>
        </div>

        {/* Community */}
        <div className="community">
          <h3 className="pink">Build a Community</h3>
          <img src={communityImg} alt="Community" />
          <div className="community-actions">
            <button className="yellow">Get Expert Help</button>
            <button className="yellow">Grow with SHGs</button>
          </div>
          <button className="outline-black">Join a community</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <h4>Arthika</h4>
      </footer>
    </div>
  )
}