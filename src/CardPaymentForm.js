// // CardPaymentForm.js
// import React, { useState } from 'react';
// import axios from 'axios';

// const CardPaymentForm = () => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [currency, setCurrency] = useState('USD');
//   const [amount, setAmount] = useState(10);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleCardPayment = async () => {
//     if (!phoneNumber || !amount) {
//       setError('Phone number and amount are required');
//       return;
//     }
//     setLoading(true);
//     setError(null);
  
//     try {
//       const response = await axios.post('http://localhost:5000/api/payment/initiate-card-payment', {
//         amount,
//         currency,
//         email,
//         phoneNumber
//       });
  
//       if (response.data.paymentLink) {
//         // Redirect to payment link and pass the tx_ref as a query parameter to the viewing page
//         const { paymentLink, tx_ref } = response.data;
//         window.location.href = `${paymentLink}`;
//       } else {
//         setError('Failed to initiate card payment');
//       }
//     } catch (error) {
//       setError('An error occurred while initiating the card payment');
//     } finally {
//       setLoading(false);
//     }
//   };  

//   return (
//     <div style={styles.container}>
//       <div style={styles.formWrapper}>
//         <h1 style={styles.title}>Pay with Bank Card</h1>
//         <p style={styles.description}>Complete your payment with a credit or debit card.</p>
//         <input
//           type="text"
//           placeholder="Phone Number"
//           value={phoneNumber}
//           onChange={(e) => setPhoneNumber(e.target.value)}
//           style={styles.input}
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email (optional)"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           style={styles.input}
//         />
//         <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={styles.select}>
//           <option value="USD">USD</option>
//           <option value="RWF">RWF</option>
//         </select>
//         <input
//           type="number"
//           placeholder="Amount"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           style={styles.input}
//           required
//         />
//         <button onClick={handleCardPayment} disabled={loading} style={styles.button}>
//           {loading ? 'Processing...' : 'Pay with Card'}
//         </button>
//         {error && <p style={styles.error}>{error}</p>}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100vh',
//     backgroundColor: '#f4f4f4',
//   },
//   formWrapper: {
//     backgroundColor: '#fff',
//     padding: '2rem',
//     borderRadius: '8px',
//     boxShadow: '0 0 10px rgba(0,0,0,0.1)',
//     width: '100%',
//     maxWidth: '400px',
//     textAlign: 'center',
//   },
//   title: {
//     fontSize: '1.5rem',
//     marginBottom: '1rem',
//   },
//   description: {
//     marginBottom: '1.5rem',
//   },
//   input: {
//     width: '100%',
//     padding: '0.75rem',
//     marginBottom: '1rem',
//     borderRadius: '4px',
//     border: '1px solid #ccc',
//   },
//   select: {
//     width: '100%',
//     padding: '0.75rem',
//     marginBottom: '1rem',
//     borderRadius: '4px',
//     border: '1px solid #ccc',
//   },
//   button: {
//     width: '100%',
//     padding: '0.75rem',
//     backgroundColor: '#28a745',
//     color: '#fff',
//     borderRadius: '4px',
//     border: 'none',
//     cursor: 'pointer',
//   },
//   error: {
//     marginTop: '1rem',
//     color: 'red',
//   },
// };

// export default CardPaymentForm;


import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = ({ pictureId, userId, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [amount, setAmount] = useState(10); // Set based on picture price
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
      const response = await axios.post('http://localhost:5000/api/payment/initiate-card-payment', {
        amount,
        currency,
        email,
        phoneNumber,
        userId,
        pictureId
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
        <h1 style={styles.title}>Pay with Bank Card</h1>
        <p style={styles.description}>Complete your payment with a credit or debit card.</p>
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
          {loading ? 'Processing...' : 'Pay with Card'}
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
  },
  formWrapper: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  description: {
    marginBottom: '1.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#28a745',
    color: '#fff',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
  },
  error: {
    marginTop: '1rem',
    color: 'red',
  },
};

export default PaymentForm;
