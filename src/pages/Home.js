// Home.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Loader } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Button, 
  Grid,
} from '../components/components';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [isCheckingWebsites, setIsCheckingWebsites] = useState(false);

  const authenticatedAxios = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  // Query to check if user has websites
  const { data: websites, isLoading: websitesLoading } = useQuery({
    queryKey: ['websites', user?._id || user?.id],
    queryFn: async () => {
      try {
        const userId = user?._id || user?.id;
        const response = await authenticatedAxios.get(`/createWebsite/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching websites:', error.response?.data || error.message);
        return []; // Return empty array if error
      }
    },
    enabled: !!(user?._id || user?.id) && !!token,
  });

  const handleRunAdsClick = async () => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    setIsCheckingWebsites(true);
    
    try {
      // Check if websites data is already loaded
      if (websites !== undefined) {
        if (websites.length > 0) {
          navigate('/websites');
        } else {
          navigate('/create-website');
        }
      } else {
        navigate('/websites');
      }
    } finally {
      setIsCheckingWebsites(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Grid cols={2} gap={4} className="max-w-2xl mx-auto">
          <Button 
            variant="primary" 
            size="lg" 
            className="h-16 w-full flex items-center justify-center space-x-4 focus:outline-none focus:ring-0"
            onClick={handleRunAdsClick}
            disabled={isCheckingWebsites || websitesLoading}
          >
            {isCheckingWebsites || websitesLoading ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <ArrowLeft />
                <span>Run Ads</span>
              </>
            )}
          </Button>
          
          <Link to="/upload-ad">
            <Button 
              variant="primary" 
              size="lg" 
              className="h-16 w-full flex items-center justify-center space-x-4 focus:outline-none focus:ring-0"
            >
              <span>Advertise your Product</span>
              <ArrowRight />
            </Button>
          </Link>
        </Grid>
      </div>
    </>
  );
};

export default Home;