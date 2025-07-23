// PricingTiers.js
import React, { useState, useEffect } from 'react';
import { DollarSign, Users, TrendingUp, Info, Check } from 'lucide-react';

const PricingTiers = ({ selectedPrice, onPriceSelect }) => {
  const [customPrice, setCustomPrice] = useState(selectedPrice?.price || '');
  const [customVisitors, setCustomVisitors] = useState(selectedPrice?.visitors || '');
  const [errors, setErrors] = useState({});

  // Update local state when selectedPrice changes
  useEffect(() => {
    if (selectedPrice?.price) setCustomPrice(selectedPrice.price);
    if (selectedPrice?.visitors) setCustomVisitors(selectedPrice.visitors);
  }, [selectedPrice]);

  const formatNumber = (num) => {
    if (!num) return '';
    const number = parseInt(num.toString().replace(/,/g, ''));
    return number.toLocaleString();
  };

  const validateInputs = () => {
    const newErrors = {};
    
    if (!customPrice || customPrice <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    
    if (!customVisitors || customVisitors <= 0) {
      newErrors.visitors = 'Please enter expected visitor count';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomPrice(value);
    if (errors.price) {
      setErrors(prev => ({ ...prev, price: null }));
    }
  };

  const handleVisitorsChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomVisitors(value);
    if (errors.visitors) {
      setErrors(prev => ({ ...prev, visitors: null }));
    }
  };

  // Map visitor count to backend tier system
  const getTierFromVisitors = (visitors) => {
    const visitorCount = parseInt(visitors) || 0;
    if (visitorCount <= 5000) return 'bronze';
    if (visitorCount <= 25000) return 'silver';
    if (visitorCount <= 100000) return 'gold';
    return 'platinum';
  };

  // Get display tier name
  const getDisplayTier = (visitors) => {
    const visitorCount = parseInt(visitors) || 0;
    if (visitorCount <= 5000) return 'Bronze (Starter)';
    if (visitorCount <= 25000) return 'Silver (Growth)';
    if (visitorCount <= 100000) return 'Gold (Professional)';
    return 'Platinum (Enterprise)';
  };

  const handleSave = () => {
    if (validateInputs()) {
      const visitors = parseInt(customVisitors);
      const tier = getTierFromVisitors(visitors);
      
      onPriceSelect({
        price: parseInt(customPrice),
        visitors: visitors,
        tier: tier,
        visitorRange: {
          min: Math.max(0, visitors - 1000),
          max: visitors + 1000
        }
      });
    }
  };

  const getPricePerVisitor = () => {
    if (!customPrice || !customVisitors) return 0;
    return (parseInt(customPrice) / parseInt(customVisitors) * 1000).toFixed(4);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Set Your Custom Pricing</h3>
        <p className="text-white/70">Define your monthly price and expected visitor traffic</p>
      </div>

      {/* Main Input Card */}
      <div className="backdrop-blur-md bg-gradient-to-br from-slate-900/40 to-slate-800/40 rounded-2xl border border-white/10 p-8 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price Input */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-white/90">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-400" />
              </div>
              Monthly Price
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
                <span className="text-xl font-bold text-white/80">$</span>
              </div>
              <input
                type="text"
                value={customPrice ? formatNumber(customPrice) : ''}
                onChange={handlePriceChange}
                placeholder="0"
                className={`w-full h-14 pl-10 pr-4 bg-white/5 border rounded-xl text-white text-xl font-semibold focus:outline-none focus:ring-2 transition-all ${
                  errors.price 
                    ? 'border-red-500 focus:ring-red-500/50' 
                    : 'border-white/20 focus:border-green-500 focus:ring-green-500/50'
                }`}
              />
            </div>
            {errors.price && (
              <p className="text-red-400 text-sm flex items-center gap-1">
                <Info className="w-4 h-4" />
                {errors.price}
              </p>
            )}
          </div>

          {/* Visitors Input */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-white/90">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              Monthly Visitors
            </label>
            <div className="relative">
              <input
                type="text"
                value={customVisitors ? formatNumber(customVisitors) : ''}
                onChange={handleVisitorsChange}
                placeholder="10,000"
                className={`w-full h-14 px-4 bg-white/5 border rounded-xl text-white text-xl font-semibold focus:outline-none focus:ring-2 transition-all ${
                  errors.visitors 
                    ? 'border-red-500 focus:ring-red-500/50' 
                    : 'border-white/20 focus:border-blue-500 focus:ring-blue-500/50'
                }`}
              />
            </div>
            {errors.visitors && (
              <p className="text-red-400 text-sm flex items-center gap-1">
                <Info className="w-4 h-4" />
                {errors.visitors}
              </p>
            )}
          </div>
        </div>

        {/* Analytics Section */}
        {customPrice && customVisitors && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-white/70">Cost Per 1K Visitors</span>
                </div>
                <div className="text-lg font-bold text-purple-400">
                  ${getPricePerVisitor()}
                </div>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white/70">Tier Assignment</span>
                </div>
                <div className="text-lg font-bold text-green-400">
                  {getDisplayTier(customVisitors)}
                </div>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-white/70">Annual Value</span>
                </div>
                <div className="text-lg font-bold text-yellow-400">
                  ${formatNumber(parseInt(customPrice) * 12)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSave}
            disabled={!customPrice || !customVisitors}
            className={`group relative h-14 px-8 rounded-xl font-medium overflow-hidden transition-all duration-300 ${
              customPrice && customVisitors
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500 transform hover:scale-105'
                : 'bg-white/10 text-white/50 cursor-not-allowed'
            }`}
          >
            <div className="relative z-10 flex items-center justify-center">
              <Check className="w-5 h-5 mr-2" />
              <span className="uppercase tracking-wider">Save Custom Pricing</span>
            </div>
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-blue-400" />
            <span className="font-medium text-blue-400">Tier System</span>
          </div>
          <p className="text-white/70">
            Tiers are automatically assigned based on visitor count: Bronze (≤5K), Silver (≤25K), Gold (≤100K), Platinum (100K+)
          </p>
        </div>
        
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="font-medium text-purple-400">Traffic Quality</span>
          </div>
          <p className="text-white/70">
            Quality engagement matters more than raw numbers. Targeted traffic often converts better for advertisers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingTiers;