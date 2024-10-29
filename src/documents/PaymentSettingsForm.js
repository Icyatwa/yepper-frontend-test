// PaymentSettingsForm.js
import React, { useState } from "react";
import axios from "axios";
import { useClerk } from '@clerk/clerk-react';

function PaymentSettingsForm() {
    const { user } = useClerk();
    const userId = user?.id;

  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState("minute");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/payments/set", { userId, price, frequency }, {
        headers: { Authorization: `Bearer ${user.sessionToken}` },
      });
      alert("Payment settings saved.");
    } catch (error) {
      console.error("Error saving payment settings", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
      <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
        <option value="minute">Per Minute</option>
        <option value="2-minutes">Per 2 Minutes</option>
      </select>
      <button type="submit">Save Payment Settings</button>
    </form>
  );
}

export default PaymentSettingsForm;
