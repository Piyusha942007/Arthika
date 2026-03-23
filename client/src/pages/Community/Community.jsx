import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import API_BASE_URL from '../../config/apiConfig';
import './Community.css';

// Import icons from local assets as requested
import connectIcon from '../../assets/images/image 2.png';
import earnIcon from '../../assets/images/image 1.png';

export default function Community() {
    const { user } = useUser();
    const [view, setView] = useState('hub'); // 'hub', 'connect', 'earn'
    const [connectLocation, setConnectLocation] = useState(''); // Separate location for Connect view
    const [businessForm, setBusinessForm] = useState({
        businessName: '',
        ownerName: '',
        contact: '',
        location: '',
        description: '',
        category: 'Other'
    });
    const [photo, setPhoto] = useState(null);
    const [shgs, setShgs] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [bizSearchTerm, setBizSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [locFilter, setLocFilter] = useState('All');
    const [commentText, setCommentText] = useState('');
    const [locLoading, setLocLoading] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [preview, setPreview] = useState(null);

    const fileInputRef = useRef(null);

    const fetchBusinesses = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/business`);
            if (res.data.success) {
                setBusinesses(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching businesses:", error);
        }
    };

    const setViewWithHistory = (newView) => {
        if (newView !== view) {
            window.history.pushState({ view: newView }, "");
            setView(newView);
        }
    };

    useEffect(() => {
        const handlePopState = (event) => {
            if (event.state && event.state.view) {
                setView(event.state.view);
            } else {
                setView('hub');
            }
        };

        window.history.replaceState({ view: 'hub' }, "");
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    useEffect(() => {
        if (view === 'earn') {
            fetchBusinesses();
        }
    }, [view]);

    const handleSubmitBusiness = async (e) => {
        e.preventDefault();
        
        if (!businessForm.businessName || !businessForm.ownerName || !businessForm.contact || !businessForm.location || !businessForm.description) {
            alert('Please fill out all the fields.');
            return;
        }

        if (!user || !user.id) {
            alert("You must be logged in to post a business!");
            return;
        }

        setSubmitting(true);
        const formData = new FormData();
        
        // Strict Camel Case logic via map and join
        const camelCaseName = businessForm.businessName.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase())
            .join(' ');

        formData.append('businessName', camelCaseName);
        formData.append('ownerName', businessForm.ownerName);
        formData.append('clerkId', user.id);
        formData.append('contact', businessForm.contact);
        formData.append('location', businessForm.location);
        formData.append('category', businessForm.category);
        formData.append('description', businessForm.description);
        
        if (photo) {
            formData.append('photo', photo);
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/api/business`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                alert('Business added successfully to the community!');
                setBusinessForm({ businessName: '', ownerName: '', contact: '', location: '', description: '', category: 'Other' });
                setPhoto(null);
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                fetchBusinesses(); // refresh the list
            }
        } catch (error) {
            console.error("Error creating business:", error);
            alert('Failed to add business. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePost = async (bizId, e) => {
        e.stopPropagation();
        if(!user || !user.id) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/business/${bizId}`, {
                data: { clerkId: user.id }
            });
            fetchBusinesses();
            if(selectedBusiness?._id === bizId) setSelectedBusiness(null);
        } catch (error) {
            console.error("Failed to delete post", error);
        }
    };

    const handlePostComment = async () => {
        if (!commentText.trim() || !selectedBusiness) return;
        const commentData = {
            clerkId: user?.id || '',
            userName: user?.fullName || 'Anonymous',
            userImage: user?.imageUrl || '',
            text: commentText
        };
        try {
            const res = await axios.post(`${API_BASE_URL}/api/business/${selectedBusiness._id}/comments`, commentData);
            if (res.data.success) {
                setSelectedBusiness(res.data.data); // Update modal live
                setCommentText('');
                fetchBusinesses(); // Keep background state fresh
            }
        } catch (error) {
            console.error("Failed to post comment", error);
        }
    };

    const handleDeleteComment = async (bizId, commentId) => {
        if(!user || !user.id) return;
        try {
            const res = await axios.delete(`${API_BASE_URL}/api/business/${bizId}/comments/${commentId}`, {
                data: { clerkId: user.id }
            });
            if (res.data.success) {
                setSelectedBusiness(res.data.data);
                fetchBusinesses();
            }
        } catch (error) {
            console.error("Failed to delete comment", error);
        }
    };

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
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removePhoto = () => {
        setPhoto(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handlePhoneChange = (e) => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 10);
        if(val.startsWith('91') && val.length > 2) val = val.substring(2);
        setBusinessForm(prev => ({...prev, contact: val.length > 0 ? "+91 " + val : ""}));
    };

    const getLocation = () => {
        setLocLoading(true);
        navigator.geolocation.getCurrentPosition((pos) => {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
                .then(res => res.json())
                .then(data => {
                    const city = data.address.city || data.address.town || data.address.village || data.address.state || "Unknown Area";
                    setBusinessForm(prev => ({...prev, location: city}));
                    setLocLoading(false);
                })
                .catch(() => setLocLoading(false));
        }, () => setLocLoading(false));
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
            const response = await fetch(`${API_BASE_URL}/api/shgs?location=${encodeURIComponent(trimmedLoc)}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const result = await response.json();

            if (result.success) {
                if (result.count === 0) {
                    setStatusText(`Showing recommended organizations near "${trimmedLoc}".`);
                    const suggestions = mockNGOs.filter(n => n.location.toLowerCase().includes(trimmedLoc.toLowerCase()));
                    setShgs(suggestions.length > 0 ? suggestions : mockNGOs.slice(0, 3));
                } else {
                    setShgs(result.data);
                    setStatusText(`Found ${result.count} organizations near ${trimmedLoc}!`);
                }
            }
        } catch (error) {
            console.warn("Backend connection issue, using demo results:", error);
            setStatusText(`Showing recommended organizations near "${trimmedLoc}".`);
            const suggestions = mockNGOs.filter(n => n.location.toLowerCase().includes(trimmedLoc.toLowerCase()));
            setShgs(suggestions.length > 0 ? suggestions : mockNGOs.slice(0, 3));
        } finally {
            setLoading(false);
        }
    };

    const renderHub = () => (
        <div className="hub-container big-hub animate-in">
            <div className="hub-card connect-hub big-card" onClick={() => setViewWithHistory('connect')}>
                <div className="hub-card-content" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 className="hub-title-large">Connect</h2>
                    <div className="hub-icon-box large-box">
                        <img
                            src={connectIcon}
                            alt="Connect Icon"
                            style={{ width: '150px', height: '150px', objectFit: 'contain' }}
                        />
                    </div>
                    <button className="hub-pill-btn connect-pill">Connect</button>
                </div>
            </div>

            <div className="hub-card earn-hub big-card" onClick={() => setViewWithHistory('earn')}>
                <div className="hub-card-content" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 className="hub-title-large">Expand</h2>
                    <div className="hub-icon-box large-box">
                        <img
                            src={earnIcon}
                            alt="Earn Icon"
                            style={{ width: '150px', height: '150px', objectFit: 'contain' }}
                        />
                    </div>
                    <button className="hub-pill-btn earn-pill">Earn</button>
                </div>
            </div>
        </div>
    );

    const renderConnect = () => (
        <div className="view-content animate-in">
            <button 
                onClick={() => window.history.back()} 
                style={{ marginBottom: '20px', background: '#000', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}
            >
                ← Back to Community Hub
            </button>
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

    const renderEarn = () => {
        let filteredBusinesses = businesses.filter(b => 
            (b.businessName || "").toLowerCase().includes(bizSearchTerm.toLowerCase()) || 
            (b.location || "").toLowerCase().includes(bizSearchTerm.toLowerCase())
        );

        if (categoryFilter !== 'All') {
            filteredBusinesses = filteredBusinesses.filter(b => b.category === categoryFilter);
        }
        
        if (locFilter !== 'All') {
            filteredBusinesses = filteredBusinesses.filter(b => b.location && b.location.toLowerCase() === locFilter.toLowerCase());
        }

        // Get unique locations for the dropdown
        const uniqueLocations = Array.from(new Set(businesses.map(b => b.location).filter(Boolean)));

        return (
        <div className="view-content animate-in earn-view-container" style={{ paddingBottom: '100px' }}>
            <button 
                onClick={() => window.history.back()} 
                style={{ marginBottom: '20px', background: '#000', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}
            >
                ← Back to Community Hub
            </button>
            <h1 className="section-title text-center" style={{ marginBottom: '20px', fontSize: '36px' }}>Want to grow your business?</h1>
            
            <div className="glassmorphism-card">
                <h2 className="text-center" style={{ marginBottom: '20px', fontSize: '24px' }}>Business Details</h2>
                <form onSubmit={handleSubmitBusiness} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input type="text" name="businessName" placeholder="Enter business name" value={businessForm.businessName} onChange={handleInputChange} style={{ width: '100%', padding: '12px 20px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none', textTransform: 'capitalize' }} required />
                    <input type="text" name="ownerName" placeholder="Enter your name" value={businessForm.ownerName} onChange={handleInputChange} style={{ width: '100%', padding: '12px 20px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none' }} required />
                    <input type="text" name="contact" placeholder="Enter your contact (10 digits)" value={businessForm.contact} onChange={handlePhoneChange} style={{ width: '100%', padding: '12px 20px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none' }} required />
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" name="location" placeholder="Click '📍 Location' to fetch" value={businessForm.location} onChange={handleInputChange} style={{ flex: 1, padding: '12px 20px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none', background: '#f5f5f5', cursor: 'not-allowed' }} readOnly required />
                        <button type="button" className="geo-btn" onClick={getLocation} disabled={locLoading}>
                            {locLoading ? '📍 Locating...' : '📍 Location'}
                        </button>
                    </div>

                    <select name="category" value={businessForm.category} onChange={handleInputChange} style={{ width: '100%', padding: '12px 20px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none' }}>
                        <option value="Health">Health</option>
                        <option value="Education">Education</option>
                        <option value="Food">Food</option>
                        <option value="Handicrafts">Handicrafts</option>
                        <option value="Finance">Finance</option>
                        <option value="Other">Other</option>
                    </select>

                    <textarea name="description" placeholder="Enter description of your business" value={businessForm.description} onChange={handleInputChange} rows="3" style={{ width: '100%', padding: '12px 20px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none', resize: 'vertical' }} required></textarea>
                    
                    <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
                        <p style={{ margin: 0, fontSize: '16px', color: '#555', fontWeight: '600' }}>Drop photos here or click to upload</p>
                        <div style={{ background: '#FFCC4D', borderRadius: '20px', padding: '5px 15px', display: 'inline-block', marginTop: '10px', fontWeight: 'bold', fontSize: '14px', color: '#000' }}>choose file</div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
                        
                        {preview && (
                            <div className="preview-container" onClick={e => e.stopPropagation()}>
                                <div className="preview-wrapper">
                                    <img src={preview} alt="preview" className="preview-thumb" />
                                    <button type="button" className="remove-thumb-btn" onClick={removePhoto}>X</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={submitting} className="submit-btn-gradient">
                        {submitting ? 'Uploading...' : 'Submit Business'}
                    </button>
                </form>
            </div>

            <div className="community-grid-section">
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '32px', marginBottom: '5px' }}>Our Community</h2>
                    <p style={{ fontSize: '16px', color: '#333', fontWeight: 'bold' }}>join now by uploading your business</p>
                </div>
                
                <div className="biz-search-row" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input type="text" placeholder="Search business" value={bizSearchTerm} onChange={(e) => setBizSearchTerm(e.target.value)} style={{ padding: '10px 20px', borderRadius: '20px', border: '1px solid #ccc', outline: 'none', width: '250px', maxWidth: '100%' }} />
                    
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ padding: '10px 20px', borderRadius: '20px', border: '1px solid #ccc', outline: 'none' }}>
                        <option value="All">All Categories</option>
                        <option value="Health">Health</option>
                        <option value="Education">Education</option>
                        <option value="Food">Food</option>
                        <option value="Handicrafts">Handicrafts</option>
                        <option value="Finance">Finance</option>
                        <option value="Other">Other</option>
                    </select>

                    <select value={locFilter} onChange={(e) => setLocFilter(e.target.value)} style={{ padding: '10px 20px', borderRadius: '20px', border: '1px solid #ccc', outline: 'none' }}>
                        <option value="All">All Locations</option>
                        {uniqueLocations.map((loc, idx) => (
                            <option key={idx} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>

                <div className="community-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                    {filteredBusinesses.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '20px', border: '2px dashed #FFCC4D' }}>
                            <h3 style={{ fontSize: '24px', color: '#000', marginBottom: '10px' }}>Be the first to grow your business here!</h3>
                            <p style={{ color: '#666', fontSize: '16px' }}>Upload your photos and details above to feature heavily across the local community.</p>
                        </div>
                    ) : (
                        filteredBusinesses.map((biz) => (
                            <div key={biz._id} className="biz-card" onClick={() => setSelectedBusiness(biz)} style={{position: 'relative'}}>
                                {user && biz.clerkId === user.id && (
                                    <button className="delete-btn" onClick={(e) => handleDeletePost(biz._id, e)} style={{position: 'absolute', top: '10px', right: '10px', zIndex: 10, padding: '8px 12px'}}>🗑️ Delete</button>
                                )}
                                <div className="biz-card-header">{biz.businessName}</div>
                                {biz.imageUrl ? (
                                    <img src={biz.imageUrl} alt="business" className="biz-card-image" />
                                ) : (
                                    <div className="biz-card-image" style={{ background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ color: '#aaa' }}>No image</span>
                                    </div>
                                )}
                                <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <p style={{ fontSize: '15px', marginBottom: '10px', color: '#444', flexGrow: 1 }}>{biz.description}</p>
                                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}><strong>Owner:</strong> {biz.ownerName}</p>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <span style={{ background: '#000', color: '#fff', padding: '8px 30px', borderRadius: '20px', fontSize: '15px', fontWeight: 'bold' }}>Contact</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {selectedBusiness && (
                <div className="modal-overlay" onClick={() => setSelectedBusiness(null)}>
                    <div className="modal-container" onClick={e => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setSelectedBusiness(null)}>✕</button>
                        
                        <img src={selectedBusiness.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image'} alt="business" className="modal-left-img" />
                        
                        <div className="modal-right-content">
                            <h2>{selectedBusiness.businessName}</h2>
                            <p className="modal-owner">Owned by {selectedBusiness.ownerName} • 📍 {selectedBusiness.location} | {selectedBusiness.category || 'Other'}</p>
                            
                            <p className="modal-desc">{selectedBusiness.description}</p>
                            
                            <button className="modal-contact-btn">📞 {selectedBusiness.contact}</button>
                            
                            <div className="comments-section">
                                <h3>Community Comments ({selectedBusiness.comments ? selectedBusiness.comments.length : 0})</h3>
                                <div className="comment-input-area">
                                    <input type="text" placeholder="Write a comment..." value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handlePostComment()} />
                                    <button onClick={handlePostComment}>Post</button>
                                </div>
                                
                                <div className="comments-scroll-area">
                                    {selectedBusiness.comments && selectedBusiness.comments.slice().reverse().map((c, i) => (
                                        <div key={i} className="mock-comment" style={{ display: 'flex', gap: '10px', alignItems: 'center', position: 'relative' }}>
                                            {c.userImage ? <img src={c.userImage} alt="" style={{ width: '30px', height: '30px', borderRadius: '50%' }} /> : <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#ccc' }}></div>}
                                            <div style={{ flex: 1 }}>
                                                <strong>{c.userName}</strong>
                                                <span style={{color: '#333', display: 'block'}}>{c.text}</span>
                                            </div>
                                            {user && c.clerkId === user.id && (
                                                <button onClick={() => handleDeleteComment(selectedBusiness._id, c._id)} style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', padding: '5px' }}>
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        );
    };

    return (
        <div className="community-page">
            <div className="community-content">
                {view === 'hub' && renderHub()}
                {view === 'connect' && renderConnect()}
                {view === 'earn' && renderEarn()}
            </div>
        </div>
    );
}
