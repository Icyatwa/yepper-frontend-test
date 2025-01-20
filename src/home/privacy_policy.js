import React from 'react';
import Header from '../components/TermsPrivacyHeader';

const Privacy = () => {
  return (
    <div className="ad-waitlist min-h-screen bg-gradient-to-br from-white to-green-50">
      <Header />
      <div className="w-full max-w-4xl mx-auto mt-12 sm:mt-20 p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-950 mb-4">Privacy Policy</h1>
        
        <div className="space-y-4">
          <section className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5">
            <h2 className="text-lg sm:text-xl text-blue-950 font-bold mb-3">1. Information We Collect</h2>
            <ul className="space-y-3">
              <li className="flex flex-col sm:flex-row sm:items-center bg-white border border-gray-200 text-gray-600 rounded-lg p-3">
                <span className="text-blue-950 font-bold mb-1 sm:mb-0 sm:pr-5">From Web Owners</span>
                <span>Website details, pricing, space availability, and API integration data.</span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-center bg-white border border-gray-200 text-gray-600 rounded-lg p-3">
                <span className="text-blue-950 font-bold mb-1 sm:mb-0 sm:pr-5">From Advertisers</span>
                <span>Ad content, business information, payment details, and selected advertising preferences.</span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-center bg-white border border-gray-200 text-gray-600 rounded-lg p-3">
                <span className="text-blue-950 font-bold mb-1 sm:mb-0 sm:pr-5">Automatically</span>
                <span>Device information, IP address, and browsing behavior when accessing Yepper.</span>
              </li>
            </ul>
          </section>

          <section className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5">
            <h2 className="text-lg sm:text-xl text-blue-950 font-bold mb-3">2. How We Use Your Information</h2>
            <ul className="space-y-3">
              <li className="bg-white border border-gray-200 text-gray-600 rounded-lg p-3">
                To facilitate and manage the advertising process.
              </li>
              <li className="bg-white border border-gray-200 text-gray-600 rounded-lg p-3">
                To generate and maintain scripts for API integration.
              </li>
            </ul>
          </section>

          <section className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5">
            <h2 className="text-lg sm:text-xl text-blue-950 font-bold mb-3">3. Sharing of Information</h2>
            <ul className="space-y-3">
              <li className="flex flex-col sm:flex-row bg-white border border-gray-200 text-gray-600 rounded-lg p-3">
                <span className="text-blue-950 font-bold mb-1 sm:mb-0 sm:pr-5">With Web Owners</span>
                <span>Advertisers’ business details and ad content for review and approval.</span>
              </li>
              <li className="flex flex-col sm:flex-row bg-white border border-gray-200 text-gray-600 rounded-lg p-3">
                <span className="text-blue-950 font-bold mb-1 sm:mb-0 sm:pr-5">With Advertisers</span>
                <span>Approved Web Owner’s website details and space availability.</span>
              </li>
              <li className="flex flex-col sm:flex-row bg-white border border-gray-200 text-gray-600 rounded-lg p-3">
                <span className="text-blue-950 font-bold mb-1 sm:mb-0 sm:pr-5">With Third Parties</span>
                <span>Payment processors and service providers aiding in the platform’s operation.</span>
              </li>
            </ul>
          </section>

          <section className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5">
            <h2 className="text-lg sm:text-xl text-blue-950 font-bold mb-3">4. Data Security</h2>
            <ul className="space-y-3">
              <li className="bg-white border border-gray-200 text-gray-600 rounded-lg p-3">
                Yepper uses industry-standard encryption and security measures to protect your data.
              </li>
              <li className="bg-white border border-gray-200 text-gray-600 rounded-lg p-3">
                Users are responsible for maintaining the confidentiality of their account credentials.
              </li>
            </ul>
          </section>

          <section className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5">
            <h2 className="text-lg sm:text-xl text-blue-950 font-bold mb-3">5. User Rights</h2>
            <ul className="space-y-3">
              <li className="flex flex-col sm:flex-row sm:items-center bg-white border border-gray-200 text-gray-600 rounded-lg p-3">
                <span className="text-blue-950 font-bold mb-1 sm:mb-0 sm:pr-5">Access</span>
                <span>Request access to your personal data.</span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-center bg-white border border-gray-200 text-gray-600 rounded-lg p-3">
                <span className="text-blue-950 font-bold mb-1 sm:mb-0 sm:pr-5">Correction</span>
                <span>Update or correct your data.</span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-center bg-white border border-gray-200 text-gray-600 rounded-lg p-3">
                <span className="text-blue-950 font-bold mb-1 sm:mb-0 sm:pr-5">Deletion</span>
                <span>Request deletion of your account and data.</span>
              </li>
            </ul>
          </section>

          <section className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5">
            <h2 className="text-lg sm:text-xl text-blue-950 font-bold mb-3">6. Third-Party Links</h2>
            <ul className="space-y-3">
              <li className="bg-white border border-gray-200 text-gray-600 rounded-lg p-3">
                Our platform may contain links to external websites. Yepper is not responsible for the privacy practices or content of these external sites.
              </li>
            </ul>
          </section>

          <section className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5">
            <h2 className="text-lg sm:text-xl text-blue-950 font-bold mb-3">7. Changes to Privacy Policy</h2>
            <ul className="space-y-3">
              <li className="bg-white border border-gray-200 text-gray-600 rounded-lg p-3">
              Yepper reserves the right to update this Privacy Policy as needed to reflect changes in our practices or for legal reasons. Users will be notified of significant changes through email or platform notifications.
              </li>
            </ul>
          </section>

          <section className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5">
            <h2 className="text-lg sm:text-xl text-blue-950 font-bold mb-3">8. Contact Informatio</h2>
            <ul className="space-y-3">
              <li className="bg-white border border-gray-200 text-gray-600 rounded-lg p-3">
                For inquiries regarding this Privacy Policy, please contact us at
              </li>
              <a href="mailto:olympusexperts@gmail.com" className="text-blue-600 font-bold hover:underline block p-3">
                olympusexperts@gmail.com
              </a>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;