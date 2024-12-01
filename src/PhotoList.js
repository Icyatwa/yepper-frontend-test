// components/PhotoList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useClerk } from '@clerk/clerk-react';
import './list.css';
import BackButton from './backToPreviusButton'

const PhotoList = () => {
  const { user } = useClerk();
  const userId = user?.id;
  const [pictures, setPictures] = useState([]);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading state as true

  useEffect(() => {
    const fetchPictures = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/picture/all');
        setPictures(response.data);
      } catch (error) {
        console.error('Error fetching pictures:', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };
    fetchPictures();
  }, []);

  const handleViewClick = (picture) => {
    const hasPaid = picture.paidUsers.includes(userId);
    if (hasPaid) {
      setSelectedPicture(picture);
    } else {
      setSelectedPicture(picture);
      setShowPaymentForm(true);
    }
  };

  const handleCloseClick = () => {
    setSelectedPicture(null);
    setShowPaymentForm(false);
    setError(null);
  };

  const validatePhoneNumber = (number) => /^[0-9]{10,15}$/.test(number);

  const handlePayment = async () => {
    if (!selectedPicture || !selectedPicture.price || !selectedPicture._id) {
      setError('Please select a picture to purchase');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Invalid phone number');
      return;
    }

    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.post('http://localhost:5000/api/payment/initiate-momo-payment', {
        amount: selectedPicture.price,
        currency: 'RWF',
        email,
        phoneNumber,
        userId,
        pictureId: selectedPicture._id,
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
    <>
      <BackButton/>
      <div className='list'>
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <ul>
            {pictures.map((picture) => (
              <li key={picture._id}>
                <p>Price: ${picture.price}</p>
                <button onClick={() => handleViewClick(picture)}>View</button>
              </li>
            ))}
          </ul>
        )}

        {/* Modal to display selected picture */}
        {selectedPicture && !showPaymentForm && (
          <div className="modal">
            <span className="close" onClick={handleCloseClick}>×</span>
            <img src={selectedPicture.url} alt="Selected" />
            <p>Price: ${selectedPicture.price}</p>
          </div>
        )}

        {/* Payment Form Modal */}
        {showPaymentForm && selectedPicture && (
          <div className="modal">
            <span className="close" onClick={handleCloseClick}>×</span>
            <h3>Complete Payment to View Picture</h3>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handlePayment} disabled={loading}>
              {loading ? 'Processing...' : `Pay $${selectedPicture.price}`}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default PhotoList;