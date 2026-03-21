// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import API_BASE_URL from "../../config/apiConfig";
// import { useUser, SignOutButton, useClerk, UserProfile } from "@clerk/clerk-react"; 
// import './Profile.css';

// const Profile = () => {
//     const { user, isLoaded } = useUser();
//     const { openUserProfile } = useClerk(); 
//     const [userData, setUserData] = useState(null);

//     const [isEditing, setIsEditing] = useState(false);
//     const [editName, setEditName] = useState("");
//     const [showSettings, setShowSettings] = useState(false);

//     const today = new Date().getDate(); 

//     // ✅ Greeting logic
//     const hour = new Date().getHours();
//     const greeting =
//         hour < 12 ? "Good Morning" :
//         hour < 17 ? "Good Afternoon" :
//         "Good Evening";

//     useEffect(() => {
//         if (!isLoaded || !user) return;

//         setEditName(user.fullName || "");
//         const email = user.primaryEmailAddress.emailAddress;

//         axios.get(`http://localhost:5000/api/profile/${email}`)
//             .then(res => {
//                 // 1. Get streaks from backend
//                 let backendStreaks = Array.isArray(res.data.streaks) ? res.data.streaks : [];

//                 // 2. Add today's date (10) if it's not already in the array
//                 // This ensures your streak count shows 3 instead of 2.
//                 if (!backendStreaks.includes(today)) {
//                     backendStreaks = [...backendStreaks, today];
//                 }

//                 setUserData({
//                     ...res.data,
//                     streaks: backendStreaks
//                 });

//                 // 3. Fetch highestUnlockedLevel from progress route 
//                 // to sync badges across the Learn page and Profile page
//                 return axios.get(`http://localhost:5000/api/lessons/progress?t=${Date.now()}`, {
//                     headers: { 'x-user-id': user.id }
//                 });
//             })
//             .then(progressRes => {
//                 if (progressRes && progressRes.data) {
//                     setUserData(prev => ({
//                         ...prev,
//                         level: progressRes.data.highestUnlockedLevel || 1
//                     }));
//                 }
//             })
//             .catch(() => {
//                 // Fallback for new accounts or if server is down
//                 setUserData({ 
//                     streaks: [today], // Even on error, show today as active
//                     role: 'Housewife', 
//                     phone: "" 
//                 });
//             });
//     }, [isLoaded, user, today]); // Added today to dependency array
//     const handleUpdateName = async () => {
//         try {
//             const [firstName, ...lastNameParts] = editName.trim().split(" ");
//             await user.update({ firstName, lastName: lastNameParts.join(" ") });
//             setIsEditing(false); 
//         } catch (err) { console.error(err); }
//     };

//     const handleToggle = (newRole) => {
//         axios.put(`${API_BASE_URL}/api/profile/update-role`, { 
//             email: user.primaryEmailAddress.emailAddress, role: newRole 
//         }).then(res => {
//             // Merge the updated role with the existing userData state 
//             // to ensure streaks and other frontend-calculated data aren't lost
//             setUserData(prevData => ({
//                 ...prevData,
//                 role: res.data.role || newRole
//             }));
//         }).catch(err => console.error("Failed to update role:", err));
//     };

//     if (!isLoaded || !userData) return <div className="loading-screen">Loading Arthika...</div>;

//     const currentLevel = userData?.level || 1; 
//     const totalLevels = 10;
//     const progressPercentage = (currentLevel / totalLevels) * 100;

