import React, { useState } from 'react';
import { DollarSign, Check, Crown, Sparkles, Star } from 'lucide-react';

const PricingTiers = ({ selectedPrice, onPriceSelect }) => {
  const [hoveredTier, setHoveredTier] = useState(null);

  const tiers = [
    {
      name: 'bronze',
      price: 10,
      visitorRange: { min: 0, max: 5000 },
      color: 'from-amber-900/30 to-amber-900/10',
      hoverGradient: 'from-amber-600/10 to-amber-500/10',
      iconBg: 'from-amber-600 to-amber-400',
      buttonGradient: 'from-amber-600 to-amber-500',
      buttonHoverGradient: 'from-amber-500 to-amber-400',
      icon: <DollarSign className="text-white" size={24} />,
      features: ['Basic analytics dashboard', 'Standard technical support', 'Up to 5K monthly visitors']
    },
    {
      name: 'silver',
      price: 20,
      visitorRange: { min: 10000, max: 100000 },
      color: 'from-slate-900/30 to-slate-900/10',
      hoverGradient: 'from-slate-600/10 to-slate-500/10',
      iconBg: 'from-slate-600 to-slate-400',
      buttonGradient: 'from-slate-600 to-slate-500',
      buttonHoverGradient: 'from-slate-500 to-slate-400',
      icon: <DollarSign className="text-white" size={24} />,
      features: ['Advanced analytics tracking', 'Priority email support', 'Up to 100K monthly visitors']
    },
    {
      name: 'gold',
      price: 30,
      visitorRange: { min: 100000, max: 1000000 },
      color: 'from-yellow-900/30 to-yellow-900/10',
      hoverGradient: 'from-yellow-600/10 to-yellow-500/10',
      iconBg: 'from-yellow-600 to-yellow-400',
      buttonGradient: 'from-yellow-600 to-yellow-500',
      buttonHoverGradient: 'from-yellow-500 to-yellow-400',
      icon: <DollarSign className="text-white" size={24} />,
      features: ['Premium real-time analytics', '24/7 priority support', 'Up to 1M monthly visitors']
    },
    {
      name: 'platinum',
      price: 50,
      visitorRange: { min: 1000000, max: Number.MAX_SAFE_INTEGER },
      color: 'from-purple-900/30 to-purple-900/10',
      hoverGradient: 'from-purple-600/10 to-purple-500/10',
      iconBg: 'from-purple-600 to-purple-400',
      buttonGradient: 'from-purple-600 to-purple-500',
      buttonHoverGradient: 'from-purple-500 to-purple-400',
      icon: <Crown className="text-white" size={24} />,
      features: ['Enterprise-grade analytics', 'Dedicated account manager', 'Unlimited monthly visitors']
    }
  ];

  const formatVisitorRange = (range) => {
    const formatNumber = (num) => {
      if (num >= 1000000) return `${num / 1000000}M`;
      if (num >= 1000) return `${num / 1000}K`;
      return num.toString();
    };

    if (range.max === Number.MAX_SAFE_INTEGER) {
      return `${formatNumber(range.min)}+ monthly visitors`;
    }
    
    return `${formatNumber(range.min)} - ${formatNumber(range.max)} monthly visitors`;
  };

  const isSelected = (tier) => {
    // Check if selectedPrice is the new format (object with tier)
    if (selectedPrice?.tier) {
      return selectedPrice.tier === tier.name;
    }
    // Fall back to old format (direct price comparison)
    return selectedPrice === tier.price;
  };

  const getPopularTier = () => {
    return tiers.find(tier => tier.name === 'gold');
  };
  
  const popularTier = getPopularTier();
  const getIconComponent = (tierName) => {
    return tierName === 'platinum' ? <Sparkles size={14} /> : <Star size={14} />;
  };

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-6">      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {tiers.map((tier) => {
            const isPopular = tier.name === popularTier.name;
            const isHovered = hoveredTier === tier.name;
            
            return (
              <div
                key={tier.name}
                onClick={() => onPriceSelect({
                  price: tier.price,
                  tier: tier.name,
                  visitorRange: tier.visitorRange
                })}
                onMouseEnter={() => setHoveredTier(tier.name)}
                onMouseLeave={() => setHoveredTier(null)}
                className={`group relative backdrop-blur-md bg-gradient-to-b ${tier.color} rounded-3xl overflow-hidden border border-white/10 transition-all duration-500 cursor-pointer
                  ${isSelected(tier) ? 'transform scale-105 z-10' : ''}
                  ${isPopular ? 'lg:-mt-4 lg:mb-4' : ''}`}
                style={{
                  boxShadow: isHovered ? `0 0 40px rgba(${tier.name === 'bronze' ? '217, 119, 6' : tier.name === 'silver' ? '100, 116, 139' : tier.name === 'gold' ? '202, 138, 4' : '147, 51, 234'}, 0.3)` : '0 0 0 rgba(0, 0, 0, 0)'
                }}
              >
                {isPopular && (
                  <div className="absolute top-0 left-0 right-0 bg-blue-600 text-center text-white text-xs font-medium uppercase tracking-widest py-2 px-4 z-20">
                    Most Popular
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-r ${tier.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                
                <div className="p-10 relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-full bg-${tier.name === 'bronze' ? 'amber' : tier.name === 'silver' ? 'slate' : tier.name === 'gold' ? 'yellow' : 'purple'}-500 blur-md opacity-40`}></div>
                      <div className={`relative p-3 rounded-full bg-gradient-to-r ${tier.iconBg}`}>
                        {tier.icon}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className={`uppercase text-xs font-semibold text-${tier.name === 'bronze' ? 'amber' : tier.name === 'silver' ? 'slate' : tier.name === 'gold' ? 'yellow' : 'purple'}-400 tracking-widest mb-1`}>
                        {tier.name === 'platinum' ? 'Enterprise' : 'Essential'}
                      </div>
                      <h2 className="text-3xl font-bold capitalize">{tier.name}</h2>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center mb-8">
                    <span className="text-sm text-white/70 mr-1">$</span>
                    <span className="text-5xl font-bold">{tier.price}</span>
                    <span className="text-sm text-white/70 ml-1">/month</span>
                  </div>
                  
                  <div className="space-y-4 mb-12">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-white/80">
                        <div className={`w-8 h-8 rounded-full bg-${tier.name === 'bronze' ? 'amber' : tier.name === 'silver' ? 'slate' : tier.name === 'gold' ? 'yellow' : 'purple'}-500/20 flex items-center justify-center mr-3`}>
                          {getIconComponent(tier.name)}
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    className={`w-full group relative h-16 rounded-xl bg-gradient-to-r ${tier.buttonGradient} text-white font-medium overflow-hidden transition-all duration-300`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${tier.buttonHoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    <span className="relative z-10 flex items-center justify-center">
                      {isSelected(tier) ? (
                        <>
                          <Check size={16} className="mr-2" />
                          <span className="uppercase tracking-wider">Selected</span>
                        </>
                      ) : (
                        <span className="uppercase tracking-wider">Select Plan</span>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PricingTiers;




















// import React from 'react';
// import { DollarSign, Check, Crown } from 'lucide-react';

// const PricingTiers = ({ selectedPrice, onPriceSelect }) => {
//   const tiers = [
//     {
//       name: 'bronze',
//       price: 10,
//       visitorRange: { min: 0, max: 5 },
//       color: 'bg-gradient-to-br from-amber-600 to-amber-800',
//       icon: <DollarSign className="w-5 h-5" />,
//       features: ['Basic analytics', 'Standard support']
//     },
//     {
//       name: 'silver',
//       price: 20,
//       visitorRange: { min: 10000, max: 100000 },
//       color: 'bg-gradient-to-br from-gray-300 to-gray-500',
//       icon: <DollarSign className="w-5 h-5" />,
//       features: ['Advanced analytics', 'Priority support']
//     },
//     {
//       name: 'gold',
//       price: 30,
//       visitorRange: { min: 100000, max: 1000000 },
//       color: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
//       icon: <DollarSign className="w-5 h-5" />,
//       features: ['Premium analytics', '24/7 support']
//     },
//     {
//       name: 'platinum',
//       price: 50,
//       visitorRange: { min: 1000000, max: Number.MAX_SAFE_INTEGER },
//       color: 'bg-gradient-to-br from-gray-600 to-gray-900',
//       icon: <Crown className="w-5 h-5" />,
//       features: ['Enterprise analytics', 'Dedicated support']
//     }
//   ];

//   const formatVisitorRange = (range) => {
//     const formatNumber = (num) => {
//       if (num >= 1000000) return `${num / 1000000}M`;
//       if (num >= 1000) return `${num / 1000}K`;
//       return num.toString();
//     };

//     if (range.max === Number.MAX_SAFE_INTEGER) {
//       return `${formatNumber(range.min)}+ monthly visitors`;
//     }
    
//     return `${formatNumber(range.min)} - ${formatNumber(range.max)} monthly visitors`;
//   };

//   const isSelected = (tier) => {
//     // Check if selectedPrice is the new format (object with tier)
//     if (selectedPrice?.tier) {
//       return selectedPrice.tier === tier.name;
//     }
//     // Fall back to old format (direct price comparison)
//     return selectedPrice === tier.price;
//   };

//   const getPopularTier = () => {
//     return tiers.find(tier => tier.name === 'gold');
//   };
  
//   const popularTier = getPopularTier();

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
//       {tiers.map((tier) => {
//         const isPopular = tier.name === popularTier.name;
//         return (
//           <div
//             key={tier.name}
//             onClick={() => onPriceSelect({
//               price: tier.price,
//               tier: tier.name,
//               visitorRange: tier.visitorRange
//             })}
//             className={`relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer
//               group border ${isSelected(tier) 
//                 ? 'ring-2 ring-blue-500 shadow-xl transform scale-105 z-10' 
//                 : 'border-gray-200 hover:shadow-lg hover:-translate-y-2'}
//               ${isPopular ? 'md:-mt-4 md:mb-4' : ''}`}
//           >
//             {isPopular && (
//               <div className="absolute top-0 left-0 right-0 bg-blue-600 text-center text-white text-xs font-bold py-1">
//                 MOST POPULAR
//               </div>
//             )}
            
//             <div className={`${tier.color} p-6 text-center ${isPopular ? 'pt-8' : ''}`}>
//               <h3 className="text-xl font-bold text-white mb-3 capitalize">{tier.name}</h3>
//               <div className="flex items-center justify-center gap-1 text-white">
//                 <span className="text-sm">$</span>
//                 <span className="text-4xl font-bold">{tier.price}</span>
//                 <span className="text-sm self-end mb-1">/month</span>
//               </div>
//             </div>
            
//             <div className="bg-white p-6 space-y-4">
//               <div className="text-sm text-gray-600 font-medium text-center p-2 border-b border-gray-100">
//                 {formatVisitorRange(tier.visitorRange)}
//               </div>
              
//               <div className="space-y-3">
//                 {tier.features.map((feature, index) => (
//                   <div key={index} className="flex items-center gap-3 text-sm text-gray-700">
//                     <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
//                     <span>{feature}</span>
//                   </div>
//                 ))}
//               </div>
              
//               <button 
//                 className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors
//                   ${isSelected(tier)
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'}`}
//               >
//                 {isSelected(tier) ? 'Selected' : 'Select Plan'}
//               </button>
//             </div>
            
//             {isSelected(tier) && (
//               <div className="absolute top-3 right-3">
//                 <div className="bg-blue-500 text-white p-1 rounded-full shadow-md">
//                   <Check className="w-4 h-4" />
//                 </div>
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default PricingTiers;