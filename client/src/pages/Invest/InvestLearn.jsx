import React from "react";
import "./InvestLearn.css";

// Importing your assets
import beti from "../../assets/images/beti.png";
import rastriya from "../../assets/images/rastriya.png";
import pradhan from "../../assets/images/pradhan.png";
import hdfc from "../../assets/images/hdfc.png";
import sbi from "../../assets/images/sbi.png";
import bank from "../../assets/images/bank.png";

export default function InvestLearn() {
  return (
    <div className="learn-page-container">
      {/* MAIN CONTENT */}
      <main className="learn-content-wrapper">
        <h1 className="main-headline">
          Discover Government Schemes & Bank Benefits
        </h1>

        {/* TOP ROW: GOVT SCHEMES */}
        <div className="schemes-row">
          <div className="scheme-box">
            <img src={beti} alt="Beti Bachao" className="scheme-img" />
          </div>
          <div className="scheme-box">
            <img src={rastriya} alt="Rastriya Mahila" className="scheme-img" />
          </div>
          <div className="scheme-box">
            <img src={pradhan} alt="Pradhan Mantri" className="scheme-img" />
          </div>
        </div>

        {/* BANK SECTIONS */}
        <div className="bank-sections-list">
          
          {/* HDFC SECTION */}
          <div className="bank-card-long">
            <ul className="benefit-bullets">
              <li>Cash allowance for every day of hospitalization due to an accident.</li>
              <li>Lower interest rates on two-wheeler and auto loans.</li>
            </ul>
            <div className="bank-logo-container">
              <img src={hdfc} alt="HDFC Bank" className="bank-brand-img" />
            </div>
          </div>

          {/* SBI SECTION (REVERSED LAYOUT) */}
          <div className="bank-card-long reversed">
            <div className="bank-logo-container">
              <img src={sbi} alt="SBI" className="bank-brand-img" />
            </div>
            <ul className="benefit-bullets">
              <li>Lowered interest rates (0.5% concession) for businesses where women own more than 50%.</li>
              <li>No security/collateral required for loans up to ₹5 Lakh</li>
            </ul>
          </div>

          {/* BANK OF BARODA SECTION */}
          <div className="bank-card-long">
            <ul className="benefit-bullets">
              <li>Collateral-free loans up to ₹5 Lakh for women entrepreneurs.</li>
              <li>No processing fees for loans up to ₹6 Lakh for Self-Help Groups (SHGs)</li>
            </ul>
            <div className="bank-logo-container">
              <img src={bank} alt="Bank of Baroda" className="bank-brand-img" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}