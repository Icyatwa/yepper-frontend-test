// Websites.js
import React, { useState, useEffect } from 'react';
import { Globe, Search, Edit, Check, X, Plus } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { Button, Grid } from '../../components/components';
import LoadingSpinner from '../../components/LoadingSpinner';

function Websites() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWebsites, setFilteredWebsites] = useState([]);
  const [editingWebsite, setEditingWebsite] = useState(null);
  const [tempWebsiteName, setTempWebsiteName] = useState('');

  const authenticatedAxios = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const { data: websites, isLoading, error, refetch } = useQuery({
    queryKey: ['websites', user?._id || user?.id],
    queryFn: async () => {
      try {
        const userId = user?._id || user?.id;
        const response = await authenticatedAxios.get(`/createWebsite/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching websites:', error.response?.data || error.message);
        throw error;
      }
    },
    enabled: !!(user?._id || user?.id) && !!token,
    onSuccess: (data) => {
      setFilteredWebsites(data);
    }
  });

  const updateWebsiteNameMutation = useMutation({
    mutationFn: ({ websiteId, websiteName }) => 
      authenticatedAxios.patch(`/createWebsite/${websiteId}/name`, { websiteName }),
    onSuccess: (response) => {
      queryClient.setQueryData(['websites', user?._id || user?.id], (oldData) => 
        oldData.map(website => 
          website._id === response.data._id ? response.data : website
        )
      );
      setEditingWebsite(null);
    },
    onError: (error) => {
      console.error('Failed to update website name:', error);
    }
  });

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
  }, [user, token, navigate]);

  const handleStartEdit = (website) => {
    setEditingWebsite(website._id);
    setTempWebsiteName(website.websiteName);
  };

  const handleSaveWebsiteName = () => {
    if (tempWebsiteName.trim() && editingWebsite) {
      updateWebsiteNameMutation.mutate({
        websiteId: editingWebsite,
        websiteName: tempWebsiteName.trim()
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingWebsite(null);
  };

  useEffect(() => {
    if (!websites) return;

    const performSearch = () => {
      const query = searchQuery.toLowerCase().trim();
      const statusFiltered = selectedFilter === 'all' 
        ? websites 
        : websites.filter(website => website.status === selectedFilter);

      if (!query) {
        setFilteredWebsites(statusFiltered);
        return;
      }

      const searched = statusFiltered.filter(website => {
        const searchFields = [
          website.websiteName?.toLowerCase(),
          website.websiteLink?.toLowerCase(),
        ];
        return searchFields.some(field => field?.includes(query));
      });
        
      setFilteredWebsites(searched);
    };

    performSearch();
  }, [searchQuery, selectedFilter, websites]);
    
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  if (error) return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error loading websites</h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <Button onClick={() => refetch()} variant="primary">
            Retry
          </Button>
        </div>
      </div>
    </>
  );

  if (isLoading) return (
    <LoadingSpinner />
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12">

          <div className='flex justify-between items-center gap-4 mb-12'>
            {/* Search Section */}
            <div className="flex justify-start flex-1">
              <div className="relative w-full max-w-md">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search websites..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 border border-black bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-0 transition-all duration-200"
                />
              </div>
            </div>

            {/* Ad Reports Button Section */}
            <div className="flex-shrink-0">
              <Link to='/ad-reports'>
                <Button
                  variant="primary"
                  size="lg"
                  iconPosition="left"
                >
                  Ad Reports
                </Button>
              </Link>
            </div>

            {/* Wallet Button Section */}
            <div className="flex-shrink-0">
              <Link to='/wallet'>
                <Button
                  variant="primary"
                  size="lg"
                  iconPosition="left"
                >
                  Wallet
                </Button>
              </Link>
            </div>

            {/* Add new website Section */}
            <div className="flex-shrink-0">
              <Link to='/create-website'>
                <Button
                  variant="secondary"
                  size="lg"
                  icon={Plus}
                  iconPosition="left"
                >
                  Add New Website
                </Button>
              </Link>
            </div>
          </div>

          {/* Websites Grid */}
          {filteredWebsites && filteredWebsites.length > 0 ? (
            <Grid cols={3} gap={6}>
              {filteredWebsites.slice().reverse().map((website) => (
                <div
                  key={website._id}
                  className="border border-black bg-white p-6 transition-all duration-200 hover:bg-gray-50"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center">
                      {website.imageUrl ? (
                        <img 
                          src={website.imageUrl} 
                          alt={website.websiteName}
                          className="w-10 h-10 object-contain mr-3"
                        />
                      ) : (
                        <Globe size={40} className="mr-3 text-black" />
                      )}
                    </div>
                  </div>
                  
                  {/* Website Name */}
                  {editingWebsite === website._id ? (
                    <div className="flex items-center gap-2 mb-6">
                      <input 
                        type="text"
                        value={tempWebsiteName}
                        onChange={(e) => setTempWebsiteName(e.target.value)}
                        className="flex-1 px-3 py-2 border border-black bg-white focus:outline-none focus:ring-0"
                        autoFocus
                      />
                      <button 
                        onClick={handleSaveWebsiteName} 
                        className="p-2 text-green-600 hover:bg-green-50 border border-green-600"
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        onClick={handleCancelEdit} 
                        className="p-2 text-red-600 hover:bg-red-50 border border-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-black">{website.websiteName}</h3>
                      <button 
                        onClick={() => handleStartEdit(website)}
                        className="p-2 text-black hover:bg-gray-100 border border-black"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  )}

                  {/* Website Link */}
                  <div className="mb-6">
                    <a 
                      href={website.websiteLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-black text-sm break-all"
                    >
                      {website.websiteLink}
                    </a>
                  </div>

                  {/* View Details Button */}
                  <Link to={`/website/${website._id}`}>
                    <Button 
                      variant="secondary" 
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <span>View Details</span>
                    </Button>
                  </Link>
                </div>
              ))}
            </Grid>
          ) : (
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <Globe size={64} className="mx-auto mb-6 text-black" />
                <h2 className="text-2xl font-semibold mb-4 text-black">
                  {searchQuery ? 'No Websites Found' : 'No Websites Yet'}
                </h2>
                <Button onClick={() => refetch()} variant="primary">
                  Refresh
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Websites;