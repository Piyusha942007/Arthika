import API_BASE_URL from "../../config/apiConfig";
// export default Profile;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser, useClerk, UserProfile } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import './Profile.css';
import { allBadges } from "../../constants/badges";

const Profile = () => {
    const { user, isLoaded } = useUser();
    const { openUserProfile } = useClerk();
    const [userData, setUserData] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [showSettings, setShowSettings] = useState(false);

    const todayStr = new Date().toISOString().split('T')[0]; // e.g. "2026-03-23"
    const todayDay = new Date().getDate();

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
                // Fetch profile and progress in parallel
                const [profileRes, progressRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/profile/${email}`),
                    axios.get(`${API_BASE_URL}/api/lessons/progress?t=${Date.now()}`, {
                        headers: { 'x-user-id': user.id }
                    })
                ]);

                let backendStreaks = Array.isArray(profileRes.data.streaks) ? profileRes.data.streaks : [];

                // Update streaks if today's date is missing
                if (!backendStreaks.includes(todayStr)) {
                    backendStreaks = [...backendStreaks, todayStr];
                    await axios.put(`${API_BASE_URL}/api/profile/update-streak`, {
                        email: email,
                        streaks: backendStreaks
                    });
                }

                setUserData({
                    ...profileRes.data,
                    streaks: backendStreaks,
                    level: progressRes.data?.highestUnlockedLevel || 1,
                    coins: progressRes.data?.totalCoins || 0,
                    completedVideos: progressRes.data?.completedVideos || 0,
                    totalVideos: progressRes.data?.totalVideos || 30
                });

            } catch (err) {
                console.error("Error in sync:", err);
                if (!userData) {
                    setUserData({
                        streaks: [todayStr],
                        role: 'Housewife',
                        level: 1,
                        coins: 0
                    });
                }
            }
        };

        syncUserData();
    }, [isLoaded, user, todayDay]);

    const handleUpdateName = async () => {
        try {
            const [firstName, ...lastNameParts] = editName.trim().split(" ");
            await user.update({ firstName, lastName: lastNameParts.join(" ") });
            setIsEditing(false);
        } catch (err) { console.error(err); }
    };

    const handleToggle = (newRole) => {
        console.log("Attempting to toggle role to:", newRole);
        axios.put(`${API_BASE_URL}/api/profile/update-role`, {
            email: user.primaryEmailAddress.emailAddress, role: newRole
        }).then(res => {
            console.log("Profile update response:", res.data);
            setUserData(prevData => ({
                ...prevData,
                role: res.data.role || newRole
            }));
        }).catch(err => {
            console.error("Failed to update role:", err);
            alert("Failed to update role. Please check console.");
        });
    };

    if (!isLoaded || !userData) return <div className="loading-screen">Loading Arthika...</div>;

    const currentLevel = userData?.level || 1;
    const totalLevels = 10;
    const progressPercentage = (currentLevel / totalLevels) * 100;

    const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];



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
                            <motion.div
                                className="hero-progress-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            ></motion.div>
                        </div>
                        <span className="hero-level-text">Level {currentLevel}/{totalLevels}</span>
                    </div>
                </div>
                <div className="hero-right">
                    <div className="hero-stats-glass">
                        <div className="hero-stat-item">
                            <span className="stat-label">LEVEL</span>
                            <span className="stat-value">{currentLevel}</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="hero-stat-item">
                            <span className="stat-label">COINS</span>
                            <span className="stat-value">🪙 {userData?.coins || 0}</span>
                        </div>
                    </div>
                </div>
            </div>            <main className="profile-dashboard">
                <div className="dashboard-left">
                    <section className="dashboard-card profile-details-card">
                        <div className="profile-header-flex">
                            <div className="p-avatar-box">
                                <img src={user.imageUrl} alt="Profile" />
                                <button onClick={() => setShowSettings(true)} className="p-edit-btn">✏️</button>
                            </div>
                            <div className="p-text-info">
                                {isEditing ? (
                                    <div className="p-edit-field">
                                        <input value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus />
                                        <div className="p-edit-btns">
                                            <button onClick={handleUpdateName} className="p-save">Save</button>
                                            <button onClick={() => setIsEditing(false)} className="p-cancel">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="p-fullname">{user.fullName}</h3>
                                        <p className="p-email">{user.primaryEmailAddress.emailAddress}</p>
                                        <button onClick={() => setIsEditing(true)} className="p-name-edit">Edit Name</button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="p-role-row">
                            <span className="p-role-label">Current Role:</span>
                            <div className="p-role-toggles">
                                <button onClick={() => handleToggle("Housewife")} className={`p-role-opt hw ${userData?.role === 'Housewife' ? 'active' : ''}`}>Housewife</button>
                                <button onClick={() => handleToggle("Working")} className={`p-role-opt wk ${userData?.role === 'Working' ? 'active' : ''}`}>Working Woman</button>
                            </div>
                        </div>
                    </section>

                    <section className="dashboard-card streak-section">
                        <div className="section-header">
                            <h2 className="section-title">Consistency Hub</h2>
                            <p className="streak-count-glow">🔥 {userData?.streaks?.length || 0} Days Active</p>
                        </div>
                        <div className="calendar-container">
                            <p className="calendar-month-text">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                            <div className="calendar-grid">
                                {dayLabels.map(label => <span key={label} className="cal-label">{label}</span>)}
                                {daysInMonth.map(date => {
                                    const dateStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                                    const isStreak = userData?.streaks?.includes(dateStr);
                                    const isToday = date === todayDay;
                                    return (
                                        <div key={date} className={`cal-cell ${isStreak ? 'active-streak' : ''} ${isToday ? 'current-day' : ''}`}>
                                            {date}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </div>

                <div className="dashboard-right">
                    <section className="dashboard-card badges-milestones">
                        <h2 className="section-title">My Milestones</h2>
                        <div className="badge-grid-compact">
                            {allBadges.map((badge) => {
                                const isUnlocked = badge.level < currentLevel;
                                return (
                                    <div className={`badge-item-mini ${isUnlocked ? 'unlocked' : 'locked'}`} key={badge.level} title={isUnlocked ? badge.name : "Locked"}>
                                        <div className="badge-icon-disk" style={isUnlocked ? { background: badge.color } : {}}>
                                            {isUnlocked ? badge.icon : "🔒"}
                                        </div>
                                        <p className="badge-mini-name">{isUnlocked ? badge.name : `Level ${badge.level}`}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="dashboard-card support-network">
                        <h2 className="section-title">Sisterhood Circle</h2>
                        <div className="support-card-mini">
                            <div className="mavim-logo">MAVIM</div>
                            <div className="support-info">
                                <h4>Mahila Arthik Vikas Mahamandal</h4>
                                <a href="tel:02024330104" className="call-btn">📞 020-24330104</a>
                            </div>
                        </div>
                        <p className="sisterhood-msg">Together, we build the future. Reach out for any guidance on SHGs or Business.</p>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Profile;