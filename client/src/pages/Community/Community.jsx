import React, { useState, useRef } from 'react';
import './Community.css';

export default function Community() {
    const [location, setLocation] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [photos, setPhotos] = useState([]);
    const [shgs, setShgs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusText, setStatusText] = useState('');

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setPhotos(Array.from(e.target.files));
        }
    };

    const handleSearchClick = async () => {
        if (!location) {
            setStatusText('Please enter a location to search.');
            return;
        }

        setLoading(true);
        setStatusText('Searching for SHGs...');
        setShgs([]);

        try {
            // 1. Search for SHGs by Location
            const shgRes = await fetch(`http://localhost:8000/api/shgs?location=${location}`);
            const shgData = await shgRes.json();

            if (shgData.success) {
                setShgs(shgData.data);
                if (shgData.data.length === 0) {
                    setStatusText(`No SHGs found near ${location}. Showing default suggestions instead.`);
                    // Fallback mock data if none in DB
                    setShgs([
                        { name: "Mahila Shakti SHG", focusArea: "Handicrafts", contactPhone: "9876543210" },
                        { name: "Gramin Vikas Group", focusArea: "Agriculture", contactPhone: "9123456780" }
                    ]);
                } else {
                    setStatusText(`Found ${shgData.count} SHGs near ${location}!`);
                }
            } else {
                setStatusText(`Server returned an error: ${shgData.message || 'Unknown Error'}`);
            }

            // 2. If they provided a business name, register it automatically
            if (businessName) {
                const formData = new FormData();
                formData.append('businessName', businessName);
                formData.append('location', location);
                photos.forEach(photo => formData.append('photos', photo));

                await fetch('http://localhost:8000/api/business', {
                    method: 'POST',
                    body: formData,
                });
                console.log("Business details automatically submitted.");
            }

        } catch (error) {
            console.error("Error searching SHGs:", error);
            setStatusText('Error connecting to the server. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="community-page">
            <div className="community-content">

                {/* Section 1: Help is Available */}
                <div className="help-section-card">
                    <h1 className="section-title">Help is Available</h1>

                    <div className="help-cards-container">
                        <div className="help-card pink-card">
                            <h2 className="card-title">Number of<br />Counsellors</h2>
                            <div className="pill-list">
                                <div className="pill yellow-pill">9371897988</div>
                                <div className="pill white-pill border-pink">9371897988</div>
                                <div className="pill yellow-pill">9371897988</div>
                                <div className="pill white-pill border-pink">9371897988</div>
                            </div>
                        </div>

                        <div className="help-card pink-card">
                            <h2 className="card-title">Government<br />Helplines</h2>
                            <div className="pill-list">
                                <div className="pill white-pill border-pink">181 (Women Helpline)</div>
                                <div className="pill yellow-pill border-yellow">14490 (NCW Helpline)</div>
                                <div className="pill white-pill border-pink large-pill">112 (National Emergency Number)</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Want to grow your business? */}
                <div className="business-section-card">
                    <h1 className="section-title">Want to grow your business?</h1>

                    <div className="location-search-wrapper">
                        <div className="location-input-container">
                            <span className="icon geo-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Enter your location"
                                className="location-input"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                            <span className="icon search-icon" style={{ cursor: 'pointer' }} onClick={handleSearchClick}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </span>
                        </div>
                    </div>

                    <div className="business-details-container">
                        <div className="business-details-card">
                            <h2 className="business-card-title">Business Details</h2>

                            <input
                                type="text"
                                placeholder="enter business name"
                                className="business-name-input"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                            />

                            <div className="upload-area">
                                <div className="upload-icon">
                                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="19" x2="12" y2="5"></line>
                                        <polyline points="5 12 12 5 19 12"></polyline>
                                    </svg>
                                </div>
                                <p className="upload-text">Upload photos or drag & drop</p>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                <button className="choose-files-btn" onClick={() => fileInputRef.current?.click()}>
                                    {photos.length > 0 ? `${photos.length} files chosen` : 'choose files'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="search-btn-wrapper">
                        <button className="search-shg-btn" onClick={handleSearchClick} disabled={loading}>
                            {loading ? 'Searching...' : 'Search for nearest SHGS'}
                        </button>
                    </div>

                    {/* Display Results */}
                    {statusText && (
                        <p style={{ textAlign: 'center', marginTop: '15px', fontWeight: 'bold' }}>{statusText}</p>
                    )}

                    {shgs.length > 0 && (
                        <div className="shg-results" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                            {shgs.map((shg, idx) => (
                                <div key={idx} style={{ background: 'white', padding: '15px', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                    <h3 style={{ margin: '0 0 5px 0' }}>{shg.name}</h3>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Focus: {shg.focusArea}</p>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Contact: {shg.contactPhone}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
            {/* Bottom Graphic element */}
            <div className="bottom-gradient-bar"></div>
        </div>
    );
}
