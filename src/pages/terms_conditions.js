// TermsAndConditions.js
import React from 'react';
import './LegalPages.css';
import Header from './TermsPrivacyHeader';

function TermsAndConditions() {
  return (
    <div className="terms-page legal-page">
      <Header />
      <div className="terms-container legal-container">
        <h1 className="terms-title">Terms and Conditions</h1>
        <p className="terms-subtitle">Effective Date: October 30, 2024</p>
        
        <div className="terms-point">
          <h2 className="terms-heading">1. Acceptance of Terms</h2>
          <ul className="styled-list">
            <li>
              By accessing or using Yepper, you agree to comply with these Terms and Conditions.
            </li>
          </ul>
        </div>
        
        <div className="terms-point">
          <h2 className="terms-heading">2. Services Provided</h2>
          <ul className="styled-list">
            <li>
              Yepper is an online advertising management platform that connects website owners and advertisers. The platform provides features such as ad space setup, category selection, ad placement, and approval and payment processes.
            </li>
          </ul>
        </div>

        <div className="terms-point">
          <h2 className="terms-heading">3. User Accounts</h2>
          <ul className="styled-list">
            <li>
              Users are required to register and provide accurate information for account creation.
            </li>
            <li>
              Each user is responsible for safeguarding their account information and is prohibited from sharing their login credentials.
            </li>
            <li>
              Yepper reserves the right to suspend or terminate accounts that are found to be in violation of these Terms.
            </li>
          </ul>
        </div>

        <div className="terms-point">
          <h2 className="terms-heading">4. Payment Terms</h2>
          <ul className="styled-list">
            <li>
              Advertisers are required to pay for ad space based on selected durations and placements.
            </li>
            <li>
              All payments are processed through Flutterwave and are subject to the payment processor's terms.
            </li>
          </ul>
        </div>

        <div className="terms-point">
          <h2 className="terms-heading">5. Refund and Cancellation Policy</h2>
          <ul className="styled-list">
            <li>
              Advertisers may cancel ad placements, subject to refund policies detailed in the payment terms.
            </li>
            <li>
              Refunds may be issued at the discretion of Yepper, subject to investigation and review.
            </li>
          </ul>
        </div>

        <div className="terms-point">
          <h2 className="terms-heading">6. Disclaimer of Warranties</h2>
          <ul className="styled-list">
            <li>
              Yepper provides its platform on an "as-is" basis, without warranties of any kind, either express or implied. We do not guarantee uninterrupted, error-free service and are not responsible for any damages arising from the use of Yepper.
            </li>
          </ul>
        </div>

        <div className="terms-point">
          <h2 className="terms-heading">7. Limitation of Liability</h2>
          <ul className="styled-list">
            <li>
              Yepper is not liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the platform, including lost profits or revenue.
            </li>
          </ul>
        </div>

        <div className="terms-point">
          <h2 className="terms-heading">8. Amendments</h2>
          <ul className="styled-list">
            <li>
              Yepper reserves the right to modify these Terms and Conditions at any time. Users will be notified of significant changes, and continued use of the platform after such modifications signifies acceptance of the revised terms.
            </li>
          </ul>
        </div>

        <div className="terms-point">
          <h2 className="terms-heading">10. Contact Information</h2>
          <ul className="styled-list">
            <li>
              For any questions or concerns regarding these Terms, please contact us at 
            </li>
            <a href="mailto:olympusexperts@gmail.com" className="terms-link">olympusexperts@gmail.com</a>.
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;