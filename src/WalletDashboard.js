// WalletBalance.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useClerk } from '@clerk/clerk-react';

const WalletBalance = () => {
  const { userId } = useClerk();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}/balance`);
      setBalance(response.data.walletBalance);
    };
    fetchBalance();
  }, [userId]);

  return (
    <div>
      <h1>Your Wallet Balance</h1>
      <p>${balance}</p>
    </div>
  );
};

export default WalletBalance;
