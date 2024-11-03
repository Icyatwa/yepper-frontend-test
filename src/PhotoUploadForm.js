// components/PhotoUploadForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useClerk } from '@clerk/clerk-react';

const PhotoUploadForm = () => {
  const { user } = useClerk();
  const userId = user?.id;
  const [url, setUrl] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert('User ID is missing');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/picture/upload', { url, price, ownerId: userId });
      alert(`Picture uploaded successfully! Picture ID: ${response.data.pictureId}`);
    } catch (error) {
      console.error('Error uploading picture:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Picture URL" required />
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" required />
      <button type="submit">Upload Picture</button>
    </form>
  );
};

export default PhotoUploadForm;