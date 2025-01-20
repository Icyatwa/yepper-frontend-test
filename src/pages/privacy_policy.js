// PrivacyPolicy.js
import React from 'react';
import './LegalPages.css';
import Header from './TermsPrivacyHeader';

function PrivacyPolicy() {
  return (
    <div className="privacy-page legal-page">
      <Header />
      <div className="privacy-container legal-container">
        <h1 className="privacy-title">Privacy Policy</h1>
        <p className="privacy-subtitle">Effective Date: October 30, 2024</p>
        
        <div className="privacy-point">
          <h2 className="privacy-heading">1. Information Collection</h2>
          <ul className="styled-list">
            <li>
              Yepper collects personal information when users register, including name, email, and payment details, to provide and enhance our services. Non-personal data, such as browsing behavior, is also collected for platform optimization.
            </li>
          </ul>
        </div>
        
        <div className="privacy-point">
          <h2 className="privacy-heading">2. Use of Information</h2>
          <ul className="styled-list">
            <li>
              Personal information is used solely for the purpose of operating and maintaining user accounts, processing payments, and supporting user inquiries.
            </li>
            <li>
              We may use anonymized data to improve our platform functionality and offer better services.
            </li>
          </ul>
        </div>

        <div className="privacy-point">
          <h2 className="privacy-heading">3. Sharing of Information</h2>
          <ul className="styled-list">
            <li>
              Yepper does not sell, trade, or share personal information with third parties without user consent, except for necessary service providers (e.g., payment processors) and in compliance with legal obligations.
            </li>
            <li>
              Third-party services utilized by Yepper, such as Flutterwave, have their own privacy policies governing the handling of personal data.
            </li>
          </ul>
        </div>

        <div className="privacy-point">
          <h2 className="privacy-heading">4. Data Security</h2>
          <ul className="styled-list">
            <li>
              We implement reasonable security measures to protect your personal information against unauthorized access. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
            </li>
          </ul>
        </div>

        <div className="privacy-point">
          <h2 className="privacy-heading">5. User Rights</h2>
          <ul className="styled-list">
            <li>
              Users have the right to access, update, or delete their personal information at any time by contacting olympusexperts@gmail.com
            </li>
            <li>
              Users can also withdraw consent for processing their data, though this may affect service availability.
            </li>
          </ul>
        </div>

        <div className="privacy-point">
          <h2 className="privacy-heading">6. Third-Party Links</h2>
          <ul className="styled-list">
            <li>
              Our platform may contain links to external websites. Yepper is not responsible for the privacy practices or content of these external sites.
            </li>
          </ul>
        </div>

        <div className="privacy-point">
          <h2 className="privacy-heading">7. Changes to Privacy Policy</h2>
          <ul className="styled-list">
            <li>
              Yepper reserves the right to update this Privacy Policy as needed to reflect changes in our practices or for legal reasons. Users will be notified of significant changes through email or platform notifications.
            </li>
          </ul>
        </div>
        
        <div className="privacy-point">
          <h2 className="privacy-heading">8. Contact Information</h2>
          <ul className="styled-list">
            <li>
              For inquiries regarding this Privacy Policy, please contact us at
            </li>
            <a href="mailto:olympusexperts@gmail.com" className="terms-link">olympusexperts@gmail.com</a>.
          </ul>
        </div>
      </div>
    </div>
  );
}


export default PrivacyPolicy;