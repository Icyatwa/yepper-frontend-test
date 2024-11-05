// CreatorEarnings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useClerk } from '@clerk/clerk-react';

const CreatorEarnings = () => {
  const { user } = useClerk();
  const userId = user?.id;
  const [ipError, setIpError] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [payoutMessage, setPayoutMessage] = useState('');

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

  const handlePayoutRequest = async () => {
    try {
      setPayoutMessage('');
      setIpError(null);
      
      const response = await axios.post('http://localhost:5000/api/payout/request-payout', {
        creatorId: userId,
        amount: parseFloat(payoutAmount),
        phoneNumber,
      });
      setPayoutMessage(response.data.message);
    } catch (error) {
      if (error.response?.data?.message === 'IP not whitelisted') {
        setIpError({
          ip: error.response.data.currentIP,
          message: error.response.data.error
        });
        setPayoutMessage('IP Whitelisting Required');
      } else {
        setPayoutMessage('Error processing payout request');
      }
      console.error('Payout error:', error);
    }
  };

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
      
      <div>
        <h3>Request Payout</h3>
        <input
          type="number"
          placeholder="Amount"
          value={payoutAmount}
          onChange={(e) => setPayoutAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Rwandan Mobile Money Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button onClick={handlePayoutRequest}>Request Payout</button>
        {payoutMessage && <p>{payoutMessage}</p>}
        
        {ipError && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mt-4">
            <strong className="font-bold">IP Whitelisting Required!</strong>
            <p className="mt-2">Current IP Address: {ipError.ip}</p>
            <p className="mt-2">{ipError.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorEarnings;