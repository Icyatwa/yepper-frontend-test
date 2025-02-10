import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from 'axios';

export default function WebOwnerDashboard() {
  const { userId } = useAuth();  // Optional, if you need the userId
  const { user } = useUser();    // Fetch user information
  const [adsPendingApproval, setAdsPendingApproval] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      const email = user.primaryEmailAddress.emailAddress; // Web owner's email address

      // Call backend to fetch pending ads that need approval
      axios.get(`http://localhost:5000/api/ads/pending?email=${email}`)
        .then(response => {
          setAdsPendingApproval(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching pending ads", error);
          setLoading(false);
        });
    }
  }, [user]);

  const handleApproveAd = (adId) => {
    axios.post(`http://localhost:5000/api/ads/approve/${adId}`)
      .then(response => {
        alert('Ad approved successfully');
        // Optionally update the adsPendingApproval state to remove the approved ad
        setAdsPendingApproval(prevAds => prevAds.filter(ad => ad._id !== adId));
      })
      .catch(error => {
        console.error('Error approving ad:', error);
      });
  };

  if (loading) {
    return <div>Loading ads pending approval...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Your Email: {user.primaryEmailAddress.emailAddress}</p>
      
      <h2>Ads Pending Approval</h2>
      {adsPendingApproval.length > 0 ? (
        <ul>
          {adsPendingApproval.map((ad) => (
            <li key={ad._id}>
              <p>Business Name: {ad.businessName}</p>
              <p>Description: {ad.adDescription}</p>
              <button onClick={() => handleApproveAd(ad._id)}>Approve</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No ads pending approval.</p>
      )}
    </div>
  );
}
