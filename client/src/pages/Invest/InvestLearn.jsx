import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from 'axios';
import "./InvestLearn.css";

// Importing your assets
import beti from "../../assets/images/beti.png";
import rastriya from "../../assets/images/rastriya.png";
import pradhan from "../../assets/images/pradhan.png";
import hdfc from "../../assets/images/hdfc.png";
import sbi from "../../assets/images/sbi.png";
import bank from "../../assets/images/bank.png";

const ALL_SCHEMES = [
  {
    title: "NaMo Drone Didi",
    category: "Small Livelihood", 
    interest: "100% Subsidy",
    description: "Empowering women SHGs with drones for agricultural uses.",
    link: "https://www.india.gov.in/",
    icon: beti
  },
  {
    title: "Lakhpati Didi",
    category: "Savings", 
    interest: "Financial Independence",
    description: "Aimed at helping rural women earn at least Rs 1 lakh annually.",
    link: "https://www.india.gov.in/",
    icon: rastriya
  },
  {
    title: "Mudra Shishu",
    category: "Small Livelihood", 
    interest: "Up to ₹50,000",
    description: "Micro-credit for starting very small businesses without collateral.",
    link: "https://www.mudra.org.in/",
    icon: pradhan
  },
  {
    title: "Maji Ladki Bahin",
    category: "Safety", 
    interest: "Monthly Stipend",
    description: "Financial assistance provided to eligible women in Maharashtra.",
    link: "https://ladkibahin.maharashtra.gov.in/",
    icon: beti
  },
  {
    title: "Stand-Up India",
    category: "Enterprise", 
    interest: "₹10L - ₹1Cr Loans",
    description: "Facilitating bank loans for greenfield enterprises.",
    link: "https://www.standupmitra.in/",
    icon: hdfc
  },
  {
    title: "Mudra Tarun Plus",
    category: "Expansion", 
    interest: "₹5L - ₹10L Loans",
    description: "Credit targeted specifically at expanding an existing business.",
    link: "https://www.mudra.org.in/",
    icon: sbi
  },
  {
    title: "Stree Shakti",
    category: "Enterprise", 
    interest: "Lower Interest Rate",
    description: "Supports women entrepreneurs who have majority ownership.",
    link: "https://sbi.co.in/",
    icon: sbi
  },
  {
    title: "Mahila Samman Saving",
    category: "Tax Saving", 
    interest: "7.5% p.a.",
    description: "A one-time small savings scheme for adult women/girls.",
    link: "https://www.indiapost.gov.in/",
    icon: bank
  },
  {
    title: "Sukanya Samriddhi",
    category: "Savings", 
    interest: "8.2% p.a.",
    description: "Deposit scheme for the girl child reflecting high interest and tax benefits.",
    link: "https://www.indiapost.gov.in/",
    icon: beti
  }
];

export default function InvestLearn() {
  const { user } = useUser();
  const [persona, setPersona] = useState("Housewife");
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    if (!userEmail) return;
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/profile/${userEmail}`);
        if (res.data) {
          if (res.data.role) {
             setPersona(res.data.role);
          } else if (res.data.persona) {
             setPersona(res.data.persona);
          }
        }
      } catch (err) {
        console.error("No profile found", err);
      }
    };
    fetchProfile();
  }, [userEmail]);

  // Priority algorithm
  const getSortedSchemes = () => {
    const housewifeTags = ["Savings", "Safety", "Small Livelihood"];
    const workingTags = ["Enterprise", "Expansion", "Tax Saving"];
    
    // Create copy to sort
    let sorted = [...ALL_SCHEMES];
    
    sorted.sort((a, b) => {
       const isAHousewife = housewifeTags.includes(a.category);
       const isBHousewife = housewifeTags.includes(b.category);
       
       const isAWorking = workingTags.includes(a.category);
       const isBWorking = workingTags.includes(b.category);
       
       if (persona === 'Housewife') {
           if (isAHousewife && !isBHousewife) return -1;
           if (!isAHousewife && isBHousewife) return 1;
       } else { // Working
           if (isAWorking && !isBWorking) return -1;
           if (!isAWorking && isBWorking) return 1;
       }
       return 0;
    });

    return sorted;
  };

  const displayedSchemes = getSortedSchemes();

  return (
    <div className="learn-page-container">
      <main className="learn-content-wrapper">
        <div style={{textAlign: 'center', marginBottom: '40px'}}>
           <h1 className="main-headline" style={{marginBottom: '10px'}}>
             Discover Government Schemes
           </h1>
           <p style={{fontSize: '1.2rem', color: '#555', fontWeight: '500'}}>
             Curated specifically for your profile: <strong style={{color: '#D81B60', padding: '4px 10px', background: '#FFF0F5', borderRadius: '15px'}}>{persona}</strong>
           </p>
        </div>

        <div className="schemes-grid">
          {displayedSchemes.map((scheme, idx) => (
             <div className="scheme-card-new" key={idx}>
                <div className="scheme-card-header">
                   <img src={scheme.icon} alt={scheme.title} className="scheme-card-icon" />
                   <span className="scheme-badge">{scheme.interest}</span>
                </div>
                <h3 className="scheme-card-title">{scheme.title}</h3>
                <span className="scheme-category-tag">{scheme.category}</span>
                <p className="scheme-card-desc">{scheme.description}</p>
                <a href={scheme.link} target="_blank" rel="noreferrer" className="scheme-apply-btn">
                   Read More & Apply
                </a>
             </div>
          ))}
        </div>
        
      </main>
    </div>
  );
}