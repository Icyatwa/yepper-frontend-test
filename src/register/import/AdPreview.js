import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/adPreview.css';

const AdPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { file, userId, businessName, businessLocation, adDescription, selectedCategories, templateType } = location.state || {};

  const [adContent, setAdContent] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState('RWF');
  const [amount, setAmount] = useState(100);
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => setAdContent(e.target.result);
    reader.readAsDataURL(file);
  }, [file]);

  useEffect(() => {
    if (templateType === 'pop-up') {
      const interval = setInterval(() => {
        setIsVisible((prev) => !prev);
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setIsVisible(true);
    }
  }, [templateType]);

  const handleProceed = () => {
    setPaymentVisible(true);
  };

  const handleCloseModal = () => {
    setPaymentVisible(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('payment-modal-overlay')) {
      handleCloseModal();
    }
  };

  const handlePublish = async () => {
    if (!phoneNumber) {
      setError('Phone number is required');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('businessName', businessName);
      formData.append('businessLocation', businessLocation);
      formData.append('adDescription', adDescription);
      formData.append('templateType', templateType);
      formData.append('categories', JSON.stringify(selectedCategories));
      formData.append('amount', amount);
      formData.append('currency', currency);
      formData.append('email', email);
      formData.append('phoneNumber', phoneNumber);

      const response = await axios.post('https://yepper-backend-test.onrender.com/api/importAds/initiate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.paymentLink) {
        window.location.href = response.data.paymentLink;
      } else {
        setError('Payment initiation failed');
      }
    } catch (error) {
      console.error('Error during payment initiation:', error);
      setError('An error occurred while initiating payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ad-preview-container-modern">
      <h1 className="title-modern">Ad Preview</h1>

      <div className="ad-template-container-modern">
        {isVisible && (
          <div className={`ad-template-modern ${templateType}`}>
            {adContent && <img src={adContent} alt="Ad" />}
            <p>{adDescription}</p>
          </div>
        )}
      </div>

      <button onClick={handleProceed} className="proceed-button-modern">Proceed to Payment</button>

      {paymentVisible && (
        <div className="payment-modal-overlay" onClick={handleOverlayClick}>
          <div className="payment-modal-modern">
            <button className="close-modal-button-modern" onClick={handleCloseModal}>✕</button>  {/* Close button */}
            <h2>Complete Payment</h2>

            <label>Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+250 7XX XXX XXX"
              className="input-field-modern"
              required
            />

            <label>Email (Optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-field-modern"
            />

            <div className="currency-amount-wrapper-modern">
              <div className="currency-input-modern">
                <label>Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="input-field-modern"
                >
                  <option value="RWF">RWF</option>
                  <option value="USD">USD</option>
                  <option value="KES">KES</option>
                </select>
              </div>

              <div className="amount-input-modern">
                <label>Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field-modern"
                  min="100"
                  step="50"
                />
              </div>
            </div>

            {error && <div className="error-modern">{error}</div>}

            <button onClick={handlePublish} disabled={loading} className="publish-button-modern">
              {loading ? 'Processing...' : 'Publish & Pay'}
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default AdPreview;

