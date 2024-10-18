// // PaymentForm.js
// import React, { useState } from 'react';
// import axios from 'axios';

// const PaymentForm = () => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [currency, setCurrency] = useState('USD');
//   const [amount, setAmount] = useState(10);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handlePayment = async () => {
//     if (!phoneNumber || !amount) {
//       setError('Phone number and amount are required');
//       return;
//     }
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post('https://yepper-backend.onrender.com/api/payment/initiate', {
//         amount,
//         currency,
//         email,
//         phoneNumber
//       });

//       if (response.data.paymentLink) {
//         window.location.href = response.data.paymentLink;
//       } else {
//         setError('Failed to initiate payment');
//       }
//     } catch (error) {
//       console.error('Error initiating payment:', error);
//       setError('An error occurred while initiating the payment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1>Payment Form</h1>
//       <input
//         type="text"
//         placeholder="Phone Number"
//         value={phoneNumber}
//         onChange={(e) => setPhoneNumber(e.target.value)}
//         required
//       />
//       <input
//         type="email"
//         placeholder="Email (optional)"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
//         <option value="USD">USD</option>
//         <option value="RWF">RWF</option>
//       </select>
//       <input
//         type="number"
//         placeholder="Amount"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         required
//       />
//       <button onClick={handlePayment} disabled={loading}>
//         {loading ? 'Processing...' : 'Pay Now'}
//       </button>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </div>
//   );
// };

// export default PaymentForm;

import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    if (!phoneNumber || !amount) {
      setError('Phone number and amount are required');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/payment/initiate', {
        amount,
        currency,
        email,
        phoneNumber
      });

      if (response.data.paymentLink) {
        window.location.href = response.data.paymentLink;
      } else {
        setError('Failed to initiate payment');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      setError('An error occurred while initiating the payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h1 style={styles.title}>Secure Payment</h1>
        <p style={styles.description}>Complete your transaction with confidence.</p>
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={styles.select}>
          <option value="USD">USD</option>
          <option value="RWF">RWF</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
          required
        />
        <button onClick={handlePayment} disabled={loading} style={styles.button}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

// Professional Styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f3f4f6',
    fontFamily: '"Roboto", sans-serif',
  },
  formWrapper: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '10px',
    color: '#333333',
    fontWeight: '500',
  },
  description: {
    fontSize: '0.9rem',
    color: '#666666',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    color: '#333333',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease',
  },
  inputFocus: {
    borderColor: '#6366f1',
  },
  select: {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #d1d5db',
    backgroundColor: '#f9fafb',
    fontSize: '1rem',
    color: '#333333',
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '5px',
    backgroundColor: '#4f46e5',
    color: 'white',
    fontSize: '1.1rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    boxSizing: 'border-box',
  },
  buttonHover: {
    backgroundColor: '#4338ca',
  },
  error: {
    marginTop: '10px',
    color: '#dc2626',
    fontSize: '0.9rem',
  },
};

export default PaymentForm;