//     const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
//     const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//     const allBadges = [
//         { level: 1, name: "The Identity Pioneer", icon: "🪪", color: "pink-ring", desc: "A digital fingerprint or a shining ID card icon." },
//         { level: 2, name: "Digital Explorer", icon: "🚀", color: "orange-ring", desc: "A smartphone with a soaring rocket or a lightning bolt." },
//         { level: 3, name: "Sisterhood Guardian", icon: "🪷", color: "pink-ring", desc: "Hands joined in a circle or a blooming lotus." },
//         { level: 4, name: "Credit Catalyst", icon: "🔑", color: "orange-ring", desc: "A golden key or an open gate representing bank access." },
//         { level: 5, name: "Budgeting Architect", icon: "🐷", color: "pink-ring", desc: "A well-organized piggy bank or a balanced scale." },
//         { level: 6, name: "Safety Shield", icon: "🛡️", color: "orange-ring", desc: "An umbrella over a house or a sturdy stone wall." },
//         { level: 7, name: "Wealth Weaver", icon: "🌱", color: "pink-ring", desc: "A small sprout turning into a golden tree." },
//         { level: 8, name: "Village Visionary", icon: "🏪", color: "orange-ring", desc: "A storefront with an 'Open' sign or a spinning gear." },
//         { level: 9, name: "Growth Strategist", icon: "🌉", color: "pink-ring", desc: "A bridge connecting a small town to a city skyline." },
//         { level: 10, name: "Financial Maharani", icon: "👑", color: "orange-ring", desc: "A crown made of light or a torch being passed to another hand." }
//     ];

//     return (
//         <div className="profile-page-container">
//             {showSettings && (

//                 <div className="custom-modal-overlay" onClick={() => setShowSettings(false)}>
//                     <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
//                         <button className="close-modal-btn" onClick={() => setShowSettings(false)}>×</button>
//                         <UserProfile appearance={{
//                             elements: {
//                                 card: { boxShadow: "none", width: "100%", backgroundColor: "#ffffff" },
//                                 navbar: { backgroundColor: "#ffffff", borderRight: "1px solid #F8EBCB", padding: "20px" },
//                                 pageScrollBox: { backgroundColor: "#ffffff" },
//                                 navbarButton: {
//                                     borderRadius: "15px",
//                                     marginBottom: "10px",
//                                     padding: "12px 20px",
//                                     fontWeight: "700",
//                                     transition: "all 0.2s"
//                                 },
//                                 navbarButton__profile: {
//                                     backgroundColor: "#F48FB1",
//                                     color: "white",
//                                     '&:hover': { backgroundColor: "#e2789c" }
//                                 },
//                                 navbarButton__security: {
//                                     backgroundColor: "#FFCC4D",
//                                     color: "white",
//                                     '&:hover': { backgroundColor: "#e6b845" }
//                                 }
//                             }
//                         }} />
//                     </div>
//                 </div>
//             )}

//             {/* <header className="header-nav">
//                 <div className="logo-brand">Arthika</div>
//                 <nav className="nav-items">
//                     <span>learn</span><span>community</span><span>invest</span><span className="nav-active">profile</span>
//                 </nav>
//                 <div className="header-right">
//                     <button onClick={() => setShowSettings(true)} className="account-settings-btn">⚙️ Settings</button>
//                     <SignOutButton><button className="sign-out-btn">Sign Out</button></SignOutButton>
//                 </div>
//             </header> */}

// <div className="hero-banner">
//     <div className="hero-left">
//         {/* Dynamic Greeting */}
//         <h1 className="hero-greet">{greeting}, <span className="exact-case">{user.firstName || "Friend"}</span>!</h1>

//         <div className="hero-progress-row">
//             <div className="hero-progress-track">
//                 <div 
//                     className="hero-progress-fill" 
//                     style={{ 
//                         width: `${progressPercentage}%`,
//                         transition: "width 0.5s ease-in-out" 
//                     }}
//                 ></div>
//             </div>
//             {/* ✅ Updated to show currentLevel/totalLevels (e.g., 1/10) */}
//             <span className="hero-level-text">Level {currentLevel}/{totalLevels}</span>
//         </div>
//     </div>

//     <div className="hero-right">
//         {/* ✅ Updated big number to show currentLevel/totalLevels */}
//         <div className="hero-big-num" style={{ fontSize: '40px' }}>
//             {currentLevel}/{totalLevels}
//         </div>
//     </div>
// </div>
//             <main className="profile-layout">
//                 <section className="profile-main-card">
//                     <h2 className="card-heading">My Profile</h2>

