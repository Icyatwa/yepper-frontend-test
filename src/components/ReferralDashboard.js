// components/ReferralDashboard.js
import React, { useState, useEffect } from 'react';
import { useClerk } from '@clerk/clerk-react';
import axios from 'axios';
import { Share2, Copy, CheckCircle, Users, DollarSign } from 'lucide-react';

const ReferralDashboard = () => {
  const { user } = useClerk();
  const [referralData, setReferralData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadReferralData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Generate/fetch referral code
      const generateResponse = await axios.post(`http://localhost:5000/api/referrals/generate-code`, {
        userId: user.id,
        userType: 'promoter'
      });

      if (!generateResponse.data.success) {
        throw new Error('Failed to generate referral code');
      }

      // Get referral stats
      const statsResponse = await axios.get(`http://localhost:5000/api/referrals/stats/${user.id}`);
      
      if (!statsResponse.data.success) {
        throw new Error('Failed to fetch referral stats');
      }

      setReferralData(statsResponse.data.stats);
    } catch (err) {
      setError(err.message);
      console.error('Error loading referral data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadReferralData();
      const pollInterval = setInterval(loadReferralData, 30000);
      return () => clearInterval(pollInterval);
    }
  }, [user?.id]);

  const renderReferralList = () => {
    if (!referralData?.referrals?.length) {
      return (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p>No referrals yet. Share your referral link to get started!</p>
        </div>
      );
    }

    return referralData.referrals.map((referral, index) => (
      <div key={index} className="mb-4 border rounded-lg p-4">
        <div className={`p-4 rounded-lg ${
          referral.status === 'qualified' ? 'bg-green-50' : 'bg-yellow-50'
        }`}>
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Status: </span>
              <span className={`${
                referral.status === 'qualified' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {new Date(referral.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          {referral.userDetails && (
            <div className="mt-2 border-t pt-2">
              <p className="font-medium">User Details:</p>
              <p>{referral.userDetails.firstName} {referral.userDetails.lastName}</p>
              <p className="text-sm text-gray-600">{referral.userDetails.email}</p>
            </div>
          )}
          
          {referral.websiteDetails?.length > 0 && (
            <div className="mt-2 border-t pt-2">
              <p className="font-medium">Websites:</p>
              {referral.websiteDetails.map((website, idx) => (
                <div key={idx} className="mt-1">
                  <p>{website.websiteName}</p>
                  <a href={website.websiteLink} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-sm text-blue-600 hover:underline">
                    {website.websiteLink}
                  </a>
                </div>
              ))}
            </div>
          )}
          
          {referral.categoryDetails?.length > 0 && (
            <div className="mt-2 border-t pt-2">
              <p className="font-medium">Ad Categories:</p>
              {referral.categoryDetails.map((category, idx) => (
                <div key={idx} className="mt-1">
                  <p>{category.categoryName}</p>
                  <p className="text-sm text-gray-600">
                    Created: {new Date(category.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ));
  };

  const getReferralLink = () => {
    if (!referralData?.code) return '';
    return `${window.location.origin}/sign-up?ref=${referralData.code}`;
  };

  const copyReferralLink = async () => {
    const link = getReferralLink();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded">
        Error loading referral data: {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Your Referral Link</h2>
        <div className="flex items-center gap-2">
          <input 
            type="text"
            readOnly
            value={getReferralLink()}
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={copyReferralLink}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Your Referrals</h2>
        <p className="mb-2">Total Qualified Referrals: {referralData?.totalReferrals || 0}</p>
        {referralData?.referrals?.length > 0 ? (
          <div className="space-y-4">
            {renderReferralList()}
          </div>
        ) : (
          <p>No referrals yet</p>
        )}
      </div>
    </div>
  );
};

export default ReferralDashboard;