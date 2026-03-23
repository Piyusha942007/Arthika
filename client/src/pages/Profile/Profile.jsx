import API_BASE_URL from "../../config/apiConfig";
// export default Profile;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser, useClerk, UserProfile } from "@clerk/clerk-react";
import './Profile.css';

const Profile = () => {
    const { user, isLoaded } = useUser();
    const { openUserProfile } = useClerk();
    const [userData, setUserData] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [showSettings, setShowSettings] = useState(false);

    const today = new Date().getDate();

    // ✅ Greeting logic
    const hour = new Date().getHours();
    const greeting =
        hour < 12 ? "Good Morning" :
            hour < 17 ? "Good Afternoon" :
                "Good Evening";

    useEffect(() => {
        if (!isLoaded || !user) return;

        setEditName(user.fullName || "");
        const email = user.primaryEmailAddress.emailAddress;

        const syncUserData = async () => {
            try {
                // 1. Pehle profile data fetch karo
                const res = await axios.get(`${API_BASE_URL}/api/profile/${email}`);
                let backendStreaks = Array.isArray(res.data.streaks) ? res.data.streaks : [];

                // 2. Agar aaj ki date missing hai, toh update karo
                if (!backendStreaks.includes(today)) {
                    backendStreaks = [...backendStreaks, today];

                    // Backend ko update bhejo
                    await axios.put(`${API_BASE_URL}/api/profile/update-streak`, {
                        email: email,
                        streaks: backendStreaks
                    });
                    console.log("Streak synchronized with server.");
                }

                // 3. Sabse pehle base profile aur streaks set karo
                setUserData(prev => ({
                    ...res.data,
                    streaks: backendStreaks
                }));

                // 4. Phir progress fetch karo
                const progressRes = await axios.get(`${API_BASE_URL}/api/lessons/progress?t=${Date.now()}`, {
                    headers: { 'x-user-id': user.id }
                });

                if (progressRes.data) {
                    setUserData(prev => ({
                        ...prev,
                        level: progressRes.data.highestUnlockedLevel || 1
                    }));
                }
            } catch (err) {
                console.error("Error in sync:", err);
                // Default fallback agar API fail ho jaye
                if (!userData) {
                    setUserData({
                        streaks: [today],
                        role: 'Housewife',
                        level: 1
                    });
                }
            }
        };

        syncUserData();
    }, [isLoaded, user, today]);

    const handleUpdateName = async () => {
        try {
            const [firstName, ...lastNameParts] = editName.trim().split(" ");
            await user.update({ firstName, lastName: lastNameParts.join(" ") });
            setIsEditing(false);
        } catch (err) { console.error(err); }
    };

    const handleToggle = (newRole) => {
        axios.put(`${API_BASE_URL}/api/profile/update-role`, {
            email: user.primaryEmailAddress.emailAddress, role: newRole
        }).then(res => {
            setUserData(prevData => ({
                ...prevData,
                role: res.data.role || newRole
            }));
        }).catch(err => console.error("Failed to update role:", err));
    };

    if (!isLoaded || !userData) return <div className="loading-screen">Loading Arthika...</div>;

    const currentLevel = userData?.level || 1;
    const totalLevels = 10;
    const progressPercentage = ((currentLevel - 1) / totalLevels) * 100;

    const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const allBadges = [
        { level: 1, name: "The Identity Pioneer", icon: "🪪", color: "pink-ring" },
        { level: 2, name: "Digital Explorer", icon: "🚀", color: "orange-ring" },
        { level: 3, name: "Sisterhood Guardian", icon: "🪷", color: "pink-ring" },
        { level: 4, name: "Credit Catalyst", icon: "🔑", color: "orange-ring" },
        { level: 5, name: "Budgeting Architect", icon: "🐷", color: "pink-ring" },
        { level: 6, name: "Safety Shield", icon: "🛡️", color: "orange-ring" },
        { level: 7, name: "Wealth Weaver", icon: "🌱", color: "pink-ring" },
        { level: 8, name: "Village Visionary", icon: "🏪", color: "orange-ring" },
        { level: 9, name: "Growth Strategist", icon: "🌉", color: "pink-ring" },
        { level: 10, name: "Financial Maharani", icon: "👑", color: "orange-ring" }
    ];

    return (
        <div className="profile-page-container">
            {showSettings && (
                <div className="custom-modal-overlay" onClick={() => setShowSettings(false)}>
                    <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setShowSettings(false)}>×</button>
                        <UserProfile />
                    </div>
                </div>
            )}

            <div className="hero-banner">
                <div className="hero-left">
                    <h1 className="hero-greet">{greeting}, <span className="exact-case">{user.firstName || "Friend"}</span>!</h1>
                    <div className="hero-progress-row">
                        <div className="hero-progress-track">
                            <div
                                className="hero-progress-fill"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <span className="hero-level-text">Level {currentLevel}/{totalLevels}</span>
                    </div>
                </div>
                <div className="hero-right">
                    <div className="hero-big-num">
                        {currentLevel}
                    </div>
                </div>
            </div>

            <main className="profile-layout">
                <section className="profile-main-card">
                    <h2 className="card-heading">My Profile</h2>

                    <div className="profile-info-section">
                        <div className="profile-avatar-wrapper">
                            <div className="profile-avatar"><img src={user.imageUrl} alt="Profile" /></div>
                            <button onClick={() => setShowSettings(true)} className="change-photo-btn">Edit Profile</button>
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
                                    <h3 className="profile-name exact-case">{user.fullName}</h3>
                                    <p className="profile-email">{user.primaryEmailAddress.emailAddress}</p>
                                    <button onClick={() => setIsEditing(true)} className="arthika-edit-link">Edit Name</button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="role-container-block">
                        <h4 className="role-title">Current Role</h4>
                        <div className="role-btn-group">
                            <button onClick={() => handleToggle("Housewife")} className={`role-btn hw ${userData?.role === 'Housewife' ? 'active' : ''}`}><span>Housewife</span></button>
                            <button onClick={() => handleToggle("Working")} className={`role-btn wk ${userData?.role === 'Working' ? 'active' : ''}`}><span>Working</span></button>
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
                        <h2 className="side-title">My Badges</h2>
                        <div className="badge-list">
                            {/* Logic: Only show badge if the user has PASSED that level */}
                            {allBadges.filter(b => b.level < currentLevel).map((badge) => (
                                <div className="badge-row" key={badge.level}>
                                    <div className={`badge-circle ${badge.color}`}>{badge.icon}</div>
                                    <div className="badge-text-box">
                                        <p className="badge-name-text">{badge.name}</p>
                                        <span className="badge-status">Level {badge.level} Completed</span>
                                    </div>
                                </div>
                            ))}

                            {/* Locked Badge (Next Milestone) */}
                            {currentLevel <= 10 && (
                                <div className="badge-row locked-badge">
                                    <div className="badge-circle locked">🔒</div>
                                    <div className="badge-text-box">
                                        <p className="badge-name-text" style={{ color: '#999' }}>Next: Level {currentLevel}</p>
                                        <span className="badge-status-locked">Complete current level to unlock</span>
                                    </div>
                                </div>
                            )}

                            {allBadges.filter(b => b.level < currentLevel).length === 0 && currentLevel === 1 && (
                                <p className="no-badges-msg">Start your first lesson to earn your first badge!</p>
                            )}
                        </div>
                    </div>

                    <div className="side-white-card">
                        <h2 className="side-title">Support Circle</h2>
                        <div className="support-list">
                            <div className="support-item">
                                <span className="user-icon">👤</span>
                                <div className="support-details">
                                    <p className="sup-name">Mahila Arthik Vikas Mahamandal (MAVIM) </p>
                                    <p className="sup-phone">020-24330104</p>
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