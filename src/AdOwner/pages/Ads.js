import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Eye, MousePointer, Check, Clock, Globe, Search, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const MixedAds = ({ setLoading }) => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredAds, setFilteredAds] = useState([]);

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

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const formatNumber = (number) => {
        if (number >= 1000 && number < 1000000) {
            return (number / 1000).toFixed(1) + 'K';
        } else if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        }
        return number;
    };

    if (isLoading) return <LoadingSpinner />;
    if (error) return (
        <div style={{ padding: '20px', border: '1px solid #ccc' }}>
            <Clock size={24} />
            <h2>Error Loading Data</h2>
            <p>{error.message}</p>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );

    return (
        <div style={{ padding: '20px' }}>
            {/* Header Section */}
            <div style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '20px' }}>
                <h1>Your Active Campaigns</h1>
                
                {/* Search */}
                <div style={{ margin: '20px 0', border: '1px solid #ccc', padding: '10px' }}>
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        value={searchQuery}
                        onChange={handleSearch}
                        style={{ marginLeft: '10px', padding: '5px', border: '1px solid #ccc' }}
                    />
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span>{filteredAds.length}</span>
                        <span> {searchQuery ? 'Found Campaigns' : 'Active Campaigns'}</span>
                    </div>
                    
                    {/* Filter Buttons */}
                    <div style={{ border: '1px solid #ccc', padding: '5px' }}>
                        {['all', 'approved', 'pending'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                style={{
                                    margin: '0 5px',
                                    padding: '5px 10px',
                                    border: selectedFilter === filter ? '2px solid #000' : '1px solid #ccc'
                                }}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Switch Button */}
                    <button 
                        onClick={() => navigate('/projects')}
                        style={{ padding: '10px', border: '1px solid #ccc' }}
                    >
                        <Globe size={16} />
                        Switch to Projects
                    </button>
                </div>
            </div>
            
            {/* Campaigns Grid */}
            {filteredAds.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {filteredAds.slice().reverse().map((ad, index) => {
                        const isApproved = ad.websiteSelections.some(ws => ws.approved);
                        const isPending = ad.websiteSelections.some(ws => !ws.approved);
                        
                        return (
                            <div 
                                key={ad._id || index}
                                style={{ border: '2px solid #ddd', padding: '15px' }}
                            >
                                {/* Media Section */}
                                <div style={{ height: '200px', border: '1px solid #ccc', marginBottom: '15px' }}>
                                    {ad.videoUrl ? (
                                        <video 
                                            autoPlay 
                                            loop 
                                            muted 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        >
                                            <source src={ad.videoUrl} type="video/mp4" />
                                        </video>
                                    ) : (
                                        <img 
                                            src={ad.imageUrl} 
                                            alt={ad.businessName}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    )}
                                </div>
                                
                                {/* Content */}
                                <div style={{ border: '1px solid #eee', padding: '10px' }}>
                                    {/* Status & Title */}
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                        <div style={{ marginRight: '10px' }}>
                                            {isApproved && !isPending ? <Check size={20} /> : <Clock size={20} />}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px' }}>
                                                {isApproved && !isPending ? 'Active' : isPending && isApproved ? 'Partially Active' : 'Pending'}
                                            </div>
                                            <h3>{ad.businessName}</h3>
                                        </div>
                                    </div>
                                    
                                    {/* Website Selections */}
                                    <div style={{ border: '1px solid #eee', padding: '10px', marginBottom: '15px' }}>
                                        {ad.websiteSelections.map((selection, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Globe size={14} style={{ marginRight: '5px' }} />
                                                    <span>{selection.websiteId.websiteName}</span>
                                                </div>
                                                <span style={{ fontSize: '12px', border: '1px solid #ccc', padding: '2px 5px' }}>
                                                    {selection.approved ? 'Approved' : 'Pending'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Stats */}
                                    {isApproved && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', border: '1px solid #eee', padding: '10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Eye size={14} style={{ marginRight: '5px' }} />
                                                <div>
                                                    <div style={{ fontSize: '10px' }}>Views</div>
                                                    <div>{formatNumber(ad.views)}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <MousePointer size={14} style={{ marginRight: '5px' }} />
                                                <div>
                                                    <div style={{ fontSize: '10px' }}>Clicks</div>
                                                    <div>{formatNumber(ad.clicks)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Action Button */}
                                    <Link
                                        to={`/ad-details/${ad._id}`}
                                        style={{ 
                                            display: 'block', 
                                            padding: '10px', 
                                            border: '2px solid #000', 
                                            textAlign: 'center', 
                                            textDecoration: 'none', 
                                            color: 'black' 
                                        }}
                                    >
                                        View Campaign <ChevronRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ border: '2px solid #ddd', padding: '40px', textAlign: 'center' }}>
                    <Clock size={32} />
                    <h2>{searchQuery ? 'No Campaigns Found' : 'No Active Campaigns Yet'}</h2>
                    <p>
                        {searchQuery 
                            ? 'No campaigns match your current search criteria.'
                            : 'Start creating your first campaign.'
                        }
                    </p>
                    <Link 
                        to="/select"
                        style={{ 
                            display: 'inline-block', 
                            padding: '15px 20px', 
                            border: '2px solid #000', 
                            textDecoration: 'none', 
                            color: 'black', 
                            marginTop: '20px' 
                        }}
                    >
                        <Plus size={18} /> Create Your First Campaign
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MixedAds;