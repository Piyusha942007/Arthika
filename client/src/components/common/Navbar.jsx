import { useState, useEffect, useRef } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();
    const nav = useNavigate();
    const location = useLocation();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        signOut(() => nav("/"));
        setDropdownOpen(false);
    };

    const isActive = (path) => location.pathname === path ? "active-link" : "";

    return (
        <nav className="main-navbar">
            <div className="nav-content">
                {/* Logo Section */}
                <div className="nav-brand" onClick={() => nav("/home")} style={{ cursor: 'pointer' }}>
                    <span className="brand-text">Arthika</span>
                </div>

                {/* Navigation Links */}
                <div className={`nav-menu ${isMobileMenuOpen ? "mobile-open" : ""}`}>
                    <Link to="/home" className={isActive("/home")} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link to="/learn" className={isActive("/learn")} onClick={() => setIsMobileMenuOpen(false)}>Learn</Link>
                    <Link to="/invest" className={isActive("/invest")} onClick={() => setIsMobileMenuOpen(false)}>Invest</Link>
                    <Link to="/community" className={isActive("/community")} onClick={() => setIsMobileMenuOpen(false)}>Community</Link>
                </div>

                {/* Profile Section */}
                <div className="nav-actions">
                    {isLoaded && user ? (
                        <div className="profile-container" ref={dropdownRef}>
                            <div className="profile-pill" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <img src={user.imageUrl} alt="avatar" className="nav-avatar" />
                                <span className="nav-username">{user.firstName || "User"}</span>
                                <span className={`chevron ${dropdownOpen ? "rotate" : ""}`}>▼</span>
                            </div>

                            {dropdownOpen && (
                                <div className="profile-dropdown-menu">
                                    {/* The connecting arrow pointer */}
                                    <div className="dropdown-arrow"></div>

                                    {/* Separated Header Section */}
                                    <div className="dropdown-header">
                                        <p className="user-full-name">{user.fullName}</p>
                                        <p className="user-email">{user.primaryEmailAddress?.emailAddress}</p>
                                    </div>

                                    {/* Separated Body Section */}
                                    <div className="dropdown-body">
                                        <button className="dropdown-item" onClick={() => { nav("/profile"); setDropdownOpen(false); }}>
                                            My Profile
                                        </button>
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item logout-item" onClick={handleLogout}>
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="login-btn" onClick={() => nav("/login")}>Login</button>
                    )}

                    <div className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <span className={`bar ${isMobileMenuOpen ? "animate" : ""}`}></span>
                        <span className={`bar ${isMobileMenuOpen ? "animate" : ""}`}></span>
                        <span className={`bar ${isMobileMenuOpen ? "animate" : ""}`}></span>
                    </div>
                </div>
            </div>
        </nav>
    );
}