import React, { useState, useRef } from 'react';
import './Community.css';

// Import icons from local assets as requested
import connectIcon from '../../assets/images/image 2.png';
import earnIcon from '../../assets/images/image 1.png';

export default function Community() {
    const [view, setView] = useState('hub'); // 'hub', 'connect', 'earn'
    const [connectLocation, setConnectLocation] = useState(''); // Separate location for Connect view
    const [businessForm, setBusinessForm] = useState({
        businessName: '',
        ownerName: '',
        contact: '',
        location: '',
        description: ''
    });
    const [photos, setPhotos] = useState([]);
    const [shgs, setShgs] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [businesses, setBusinesses] = useState([
        { name: "Eco Weaves", owner: "Sita Devi", contact: "9876543210", description: "Handmade cotton textiles", location: "Pune" },
        { name: "Organic Delights", owner: "Radha Iyer", contact: "9123456780", description: "Homemade organic spices", location: "Mumbai" },
        { name: "Clay Creations", owner: "Meena Shah", contact: "9988776655", description: "Traditional terracotta pottery", location: "Nagpur" },
        { name: "Loom Magic", owner: "Anita Rao", contact: "9443322110", description: "Handloom silk sarees", location: "Nashik" }
    ]);
    const [loading, setLoading] = useState(false);
    const [statusText, setStatusText] = useState('');

    const fileInputRef = useRef(null);

    // Mock data for fallback search
    const mockNGOs = [
        { name: "Womenite", location: "New Delhi", contactPhone: "9717973658", website: "http://www.womenite.org" },
        { name: "Jagori", location: "New Delhi", contactPhone: "1126692700", email: "jagori@jagori.org", website: "https://www.jagori.org" },
        { name: "Azad Foundation", location: "Mumbai", contactPhone: "1140601878", email: "info@azadfoundation.com", website: "https://www.azadfoundation.com" },
        { name: "Udyogita, Sangli", location: "Sangli", contactPhone: "0233-2331122", email: "info@udyogita.org", website: "http://udyogita.org" },
        { name: "Sangli Mahila Bachat Gat", location: "Sangli", contactPhone: "0233-2331133", website: "http://sanglimahila.org" },
        { name: "Udyogita 2, Sangli", location: "Sangli", contactPhone: "0233-2331144", website: "http://udyogita.org" },
        { name: "Surajya Sarvangin Vikas Prakalp", location: "Pune", email: "info@surajyaprakalp.org", website: "http://surajyaprakalp.org" },
        { name: "Hope Pune", location: "Pune", contactPhone: "75884335", email: "hopepune2010@gmail.com", website: "http://www.hopepune.org" },
        { name: "MAVIM Pune", location: "Pune", contactPhone: "020-24330104", website: "http://mavimindia.org" }
    ];

    const handleFileChange = (e) => {
        if (e.target.files) {
            setPhotos(Array.from(e.target.files));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBusinessForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchClick = async (loc) => {
        const trimmedLoc = loc ? loc.trim() : '';
        if (!trimmedLoc) {
            setStatusText('Please enter a location to search.');
            return;
        }

        setLoading(true);
        setStatusText(`Searching for resources in ${trimmedLoc}...`);
        setShgs([]);
        setHasSearched(true);

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/shgs?location=${encodeURIComponent(trimmedLoc)}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const result = await response.json();

            if (result.success) {
                if (result.count === 0) {
                    setStatusText(`Showing suggestions for "${trimmedLoc}". Ensure backend is running.`);
                    const suggestions = mockNGOs.filter(n => n.location.toLowerCase().includes(trimmedLoc.toLowerCase()));
                    setShgs(suggestions.length > 0 ? suggestions : mockNGOs.slice(0, 3));
                } else {
                    setShgs(result.data);
                    setStatusText(`Found ${result.count} organizations near ${trimmedLoc}!`);
                }
            }
        } catch (error) {
            console.warn("Backend connection issue, using demo results:", error);
            setStatusText(`Note: Backend access to Port 5000 is unavailable. Showing demonstration results for "${trimmedLoc}".`);
            const suggestions = mockNGOs.filter(n => n.location.toLowerCase().includes(trimmedLoc.toLowerCase()));
            setShgs(suggestions.length > 0 ? suggestions : mockNGOs.slice(0, 3));
        } finally {
            setLoading(false);
        }
    };

    const renderHub = () => (
        <div className="hub-container big-hub animate-in">
            <div className="hub-card connect-hub big-card" onClick={() => setView('connect')}>
                <div className="hub-card-content">
                    <h2 className="hub-title-large">Connect</h2>
                    <div className="hub-icon-box black-bg large-box">
                        <img
                            src={connectIcon}
                            alt="Connect Icon"
                            style={{ width: '130px', height: '130px', objectFit: 'contain' }}
                        />
                    </div>
                    <button className="hub-pill-btn connect-pill">Connect</button>
                </div>
            </div>

            <div className="hub-card earn-hub big-card" onClick={() => setView('earn')}>
                <div className="hub-card-content">
                    <h2 className="hub-title-large earn-color">Earn</h2>
                    <div className="hub-icon-box yellow-bg large-box">
                        <img
                            src={earnIcon}
                            alt="Earn Icon"
                            style={{ width: '130px', height: '130px', objectFit: 'contain' }}
                        />
                    </div>
                    <button className="hub-pill-btn earn-pill">Earn</button>
                </div>
            </div>
        </div>
    );

    const renderConnect = () => (
        <div className="view-content animate-in">
            <div className="help-section-card small-scale">
                <h1 className="section-title">Help is Available</h1>

                <div className="help-cards-container">
                    <div className="help-card pink-card effect-card interactive-box shape-right pill-box-shape">
                        <h2 className="card-title">Number of<br />Counsellors</h2>
                        <div className="pill-list-refined">
                            <div className="data-pill yellow-pill" onClick={() => window.open('http://mavimindia.org', '_blank')}>
                                MAVIM (Pune): <strong>020-24330104</strong>
                            </div>
                            <div className="data-pill white-pill" onClick={() => window.open('http://samparc.org', '_blank')}>
                                SAMPARC: <strong>+91 9766343464</strong>
                            </div>
                            <div className="data-pill yellow-pill" onClick={() => window.open('http://mced.co.in', '_blank')}>
                                MCED (Pune): <strong>020-25656551</strong>
                            </div>
                            <div className="data-pill white-pill" onClick={() => window.open('http://ishanyafoundation.org', '_blank')}>
                                Ishanya Foundation: <strong>9371897988</strong>
                            </div>
                        </div>
                    </div>

                    <div className="help-card pink-card effect-card interactive-box shape-left pill-box-shape">
                        <h2 className="card-title">Government<br />Helplines</h2>
                        <div className="pill-list-refined">
                            <div className="data-pill white-pill">
                                <strong>181</strong> (Women Helpline)
                            </div>
                            <div className="data-pill yellow-pill">
                                <strong>14490</strong> (NCW Helpline)
                            </div>
                            <div className="data-pill white-pill multi-line-pill">
                                <strong>112</strong> (National Emergency Number)
                            </div>
                        </div>
                    </div>
                </div>

                <div className="find-nearest-section">
                    <h2 className="section-subtitle">Find nearest NGOs & SHGs</h2>
                    <div className="location-search-wrapper">
                        <div className="location-input-container main-search x-large smaller-input">
                            <span className="search-icon-left">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Enter your location"
                                className="location-input search-text"
                                value={connectLocation}
                                onChange={(e) => setConnectLocation(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearchClick(connectLocation)}
                            />
                            <span className="search-icon-right" onClick={() => handleSearchClick(connectLocation)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </span>
                        </div>
                    </div>
                    <div className="search-btn-wrapper">
                        <button className="search-shgs-pill-btn smaller-btn" onClick={() => handleSearchClick(connectLocation)} disabled={loading}>
                            {loading ? 'Searching...' : 'Search for nearest SHGS'}
                        </button>
                    </div>
                    {statusText && <p className="status-text">{statusText}</p>}
                </div>

                {hasSearched && (
                    <div className="ngo-list-container animate-in">
                        <p className="ngo-intro">Resource Directory</p>
                        <div className="ngo-list">
                            {shgs.length > 0 ? (
                                shgs.map((ngo, idx) => (
                                    <div key={idx} className="ngo-card ultra-compact hover-light-pink">
                                        <div className="ngo-info">
                                            <h3>{ngo.name}</h3>
                                            {ngo.contactPhone && <p><strong>Contact:</strong> {ngo.contactPhone}</p>}
                                            {ngo.email && <p><strong>Email:</strong> <a href={`mailto:${ngo.email}`} className="ngo-bold-email">{ngo.email}</a></p>}
                                        </div>
                                        <div className="ngo-actions">
                                            {ngo.website && (
                                                <button className="visit-btn outline-yellow-btn smaller-btn" onClick={() => window.open(ngo.website, '_blank')}>
                                                    Visit Website
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                !loading && <p className="no-results-msg">Searching...</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderEarn = () => (
        <div className="view-content animate-in">
            <div className="business-section-card">
                <h1 className="section-title text-center">Grow your business</h1>
                <div className="business-details-container">
                    <div className="business-grid-featured">
                        {businesses.slice(0, 3).map((biz, idx) => (
                            <div key={idx} className={`biz-card featured ${idx % 2 === 0 ? 'pink-bg' : 'yellow-bg'}-light`}>
                                <h3>{biz.name}</h3>
                                <div className="biz-photo-placeholder"><span>Image</span></div>
                                <p className="biz-desc">{biz.description}</p>
                                <p className="biz-owner">{biz.owner}</p>
                                <p className="biz-contact">{biz.contact}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="community-page">
            <div className="community-content">
                {view === 'hub' && renderHub()}
                {view === 'connect' && renderConnect()}
                {view === 'earn' && renderEarn()}
            </div>
            <div className="bottom-bar-gradient"></div>
        </div>
    );
}