//                     <div className="profile-info-section">
//                         <div className="profile-avatar-wrapper">
//                             <div className="profile-avatar"><img src={user.imageUrl} alt="Profile" /></div>
//                             <button onClick={() => setShowSettings(true)} className="change-photo-btn">Change Photo</button>
//                         </div>

//                         <div className="profile-details">
//                             {isEditing ? (
//                                 <div className="arthika-edit-form">
//                                     <input className="arthika-input" value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus />
//                                     <div className="edit-actions">
//                                         <button onClick={handleUpdateName} className="save-btn">Save</button>
//                                         <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <>
//                                     <h3 className="profile-name exact-case">{user.fullName}</h3>
//                                     {/* <p className="profile-phone">{userData?.phone || "Add Phone"}</p> */}
//                                     <p className="profile-email">Email: {user.primaryEmailAddress.emailAddress}</p>
//                                     <button onClick={() => setIsEditing(true)} className="arthika-edit-link">Edit Name</button>
//                                 </>
//                             )}
//                         </div>
//                     </div>

//                     <div className="role-container-block">
//                         <h4 className="role-title">Role Toggle</h4>
//                         <div className="role-btn-group">
//                             <button onClick={() => handleToggle("Housewife")} className={`role-btn hw ${userData?.role === 'Housewife' ? 'active' : ''}`}><span>Housewife</span></button>
//                             <button onClick={() => handleToggle("Working")} className={`role-btn wk ${userData?.role === 'Working' ? 'active' : ''}`}><span>Working</span></button>
//                         </div>
//                     </div>

//                     <div className="streak-calendar-box">
//                         <p className="cal-month">MARCH 2026</p>
//                         <p className="cal-streak-label">🔥 {(userData?.streaks?.length || 0)}-Day Total Streak!</p>
//                         <div className="cal-grid-header">
//                             {dayLabels.map(label => <span key={label}>{label}</span>)}
//                         </div>
//                         <div className="cal-grid-body">
//                             {daysInMonth.map(date => (
//                                 <div key={date} className={`cal-date-circle ${userData?.streaks?.includes(date) ? 'streak-pink' : ''} ${date === today ? 'today-highlight' : ''}`}>
//                                     {date}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </section>

//                 <aside className="profile-sidebar">
//                     <div className="side-white-card">
//                         <h2 className="side-title">My Badges</h2>
//                         <div className="badge-list">
//                             {allBadges.filter(b => b.level <= currentLevel).map((badge) => (
//                                 <div className="badge-row" key={badge.level}>
//                                     <div className={`badge-circle ${badge.color}`}>{badge.icon}</div>
//                                     <div className="badge-text-box"><p>{badge.name}</p></div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="side-white-card">
//                         <h2 className="side-title">Support Circle</h2>
//                         <div className="support-list">
//                             <div className="support-item">
//                                 <span className="user-icon">👤</span>
//                                 <div className="support-details">
//                                     <p className="sup-name">Sonia SHG</p>
//                                     <p className="sup-phone">9876543210</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </aside>
//             </main>
//         </div>
//     );
// };

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

        axios.get(`${API_BASE_URL}/api/profile/${email}`)
            .then(res => {
                let backendStreaks = Array.isArray(res.data.streaks) ? res.data.streaks : [];

                if (!backendStreaks.includes(today)) {
                    backendStreaks = [...backendStreaks, today];
                }

                setUserData(prev => ({
                    ...res.data,
                    streaks: backendStreaks
                }));

                return axios.get(`${API_BASE_URL}/api/lessons/progress?t=${Date.now()}`, {
                    headers: { 'x-user-id': user.id }
                });
            })
            .then(progressRes => {
                if (progressRes && progressRes.data) {
                    setUserData(prev => ({
                        ...prev,
                        level: progressRes.data.highestUnlockedLevel || 1
                    }));
                }
            })
            .catch(() => {
                setUserData({
                    streaks: [today],
                    role: 'Housewife',
                    level: 1
                });
            });
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