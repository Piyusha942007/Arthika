import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser, SignOutButton, useClerk, UserProfile } from "@clerk/clerk-react"; 
import './Profile.css';

const Profile = () => {
    const { user, isLoaded } = useUser();
    const { openUserProfile } = useClerk(); 
    const [userData, setUserData] = useState(null);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    
    const today = new Date().getDate(); 

    // ✅ Greeting logic added
    const hour = new Date().getHours();
    const greeting =
        hour < 12 ? "Good Morning" :
        hour < 17 ? "Good Afternoon" :
        "Good Evening";

    useEffect(() => {
        if (!isLoaded || !user) return;
        
        setEditName(user.fullName || "");
        const email = user.primaryEmailAddress.emailAddress;

        axios.get(`http://localhost:5000/api/profile/${email}`)
            .then(res => setUserData(res.data))
            .catch(() => setUserData({ streaks: [2, 5, 8, 12, 15], role: 'Housewife', phone: "" }));
    }, [isLoaded, user]);

    const handleUpdateName = async () => {
        try {
            const [firstName, ...lastNameParts] = editName.trim().split(" ");
            await user.update({ firstName, lastName: lastNameParts.join(" ") });
            setIsEditing(false); 
        } catch (err) { console.error(err); }
    };

    const handleToggle = (newRole) => {
        axios.put('http://localhost:5000/api/profile/update-role', { 
            email: user.primaryEmailAddress.emailAddress, role: newRole 
        }).then(res => setUserData(res.data));
    };

    if (!isLoaded || !userData) return <div className="loading-screen">Loading Arthika...</div>;

    const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="profile-page-container">
            {showSettings && (
                <div className="custom-modal-overlay" onClick={() => setShowSettings(false)}>
                    <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setShowSettings(false)}>×</button>
                        <UserProfile appearance={{
                            elements: {
                                card: { boxShadow: "none", width: "100%", backgroundColor: "#ffffff" },
                                navbar: { backgroundColor: "#ffffff", borderRight: "1px solid #F8EBCB", padding: "20px" },
                                pageScrollBox: { backgroundColor: "#ffffff" },
                                navbarButton: {
                                    borderRadius: "15px",
                                    marginBottom: "10px",
                                    padding: "12px 20px",
                                    fontWeight: "700",
                                    transition: "all 0.2s"
                                },
                                navbarButton__profile: {
                                    backgroundColor: "#F48FB1",
                                    color: "white",
                                    '&:hover': { backgroundColor: "#e2789c" }
                                },
                                navbarButton__security: {
                                    backgroundColor: "#FFCC4D",
                                    color: "white",
                                    '&:hover': { backgroundColor: "#e6b845" }
                                }
                            }
                        }} />
                    </div>
                </div>
            )}

            {/* <header className="header-nav">
                <div className="logo-brand">Arthika</div>
                <nav className="nav-items">
                    <span>learn</span><span>community</span><span>invest</span><span className="nav-active">profile</span>
                </nav>
                <div className="header-right">
                    <button onClick={() => setShowSettings(true)} className="account-settings-btn">⚙️ Settings</button>
                    <SignOutButton><button className="sign-out-btn">Sign Out</button></SignOutButton>
                </div>
            </header> */}

            <div className="hero-banner">
                <div className="hero-left">
                    
                    {/* ✅ Greeting updated here */}
                    <h1 className="hero-greet">{greeting}, {user.firstName || "Friend"}!</h1>

                    <div className="hero-progress-row">
                        <div className="hero-progress-track">
                            <div className="hero-progress-fill" style={{ width: '50%' }}></div>
                        </div>
                        <span className="hero-level-text">level 1</span>
                    </div>
                </div>
                <div className="hero-right"><div className="hero-big-num">1</div></div>
            </div>

            <main className="profile-layout">
                <section className="profile-main-card">
                    <h2 className="card-heading">my profile</h2>
                    
                    <div className="profile-info-section">
                        <div className="profile-avatar-wrapper">
                            <div className="profile-avatar"><img src={user.imageUrl} alt="Profile" /></div>
                            <button onClick={() => setShowSettings(true)} className="change-photo-btn">Change Photo</button>
                        </div>

                        <div className="profile-details">
                            {isEditing ? (
                                <div className="arthika-edit-form">
                                    <input className="arthika-input" value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus />
                                    <div className="edit-actions">
                                        <button onClick={handleUpdateName} className="save-btn">Save</button>
                                        <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3 className="profile-name">{user.fullName}</h3>
                                    <p className="profile-phone">{userData?.phone || "Add Phone"}</p>
                                    <p className="profile-email">email: {user.primaryEmailAddress.emailAddress}</p>
                                    <button onClick={() => setIsEditing(true)} className="arthika-edit-link">Edit Name</button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="role-container-block">
                        <h4 className="role-title">role toggle</h4>
                        <div className="role-btn-group">
                            <button onClick={() => handleToggle("Housewife")} className={`role-btn hw ${userData?.role === 'Housewife' ? 'active' : ''}`}>Housewife</button>
                            <button onClick={() => handleToggle("Working")} className={`role-btn wk ${userData?.role === 'Working' ? 'active' : ''}`}>Working</button>
                        </div>
                    </div>

                    <div className="streak-calendar-box">
                        <p className="cal-month">MARCH 2026</p>
                        <p className="cal-streak-label">🔥 {(userData?.streaks?.length || 0)}-Day Total Streak!</p>
                        <div className="cal-grid-header">
                            {dayLabels.map(label => <span key={label}>{label}</span>)}
                        </div>
                        <div className="cal-grid-body">
                            {daysInMonth.map(date => (
                                <div key={date} className={`cal-date-circle ${userData?.streaks?.includes(date) ? 'streak-pink' : ''} ${date === today ? 'today-highlight' : ''}`}>
                                    {date}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <aside className="profile-sidebar">
                    <div className="side-white-card">
                        <h2 className="side-title">my badges</h2>
                        <div className="badge-list">
                            <div className="badge-row">
                                <div className="badge-circle pink-ring">💰</div>
                                <div className="badge-text-box"><p>Savings star</p></div>
                            </div>
                            <div className="badge-row">
                                <div className="badge-circle orange-ring">📖</div>
                                <div className="badge-text-box"><p>Edu Champ</p></div>
                            </div>
                            <div className="badge-row">
                                <div className="badge-circle pink-ring">💳</div>
                                <div className="badge-text-box"><p>Digital Dost</p></div>
                            </div>
                        </div>
                    </div>

                    <div className="side-white-card">
                        <h2 className="side-title">support circle</h2>
                        <div className="support-list">
                            <div className="support-item">
                                <span className="user-icon">👤</span>
                                <div className="support-details">
                                    <p className="sup-name">Sonia SHG</p>
                                    <p className="sup-phone">9876543210</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default Profile;