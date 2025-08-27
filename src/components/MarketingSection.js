// src/components/MarketingSection.js
import React from 'react';
import { Button } from './components';
import { ArrowLeft, Check, TrendingUp, Hand } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const MarketingSection = ({ onGoBack }) => {
  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header with a back button */}
      <div className="flex items-center justify-between py-4 border-b border-gray-200">
        <Button onClick={onGoBack} variant="ghost" className="text-gray-600 hover:text-gray-800">
          <ArrowLeft size={20} />
          <span className="ml-2">Back to Home</span>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Your Ad Tech Solution</h1>
        <div></div> {/* Spacer */}
      </div>

      {/* Main Content Sections */}
      <div className="max-w-4xl mx-auto mt-8 space-y-12">
        
        {/* Section 1: Introduction */}
        <section className="text-center">
          <h2 className="text-4xl font-extrabold text-blue-600 mb-4">The New Standard in AdTech</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform connects advertisers with publishers in a seamless, efficient, and transparent marketplace, just like Google AdSense, but better.
          </p>
        </section>

        {/* Section 2: Core Features */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Feature 1 */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
              <Check size={36} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Easy Monetization</h3>
              <p className="text-gray-500 mt-2">
                Turn your website traffic into revenue with a simple setup.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
              <TrendingUp size={36} className="text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Targeted Campaigns</h3>
              <p className="text-gray-500 mt-2">
                Reach the right audience at the right time with powerful targeting tools.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
              <Hand size={36} className="text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Fair & Transparent</h3>
              <p className="text-gray-500 mt-2">
                We ensure fair pricing and clear reporting for both publishers and advertisers.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Call to Action */}
        <section className="text-center bg-gray-100 p-8 rounded-lg">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Ready to get started?</h3>
          <p className="text-lg text-gray-600 mb-6">
            Join thousands of users who are growing their business and their revenue with our platform.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button variant="primary" size="lg">Sign Up Now</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">Log In</Button>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default MarketingSection;