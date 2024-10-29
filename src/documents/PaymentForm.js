// PaymentForm.js
import React, { useState } from "react";
import axios from "axios";
import { useClerk } from '@clerk/clerk-react';

function PaymentForm() {
    const { user } = useClerk();
    const payerId = user?.id;
    const [payeeId, setPayeeId] = useState(""); // Input for selecting or specifying the payee

    const initiatePayment = async () => {
      if (!payeeId) {
          alert("Please enter the Payee ID.");
          return;
      }
  
      try {
          const data = {
              payeeId,
              payerId,
          };
          const response = await axios.post("http://localhost:5000/api/payments/create", data, {
              headers: {
                  'Content-Type': 'application/json',
              },
          });
  
          const orderId = response.data.orderId;
          if (orderId) {
              window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`;
          } else {
              console.error("Error: orderId is missing from the response.");
              alert("Failed to initiate PayPal payment. Please try again.");
          }

      } catch (error) {
          console.error("Error initiating payment", error);
      }
  };
  

    return (
        <div>
            <input
                type="text"
                placeholder="Enter Payee ID"
                value={payeeId}
                onChange={(e) => setPayeeId(e.target.value)}
                required
            />
            <button onClick={initiatePayment}>Pay Now</button>
        </div>
    );
}

export default PaymentForm;
