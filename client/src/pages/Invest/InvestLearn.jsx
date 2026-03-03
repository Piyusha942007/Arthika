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
          <a href="https://www.pmindia.gov.in/hi/government_tr_rec/%E0%A4%AC%E0%A5%87%E0%A4%9F%E0%A5%80-%E0%A4%AC%E0%A4%9A%E0%A4%BE%E0%A4%93-%E0%A4%AC%E0%A5%87%E0%A4%9F%E0%A5%80-%E0%A4%AA%E0%A4%A2%E0%A4%BC%E0%A4%BE%E0%A4%93-%E0%A4%AC%E0%A4%BE%E0%A4%B2/" target="_blank" rel="noreferrer" className="scheme-box">
            <img src={beti} alt="Beti Bachao" className="scheme-img" />
          </a>

          <a href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=1742800&reg=3&lang=2" target="_blank" rel="noreferrer" className="scheme-box">
            <img src={rastriya} alt="Rastriya Mahila" className="scheme-img" />
          </a>

          <a href="https://wcd.delhi.gov.in/wcd/pradhan-mantri-matru-vandana-yojana-pmmvy" target="_blank" rel="noreferrer" className="scheme-box">
            <img src={pradhan} alt="Pradhan Mantri" className="scheme-img" />
          </a>
        </div>

        {/* BANK SECTIONS */}
        <div className="bank-sections-list">
          
          {/* HDFC SECTION */}
          <a href="https://www.hdfc.bank.in/savings-account/women-savings-account" target="_blank" rel="noreferrer" className="bank-card-long">
            <ul className="benefit-bullets">
              <li>Cash allowance for every day of hospitalization due to an accident.</li>
              <li>Lower interest rates on two-wheeler and auto loans.</li>
            </ul>
            <div className="bank-logo-container">
              <img src={hdfc} alt="HDFC Bank" className="bank-brand-img" />
            </div>
          </a>

          {/* SBI SECTION (REVERSED LAYOUT) */}
          <a href="https://sbi.bank.in/web/business/sme/sme-loans/sme-loan-to-women-entrepreneur-sbi-asmita" target="_blank" rel="noreferrer" className="bank-card-long reversed">
            <div className="bank-logo-container">
              <img src={sbi} alt="SBI" className="bank-brand-img" />
            </div>
            <ul className="benefit-bullets">
              <li>Lowered interest rates (0.5% concession) for businesses where women own more than 50%.</li>
              <li>No security/collateral required for loans up to ₹5 Lakh</li>
            </ul>
          </a>

          {/* BANK OF BARODA SECTION */}
          <a href="https://bankofbaroda.bank.in/accounts/saving-accounts/bob-mahila-shakti-saving-account" target="_blank" rel="noreferrer" className="bank-card-long">
            <ul className="benefit-bullets">
              <li>Collateral-free loans up to ₹5 Lakh for women entrepreneurs.</li>
              <li>No processing fees for loans up to ₹6 Lakh for Self-Help Groups (SHGs)</li>
            </ul>
            <div className="bank-logo-container">
              <img src={bank} alt="Bank of Baroda" className="bank-brand-img" />
            </div>
          </a>

        </div>
      </main>
    </div>
  );
}