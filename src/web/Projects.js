import React, { useState, useEffect } from 'react';
import { useClerk } from '@clerk/clerk-react';
import { Plus, Globe, ChevronRight, Megaphone, Loader, Banknote, ArrowUpRight, Search, Edit, Check, X } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
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
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="w-full bg-white rounded-lg shadow-md container mx-auto px-4 py-8 md:py-16">
            {/* Header Section */}
            <div className="p-4 border-b border-gray-100">
                <div className="py-4 w-full flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
                    {/* Stack buttons vertically on mobile, horizontally on larger screens */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <motion.button 
                            className="flex items-center justify-center gap-2 text-blue-950 font-bold bg-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300 text-sm sm:text-base w-full sm:w-auto"
                            onClick={() => navigate('/pending-ads')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Loader className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF4500]" />
                            <span className="whitespace-nowrap">Pending Ads</span>
                        </motion.button>

                        <motion.button 
                            className="flex items-center justify-center gap-2 text-blue-950 font-bold bg-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300 text-sm sm:text-base w-full sm:w-auto"
                            onClick={() => navigate('/wallet')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Banknote className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF4500]" />
                            Your wallet
                        </motion.button>
                    </div>

                    {/* Search section */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="px-4 py-2 border rounded-full w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <motion.button 
                            className="flex items-center justify-center gap-2 text-white px-3 py-2 rounded-lg text-sm font-bold bg-[#FF4500] hover:bg-orange-500 transition-colors w-full sm:w-auto"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                            Search
                        </motion.button>
                    </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center justify-center gap-5">
                        <h3 className="text-2xl font-bold bg-blue-600 bg-clip-text text-transparent">
                            {filteredWebsites.length}
                        </h3>
                        <h4 className="text-sm font-medium text-gray-600">
                            {searchQuery ? 'Found Websites' : 'Active Websites'}
                        </h4>
                    </div>
                    <div className='flex justify-center items-center gap-3'>
                        <motion.button 
                            className="flex items-center justify-center gap-2 text-blue-950 font-bold bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
                            onClick={() => navigate('/dashboard')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Megaphone className="w-6 h-6 text-[#FF4500]" />
                            Switch to Ads
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
                {filteredWebsites.length > 0 ? (
                    filteredWebsites.slice().reverse().map((website) => (
                        <div
                            key={website._id}
                            className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-[280px]"
                        >
                            <div className="relative h-40 bg-gray-50 p-4">
                                <div className="flex justify-between">
                                    {website.imageUrl ? (
                                        <img 
                                            src={website.imageUrl} 
                                            alt={website.websiteName}
                                            className="w-16 h-16 object-contain rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                                            <Globe className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                    <div className="flex flex-col items-end">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium text-white bg-blue-500">
                                            Active
                                        </span>
                                        <a 
                                            href={website.websiteLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="mt-2 flex items-center text-sm text-gray-600 hover:text-gray-800"
                                        >
                                            <Globe className="w-4 h-4 mr-1" />
                                            Visit Site
                                            <ArrowUpRight className="w-3 h-3 ml-1" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 flex flex-col flex-grow">
                                {editingWebsite === website._id ? (
                                    <div className="flex items-center gap-2 mb-2">
                                        <input 
                                            type="text"
                                            value={tempWebsiteName}
                                            onChange={(e) => setTempWebsiteName(e.target.value)}
                                            className="flex-grow px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-[#FF4500] hover:bg-orange-500 hover:-translate-y-0.5 text-white font-bold rounded-md transition-all duration-300"
                                >
                                    View
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-8">
                        <Globe className="w-8 h-8 text-gray-400 mb-2" />
                        <h2 className="text-xl font-semibold mb-2 text-gray-800">
                            {searchQuery ? 'No Websites Found' : 'No Websites Yet'}
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            {searchQuery 
                                ? 'Try adjusting your search terms'
                                : 'Start by adding a new website to track your projects.'}
                        </p>
                        <Link 
                            to="/create-website"
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-[#FF4500] hover:bg-orange-500 hover:-translate-y-0.5 text-white sm:text-base font-bold rounded-md transition-all duration-300"
                        >
                            <Plus className="w-4 h-4" />
                            Create First Website
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Projects;