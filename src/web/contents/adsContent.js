import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import axios from 'axios';

function Ads() {
  const { user } = useClerk();
  const ownerId = user?.id;
  const location = useLocation();  // Get websiteId from the previous route
  const websiteId = location.state?.websiteId;  // Extract the websiteId passed during navigation

  const [selectedCategories, setSelectedCategories] = useState({
    banner: false,
    popup: false,
    custom: false,
  });

  const [prices, setPrices] = useState({});
  const [customCategory, setCustomCategory] = useState({
    name: '',
    description: '',
    customAttributes: {},
  });

  const navigate = useNavigate();

  const handleCategoryChange = (category) => {
    setSelectedCategories(prevState => ({
      ...prevState,
      [category]: !prevState[category]
    }));
  };

  const handlePriceChange = (category, price) => {
    setPrices(prevState => ({
      ...prevState,
      [category]: price
    }));
  };

  const handleCustomCategoryChange = (key, value) => {
    setCustomCategory(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page
  
    if (!websiteId) {
      console.error('Website ID is missing');
      return;
    }
  
    try {
      const categoriesToSubmit = [];
  
      if (selectedCategories.banner) {
        categoriesToSubmit.push({
          ownerId,
          websiteId,  // Associate the ad category with the selected website
          categoryName: 'Banner',
          price: prices.banner,
          description: 'Banner ad category',
          customAttributes: {},
        });
      }
  
      if (selectedCategories.popup) {
        categoriesToSubmit.push({
          ownerId,
          websiteId,  // Associate the ad category with the selected website
          categoryName: 'Popup',
          price: prices.popup,
          description: 'Popup ad category',
          customAttributes: {},
        });
      }
  
      if (selectedCategories.custom) {
        categoriesToSubmit.push({
          ownerId,
          websiteId,  // Associate the ad category with the selected website
          categoryName: customCategory.name,
          price: prices.custom,
          description: customCategory.description,
          customAttributes: customCategory.customAttributes,
        });
      }
  
      // Send the categories data to the backend and store category IDs
      const responses = await Promise.all(categoriesToSubmit.map(async (category) => {
        const response = await axios.post('https://yepper-backend-test.onrender.com/api/ad-categories', category);
        return response.data._id;  // Extract category ID from the response
      }));
  
      // Add the returned category IDs to the array
      navigate('/ad-spaces', { 
        state: { 
          selectedCategories, 
          prices, 
          customCategory, 
        } 
      });
    } catch (error) {
      console.error('Failed to submit categories:', error);
    }
  };

  return (
    <div>
      <h2>Select Ad Categories for Website</h2>
      <label>
        <input
          type="checkbox"
          checked={selectedCategories.banner}
          onChange={() => handleCategoryChange('banner')}
        />
        Banner
      </label>
      {selectedCategories.banner && (
        <input
          type="number"
          className="price-input"
          placeholder="Enter the price"
          value={prices.banner || ''}
          onChange={(e) => handlePriceChange('banner', e.target.value)}
        />
      )}

      <label>
        <input
          type="checkbox"
          checked={selectedCategories.popup}
          onChange={() => handleCategoryChange('popup')}
        />
        Pop-ups
      </label>
      {selectedCategories.popup && (
        <input
          type="number"
          className="price-input"
          placeholder="Enter the price"
          value={prices.popup || ''}
          onChange={(e) => handlePriceChange('popup', e.target.value)}
        />
      )}

      {/* Custom Category Input */}
      <label>
        <input
          type="checkbox"
          checked={selectedCategories.custom}
          onChange={() => handleCategoryChange('custom')}
        />
        Custom Category
      </label>
      {selectedCategories.custom && (
        <div>
          <input
            type="text"
            className="custom-category-input"
            placeholder="Enter custom category name"
            value={customCategory.name}
            onChange={(e) => handleCustomCategoryChange('name', e.target.value)}
          />
          <textarea
            className="custom-category-description"
            placeholder="Enter description"
            value={customCategory.description}
            onChange={(e) => handleCustomCategoryChange('description', e.target.value)}
          />
          <input
            type="number"
            className="price-input"
            placeholder="Enter the price"
            value={prices.custom || ''}
            onChange={(e) => handlePriceChange('custom', e.target.value)}
          />
        </div>
      )}

      <button onClick={handleSubmit}>Continue to Select Ad Spaces</button>
    </div>
  );
}

export default Ads;