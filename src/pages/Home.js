// Home.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ChevronRight, Eye, MousePointer, Check, Clock, Globe, Search, Plus } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
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
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAds, setFilteredAds] = useState([]);
  const [filteredWebsites, setFilteredWebsites] = useState([]);

  const authenticatedAxios = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const { data: mixedAds, isLoading, error, refetch } = useQuery({
    queryKey: ['mixedAds', user?._id || user?.id],
    queryFn: async () => {
      try {
        const userId = user?._id || user?.id;
        const response = await authenticatedAxios.get(`/web-advertise/mixed/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching Ads:', error.response?.data || error.message);
        throw error;
      }
    },
    enabled: !!(user?._id || user?.id) && !!token,
    onSuccess: (data) => {
      setFilteredAds(data);
    }
  });

  const { data: websites } = useQuery({
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

  useEffect(() => {
    if (!mixedAds) return;

    const performSearch = () => {
      const query = searchQuery.toLowerCase().trim();
      const statusFiltered = selectedFilter === 'all' 
        ? mixedAds 
        : mixedAds.filter(ad => ad.websiteSelections.some(ws => 
          selectedFilter === 'approved' ? ws.approved : !ws.approved
        ));

      if (!query) {
        setFilteredAds(statusFiltered);
        return;
      }

      const searched = statusFiltered.filter(ad => {
        const searchFields = [
          ad.businessName?.toLowerCase(),
          ad.adDescription?.toLowerCase(),
          ...ad.websiteSelections.map(ws => ws.websiteId?.websiteName?.toLowerCase())
        ];
        return searchFields.some(field => field?.includes(query));
      });
      
      setFilteredAds(searched);
    };

    performSearch();
  }, [searchQuery, selectedFilter, mixedAds]);

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

  if (error) return (
      <div style={{ padding: '20px', border: '1px solid #ccc' }}>
          <Clock size={24} />
          <h2>Error Loading Data</h2>
          <p>{error.message}</p>
          <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Grid cols={2} gap={8} className="max-w-4xl mx-auto flex items-start justify-center py-8">
          {/* Left Column - Website Section */}
          <div className="flex flex-col items-center space-y-6">
            <Link to='/create-website' className="w-full">
              <Button 
                variant="primary" 
                size="lg" 
                className="h-16 w-full flex items-center justify-center space-x-4 focus:outline-none focus:ring-0 min-h-[4rem]"
              >
                <ArrowLeft />
                <span className="text-center leading-tight">Run Ads on your Website</span>
              </Button>
            </Link>
            
            {/* Websites Preview Box - Browser/Network Design */}
            <div className="w-80">
              {filteredWebsites.length > 0 ? (
                <Link to="/websites">
                  <div className="relative cursor-pointer group">
                    {/* Main container with browser-like design */}
                    <div className="relative bg-gradient-to-br from-green-50 via-white to-teal-50 border border-green-200/60 rounded-xl p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(34,_197,_94,_0.15)] group-hover:border-green-300/80">
                      
                      {/* Network glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-teal-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      
                      {/* Network connection lines */}
                      <div className="absolute inset-0 overflow-hidden rounded-2xl">
                        <svg className="absolute inset-0 w-full h-full opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                          <path d="M20,20 Q50,10 80,30 T140,25" stroke="url(#greenGradient)" strokeWidth="1" fill="none" className="animate-pulse" />
                          <path d="M30,60 Q70,45 110,65 T170,55" stroke="url(#tealGradient)" strokeWidth="1" fill="none" className="animate-pulse delay-300" />
                          <defs>
                            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#14b8a6" />
                            </linearGradient>
                            <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#14b8a6" />
                              <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>

                      {/* Browser-like container with connected websites */}
                      <div className="relative h-32 overflow-hidden rounded-lg bg-gradient-to-br from-green-100/50 to-teal-100/30 border border-green-200/40 shadow-inner">
                        
                        {/* Browser chrome bar */}
                        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-green-200 to-teal-200 border-b border-green-300/30 flex items-center px-2">
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                          </div>
                        </div>
                        
                        {/* Connected website nodes */}
                        {filteredWebsites.slice(0, 4).map((website, index) => {
                          // Network-style positions for connected nodes
                          const positions = [
                            { x: 12, y: 15, rotate: 0, scale: 1 },
                            { x: 52, y: 12, rotate: 5, scale: 0.9 },
                            { x: 15, y: 55, rotate: -3, scale: 0.95 },
                            { x: 55, y: 52, rotate: 8, scale: 0.85 }
                          ];
                          
                          const pos = positions[index];
                          
                          // Green/teal themed gradients
                          const gradients = [
                            'from-green-500 to-emerald-500',
                            'from-teal-500 to-cyan-500', 
                            'from-emerald-500 to-green-600',
                            'from-cyan-500 to-teal-600'
                          ];

                          const shadowColors = [
                            'shadow-green-500/25',
                            'shadow-teal-500/25',
                            'shadow-emerald-500/25', 
                            'shadow-cyan-500/25'
                          ];

                          return (
                            <div key={website._id || index}>
                              {/* Connection lines to center */}
                              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                <line
                                  x1="50%"
                                  y1="50%"
                                  x2={`${pos.x + 8}%`}
                                  y2={`${pos.y + 12}%`}
                                  stroke="url(#connectionGradient)"
                                  strokeWidth="1"
                                  opacity="0.3"
                                  className="group-hover:opacity-60 transition-opacity duration-500"
                                />
                                <defs>
                                  <linearGradient id="connectionGradient">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#14b8a6" />
                                  </linearGradient>
                                </defs>
                              </svg>
                              
                              {/* Website node */}
                              <div
                                className="absolute w-20 h-16 transition-all duration-700 group-hover:duration-500"
                                style={{
                                  left: `${pos.x}%`,
                                  top: `${pos.y}%`,
                                  transform: `rotate(${pos.rotate}deg) scale(${pos.scale})`,
                                  zIndex: 4 - index,
                                }}
                              >
                                {/* Node glow */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${gradients[index]} rounded-lg blur-sm opacity-0 group-hover:opacity-40 transition-opacity duration-500`}></div>
                                
                                {/* Website card - browser window style */}
                                <div className={`relative bg-white rounded-md overflow-hidden shadow-lg ${shadowColors[index]} border border-white/20 group-hover:shadow-xl transition-all duration-500 hover:scale-110`}>
                                  
                                  {/* Mini browser bar */}
                                  <div className={`h-1.5 bg-gradient-to-r ${gradients[index]} flex items-center px-1`}>
                                    <div className="w-0.5 h-0.5 bg-white/60 rounded-full"></div>
                                  </div>
                                  
                                  <div className="p-1.5 h-full flex flex-col">
                                    {/* Website preview */}
                                    <div className="w-full h-6 overflow-hidden rounded-sm mb-1.5 bg-gradient-to-br from-slate-100 to-slate-200 relative">
                                      {website.imageUrl ? (
                                        <img 
                                          src={website.imageUrl} 
                                          alt={website.websiteName}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <Globe size={12} className="text-slate-400" />
                                        </div>
                                      )}
                                      {/* Online status indicator */}
                                      <div className={`absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-gradient-to-r ${gradients[index]} rounded-full animate-pulse`}></div>
                                    </div>
                                    
                                    {/* Website name */}
                                    <div className="flex-1 flex flex-col justify-center">
                                      <div className="text-[8px] font-semibold text-gray-700 text-center leading-tight truncate px-0.5">
                                        {website.websiteName || 'Unnamed Website'}
                                      </div>
                                      {/* URL indicator */}
                                      <div className="h-0.5 bg-slate-300 rounded-full w-3/4 mx-auto mt-0.5"></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* Central hub node */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4">
                          <div className="w-full h-full bg-gradient-to-r from-green-400 to-teal-400 rounded-full shadow-lg animate-pulse border-2 border-white group-hover:scale-125 transition-transform duration-500"></div>
                        </div>
                        
                        {/* More websites indicator */}
                        {filteredWebsites.length > 4 && (
                          <div className="absolute bottom-1 right-1 w-5 h-3 bg-white/90 backdrop-blur-sm rounded border border-green-200/60 flex items-center justify-center shadow-sm">
                            <span className="text-[7px] font-bold text-green-600">+{filteredWebsites.length - 4}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Action footer with network theme */}
                      <div className="relative mt-3 flex items-center justify-center">
                        <div className="flex items-center space-x-1 bg-gradient-to-r from-green-50 to-teal-50 rounded-full px-3 py-1.5 border border-green-100/50">
                          <span className="text-xs font-semibold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                            Websites
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Network reflection effect */}
                    <div className="absolute inset-x-0 -bottom-8 h-8 bg-gradient-to-t from-green-200/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </Link>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                    <Globe size={24} className="text-green-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">{searchQuery ? 'No Websites Found' : 'No Websites Yet'}</h3>
                  <p className="text-sm text-gray-600">
                    {searchQuery 
                      ? 'No websites match your search criteria.'
                      : 'Start adding your first website.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Ads Section */}
          <div className="flex flex-col items-center space-y-6">
            <Link to="/upload-ad" className="w-full">
              <Button 
                variant="primary" 
                size="lg" 
                className="h-16 w-full flex items-center justify-center space-x-4 focus:outline-none focus:ring-0 min-h-[4rem]"
              >
                <span className="text-center leading-tight">Advertise your Product Online</span>
                <ArrowRight />
              </Button>
            </Link>
            
            {/* Ads Preview Box - Original Design */}
            <div className="w-80">
              {filteredAds.length > 0 ? (
                <Link to="/ads">
                  <div className="relative cursor-pointer group">
                    {/* Main container with 3D effect */}
                    <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100 border border-slate-200/60 rounded-xl p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] group-hover:border-blue-200/80 perspective-1000">
                      
                      {/* Ambient glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      
                      {/* Floating particles effect */}
                      <div className="absolute inset-0 overflow-hidden rounded-2xl">
                        <div className="absolute top-4 right-6 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
                        <div className="absolute top-12 left-8 w-1 h-1 bg-purple-400/40 rounded-full animate-ping"></div>
                        <div className="absolute bottom-8 right-12 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-pulse delay-300"></div>
                      </div>
                      
                      {/* 3D Box container with scattered ads */}
                      <div className="relative h-24 overflow-hidden rounded-lg bg-gradient-to-br from-slate-100/50 to-slate-200/30 border border-slate-200/40 shadow-inner">
                        
                        {/* Box depth effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-300/20 to-transparent"></div>
                        
                        {/* Scattered ad documents */}
                        {filteredAds.slice(0, 4).map((ad, index) => {
                          // Randomized positions and rotations for unorganized look
                          const positions = [
                            { x: 15, y: 10, rotate: -8, scale: 1 },
                            { x: 45, y: 25, rotate: 12, scale: 0.95 },
                            { x: 25, y: 45, rotate: -15, scale: 0.9 },
                            { x: 60, y: 15, rotate: 6, scale: 0.85 }
                          ];
                          
                          const pos = positions[index];
                          
                          // Meta-style gradient colors
                          const gradients = [
                            'from-blue-500 to-blue-600',
                            'from-purple-500 to-indigo-600', 
                            'from-pink-500 to-rose-600',
                            'from-orange-500 to-red-600'
                          ];

                          const shadowColors = [
                            'shadow-blue-500/25',
                            'shadow-purple-500/25',
                            'shadow-pink-500/25', 
                            'shadow-orange-500/25'
                          ];

                          return (
                            <div
                              key={ad._id || index}
                              className="absolute w-16 h-12 transition-all duration-700 group-hover:duration-500"
                              style={{
                                left: `${pos.x}%`,
                                top: `${pos.y}%`,
                                transform: `rotate(${pos.rotate}deg) scale(${pos.scale})`,
                                zIndex: 4 - index,
                                transformStyle: 'preserve-3d'
                              }}
                            >
                              {/* Glowing aura */}
                              <div className={`absolute inset-0 bg-gradient-to-r ${gradients[index]} rounded-lg blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                              
                              {/* Document card */}
                              <div className={`relative bg-white rounded-lg overflow-hidden shadow-lg ${shadowColors[index]} border border-white/20 group-hover:shadow-xl transition-all duration-500 hover:scale-105 hover:rotate-0`}>
                                
                                {/* Gradient header bar */}
                                <div className={`h-1.5 bg-gradient-to-r ${gradients[index]}`}></div>
                                
                                <div className="p-1 h-full flex flex-col">
                                  {/* Mini media preview */}
                                  <div className="w-full h-4 overflow-hidden rounded mb-1 bg-slate-100">
                                    {ad.videoUrl ? (
                                      <video 
                                        muted 
                                        className="w-full h-full object-cover"
                                      >
                                        <source src={ad.videoUrl} type="video/mp4" />
                                      </video>
                                    ) : (
                                      <img 
                                        src={ad.imageUrl} 
                                        alt={ad.businessName}
                                        className="w-full h-full object-cover"
                                      />
                                    )}
                                  </div>
                                  
                                  {/* Content lines */}
                                  <div className="flex-1 space-y-0.5">
                                    <div className="h-1 bg-slate-200 rounded-full w-3/4"></div>
                                    <div className="h-0.5 bg-slate-100 rounded-full w-1/2"></div>
                                  </div>
                                  
                                  {/* Status indicator */}
                                  <div className="flex items-center justify-between mt-0.5">
                                    <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${gradients[index]}`}></div>
                                    <div className="text-[6px] text-slate-400 font-medium">
                                      {ad.websiteSelections?.length || 0}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* More documents indicator */}
                        {filteredAds.length > 4 && (
                          <div className="absolute bottom-2 right-2 w-6 h-4 bg-white/80 backdrop-blur-sm rounded border border-slate-200/60 flex items-center justify-center shadow-sm">
                            <span className="text-[8px] font-bold text-slate-600">+{filteredAds.length - 4}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Meta-style action footer */}
                      <div className="relative mt-3 flex items-center justify-center">
                        <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-3 py-1.5 border border-blue-100/50">
                          <span className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Your Ads
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Subtle reflection effect */}
                    <div className="absolute inset-x-0 -bottom-8 h-8 bg-gradient-to-t from-slate-200/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </Link>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                    <Clock size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">{searchQuery ? 'No Campaigns Found' : 'No Active Campaigns Yet'}</h3>
                  <p className="text-sm text-gray-600">
                    {searchQuery 
                      ? 'No campaigns match your current search criteria.'
                      : 'Start creating your first campaign.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </Grid>
      </div>
    </>
  );
};

export default Home;