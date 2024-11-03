import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useClerk } from '@clerk/clerk-react';

const CreatorEarnings = () => {
  const { user } = useClerk();
  const userId = user?.id;
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/picture/earnings/${userId}`);
        setEarnings(response.data);
      } catch (error) {
        console.error('Error fetching earnings:', error);
        setError('Could not retrieve earnings');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchEarnings();
  }, [userId]);

  if (loading) return <p>Loading earnings...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Your Earnings</h2>
      {earnings ? (
        <div>
          <p>Total Earnings: ${earnings.totalEarnings.toFixed(2)}</p>
          <p>Number of Successful Payments: {earnings.paymentCount}</p>
        </div>
      ) : (
        <p>No earnings data available.</p>
      )}
    </div>
  );
};

export default CreatorEarnings;
