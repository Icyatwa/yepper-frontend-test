// Projects.js
import React, { useState, useEffect } from 'react';
import { useClerk } from '@clerk/clerk-react';
import { Plus, Globe, ChevronRight, Megaphone, Loader, Banknote, ArrowUpRight, Search, Edit, Check, X } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from '../components/LoadingSpinner';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';

function Projects() {
    const { user } = useClerk();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredWebsites, setFilteredWebsites] = useState([]);
    const [hoverCreate, setHoverCreate] = useState(false);
    const [editingWebsite, setEditingWebsite] = useState(null);
    const [tempWebsiteName, setTempWebsiteName] = useState('');

    const { data: websites, isLoading, error } = useQuery({
        queryKey: ['websites', user?.id],
        queryFn: async () => {
          const response = await axios.get(`http://localhost:5000/api/websites/${user?.id}`);
          return response.data;
        },
        enabled: !!user?.id,
        onSuccess: (data) => {
          // Initialize filteredWebsites when data first loads
          setFilteredWebsites(data);
        }
    });

  const updateWebsiteNameMutation = useMutation({
    mutationFn: ({ websiteId, websiteName }) => 
      axios.patch(`http://localhost:5000/api/websites/${websiteId}/name`, { websiteName }),
    onSuccess: (response) => {
      // Optimistically update the local cache
      queryClient.setQueryData(['websites', user?.id], (oldData) => 
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
    
    if (isLoading) return <LoadingSpinner />;
  
    if (error) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-red-500">Error: {error.message}</div>
        </div>
    );

  return (
    <div className="min-h-screen bg-black text-white">    
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="h-px w-12 bg-blue-500 mr-6"></div>
            <span className="text-blue-400 text-sm font-medium uppercase tracking-widest">Website Manager</span>
            <div className="h-px w-12 bg-blue-500 ml-6"></div>
          </div>
          
          <h1 className="text-center text-6xl font-bold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Your Digital Ecosystem
            </span>
          </h1>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-12">
            <div className="relative w-full md:w-1/2 max-w-md">
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full h-14 pl-14 pr-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/pending-ads')}
                className="h-12 px-5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-all flex items-center"
              >
                <Loader className="w-5 h-5 mr-2 text-orange-400" />
                <span>Pending Ads</span>
              </button>
              
              <button 
                onClick={() => navigate('/wallet')}
                className="h-12 px-5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-all flex items-center"
              >
                <Banknote className="w-5 h-5 mr-2 text-orange-400" />
                <span>Wallet</span>
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center">
              <span className="text-blue-400 text-2xl font-bold mr-3">{filteredWebsites.length}</span>
              <span className="text-white/70">{searchQuery ? 'Found Websites' : 'Active Websites'}</span>
            </div>
            
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center px-5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-500 hover:to-red-500 transition-all"
            >
              <Megaphone className="w-5 h-5 mr-2" />
              <span>Switch to Ads</span>
            </button>
          </div>
        </div>
        
        {filteredWebsites.length > 0 ? (
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
                    className="text-lg font-semibold text-gray-800 mb-2 flex items-center group"
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
            
            {/* Add New Website Card */}
            <div 
              className="group relative backdrop-blur-md bg-gradient-to-b from-blue-900/30 to-blue-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500 cursor-pointer"
              style={{
                boxShadow: hoverCreate ? '0 0 40px rgba(59, 130, 246, 0.3)' : '0 0 0 rgba(0, 0, 0, 0)'
              }}
              onMouseEnter={() => setHoverCreate(true)}
              onMouseLeave={() => setHoverCreate(false)}
              onClick={() => navigate('/create-website')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
              
              <div className="h-full flex flex-col items-center justify-center p-8 relative z-10">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40"></div>
                  <div className="relative p-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                    <Plus className="text-white" size={32} />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2">Add New Website</h3>
                <p className="text-white/70 text-center mb-6">
                  Connect a new website to your ecosystem
                </p>
                
                <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium overflow-hidden transition-all duration-300 hover:from-blue-500 hover:to-indigo-500">
                  Create Now
                </button>
              </div>
            </div>
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
            
            <p className="text-white/70 text-center mb-8 max-w-md">
              {searchQuery 
                ? 'Try adjusting your search terms or create a new website'
                : 'Start by adding a new website to track your projects and analytics.'}
            </p>
            
            <button
              onClick={() => navigate('/create-website')}
              className="group relative h-12 px-6 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 text-white font-medium overflow-hidden transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center">
                <Plus size={16} className="mr-2" />
                <span className="uppercase tracking-wider">Create First Website</span>
              </span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Projects;