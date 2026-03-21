import "./Auth.css";
import logoImg from "../../assets/images/arthikalogo.jpeg";

export default function AuthPage({ right }) {
  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="left-panel-content">
          <img src={logoImg} alt="Arthika" className="side-logo" />
          <h1 className="brand-name-center">Arthika</h1>
          <p className="side-tagline">Aapka Paisa, Aapka Faisla</p>
          <p className="side-desc">
            A multilingual financial empowerment platform designed to make money management easy, accessible, and secure.
          </p>
        </div>
      </div>
      <div className="auth-right">{right}</div>
    </div>
  );
}