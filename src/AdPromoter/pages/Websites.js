import React, { useState, useEffect } from 'react';
import { Plus, Globe, ChevronRight, Megaphone, Loader, Banknote, ArrowUpRight, Search, Edit, Check, X } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function Websites() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWebsites, setFilteredWebsites] = useState([]);
  const [hoverCreate, setHoverCreate] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState(null);
  const [tempWebsiteName, setTempWebsiteName] = useState('');

  const authenticatedAxios = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  // Debug: Log user object to see its structure
  console.log('User object:', user);
  console.log('Token:', token);

  const { data: websites, isLoading, error, refetch } = useQuery({
    // Use _id if that's what your backend expects
    queryKey: ['websites', user?._id || user?.id],
    
    queryFn: async () => {
        try {
          // Use the correct user ID field
          const userId = user?._id || user?.id;
          console.log('Fetching websites for user:', userId);
          
          const response = await authenticatedAxios.get(`/createWebsite/${userId}`);
          console.log('API Response:', response.data);
          return response.data;
        } catch (error) {
          console.error('Error fetching websites:', error.response?.data || error.message);
          throw error;
        }
    },
    
    enabled: !!(user?._id || user?.id) && !!token,
    
    onSuccess: (data) => {
        console.log('Websites loaded successfully:', data);
        setFilteredWebsites(data);
    }
  });

  const updateWebsiteNameMutation = useMutation({
    mutationFn: ({ websiteId, websiteName }) => 
      // Use the same authenticated axios instance
      authenticatedAxios.patch(`/createWebsite/${websiteId}/name`, { websiteName }),
    onSuccess: (response) => {
      // Optimistically update the local cache
      queryClient.setQueryData(['websites', user?._id || user?.id], (oldData) => 
        oldData.map(website => 
          website._id === response.data._id ? response.data : website
        )
      );
      setEditingWebsite(null);
    },
    onError: (error) => {
      console.error('Failed to update website name:', error);
      // Optionally show an error toast or notification
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
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-red-500">
            <h2>Error loading websites</h2>
            <p>{error.message}</p>
            <button 
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
    );

    if (isLoading) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="flex items-center">
            <Loader className="animate-spin mr-2" size={24} />
            <span>Loading websites...</span>
          </div>
        </div>
    );

  return (
    <div className="min-h-screen bg-black text-white">    
      <main className="max-w-7xl mx-auto px-6 py-20">
        
        {/* Debug Info - Remove this in production */}
        <div className="mb-4 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-white font-bold mb-2">Debug Info:</h3>
          <p className="text-gray-300">User ID: {user?._id || user?.id}</p>
          <p className="text-gray-300">Token exists: {!!token}</p>
          <p className="text-gray-300">Websites count: {websites?.length || 0}</p>
          <p className="text-gray-300">Filtered websites count: {filteredWebsites?.length || 0}</p>
        </div>
        
        {filteredWebsites && filteredWebsites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredWebsites.slice().reverse().map((website) => (
              <div
                key={website._id}
                className="group backdrop-blur-md bg-gradient-to-b from-gray-900/30 to-gray-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500 hover:border-orange-500/30"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    {website.imageUrl ? (
                      <img 
                        src={website.imageUrl} 
                        alt={website.websiteName}
                        className="w-16 h-16 object-contain rounded-xl bg-black/20 p-2"
                      />
                    ) : (
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-orange-500 blur-md opacity-40"></div>
                        <div className="relative p-3 rounded-full bg-gradient-to-r from-orange-600 to-orange-400">
                          <Globe className="text-white" size={24} />
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col items-end">
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white mb-2">Active</div>
                      <a 
                        href={website.websiteLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-white/70 hover:text-white transition-colors"
                      >
                        <Globe className="w-4 h-4 mr-1" />
                        <span>Visit Site</span>
                        <ArrowUpRight className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                  
                  {editingWebsite === website._id ? (
                    <div className="flex items-center gap-2 mb-2">
                      <input 
                        type="text"
                        value={tempWebsiteName}
                        onChange={(e) => setTempWebsiteName(e.target.value)}
                        className="flex-grow px-2 py-1 text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                        <button 
                          onClick={handleSaveWebsiteName}
                          className="text-green-500 hover:bg-green-100 rounded-full p-1"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="text-red-500 hover:bg-red-100 rounded-full p-1"
                        >
                          <X className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                  <h4 
                    className="text-lg font-semibold text-white mb-2 flex items-center group"
                    onDoubleClick={() => handleStartEdit(website)}
                  >
                    {website.websiteName}
                    <Edit 
                      className="ml-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer" 
                      onClick={() => handleStartEdit(website)}
                    />
                  </h4>
                )}
                  <Link 
                    to={`/website/${website._id}`}
                    className="w-full group relative h-12 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 text-white font-medium overflow-hidden transition-all duration-300 flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center">
                      <span className="uppercase tracking-wider">View Details</span>
                      <ChevronRight size={16} className="ml-2" />
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="backdrop-blur-md bg-white/5 rounded-3xl border border-white/10 p-12 flex flex-col items-center justify-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-orange-500 blur-md opacity-40"></div>
              <div className="relative p-4 rounded-full bg-gradient-to-r from-orange-600 to-orange-400">
                <Globe className="text-white" size={32} />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-3">
              {searchQuery ? 'No Websites Found' : 'No Websites Yet'}
            </h2>
            
            <button 
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Websites;