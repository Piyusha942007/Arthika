import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
    const [result, setResult] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        setResult("Sending message...");
        const formData = new FormData(event.target);

        // Append your Web3Forms Access Key
        formData.append("access_key", "f4440e2e-2871-4651-ae93-c0e988250f6f");

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            setResult("Thank you! We'll get back to you soon.");
            event.target.reset();
        } else {
            console.log("Error", data);
            setResult(data.message);
        }
    };

    return (
        <section className="contact-section" id="contact">
            <div className="contact-container">
                <div className="contact-info">
                    <h3 className="pink">Get in Touch</h3>
                    <p>
                        Have questions about your financial journey? Our team at
                        <strong> Arthika</strong> is here to support you.
                    </p>
                    <div className="contact-details">
                        <div className="detail-item">📍 Pune, Maharashtra</div>
                        <div className="detail-item">📧 teamspakonix@gmail.com</div>
                    </div>
                </div>

                <div className="contact-form-card">
                    <form onSubmit={onSubmit}>
                        {/* Honeypot Spam Protection */}
                        <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

                        <div className="input-group">
                            <label>Full Name</label>
                            <input type="text" name="name" placeholder="Enter your name" required />
                        </div>

                        <div className="input-group">
                            <label>Email Address</label>
                            <input type="email" name="email" placeholder="email@example.com" required />
                        </div>
                        <div className="input-group">
                            <label>Phone Number</label>
                            <input type="text" name="phone" placeholder="Enter your phone number" required />
                        </div>

                        <div className="input-group">
                            <label>Your Message</label>
                            <textarea name="message" rows="4" placeholder="How can we help you today?" required></textarea>
                        </div>

                        <button type="submit" className="submit-btn">Send Message</button>
                    </form>
                    <p className="form-status">{result}</p>
                </div>
            </div>
        </section>
    );
};

export default Contact;