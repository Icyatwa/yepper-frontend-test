import React from 'react';
import './styles/AdSuccess.css';
import { Link } from 'react-router-dom';

const AdSuccess = () => {
  return (
    <div className="ad-success-container">
      <div className="ad-success-card">
        <h1 className="success-message">🎉 Ad Published Successfully!</h1>
        <p className="detail-message">
          Your ad has been published and is being processed for detailed tracking. You can now move to your dashboard to view the status of your published ad.
        </p>
        <Link to='/dashboard' className="dashboard-button">Go to Dashboard</Link>
      </div>
    </div>
  );
};

export default AdSuccess;
