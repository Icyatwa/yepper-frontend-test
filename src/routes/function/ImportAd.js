import React, { useState } from 'react';
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ImportAd = () => {
  const navigate = useNavigate();
  const { user } = useClerk();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const displayError = (message) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 3000);
  }

  const handleFileChange = (e) => { 
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!file) {
      displayError('Please upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/importAds', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status !== 201) {
        displayError('Failed to create an ad. Please try again.');
      } else {
        setError(null);
        navigate('/');
      }
    } catch (error) {
      displayError('An error occurred while sending the request.');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='AdRegister'>
      <div className='registerPage'>
        <form className='registerForm' onSubmit={handleSave}>
          <input
            type="file"
            accept="image/*,application/pdf,video/*"
            onChange={handleFileChange}
            required
            className='inputField'
          />
          {error && <p className='errorMessage'>{error}</p>}
          <button type="submit" disabled={loading} className='submitButton'>
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImportAd;
