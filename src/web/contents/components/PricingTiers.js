// import React from 'react';
// import { DollarSign, Check } from 'lucide-react';

// const PricingTiers = ({ selectedPrice, onPriceSelect }) => {
//   const tiers = [
//     {
//       name: 'bronze',
//       price: 10000,
//       visitorRange: { min: 0, max: 5 },
//       color: 'bg-amber-700',
//       features: ['Basic analytics', 'Standard support']
//     },
//     {
//       name: 'silver',
//       price: 20000,
//       visitorRange: { min: 10000, max: 100000 },
//       color: 'bg-gray-400',
//       features: ['Advanced analytics', 'Priority support']
//     },
//     {
//       name: 'gold',
//       price: 30000,
//       visitorRange: { min: 100000, max: 1000000 },
//       color: 'bg-yellow-500',
//       features: ['Premium analytics', '24/7 support']
//     },
//     {
//       name: 'platinum',
//       price: 30000,
//       visitorRange: { min: 1000000, max: Number.MAX_SAFE_INTEGER },
//       color: 'bg-gray-700',
//       features: ['Enterprise analytics', 'Dedicated support']
//     }
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
//       {tiers.map((tier) => (
//         <div
//           key={tier.name}
//           onClick={() => onPriceSelect({
//             price: tier.price,
//             tier: tier.name,
//             visitorRange: tier.visitorRange
//           })}
//           className={`relative rounded-lg overflow-hidden transition-all duration-300 cursor-pointer
//             ${selectedPrice === tier.price 
//               ? 'ring-2 ring-blue-500 transform scale-105' 
//               : 'hover:shadow-lg hover:-translate-y-1'}`}
//         >
//           <div className={`${tier.color} p-4`}>
//             <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
//             <div className="flex items-center gap-1 text-white">
//               <DollarSign className="w-5 h-5" />
//               <span className="text-sm">RWF</span>
//               <span className="text-1xl font-bold">{tier.price}</span>
//               <span className="text-sm">/month</span>
//             </div>
//           </div>
          
//           <div className="bg-white p-4 space-y-3">
//             <div className="text-sm text-gray-600 font-medium">
//               {tier.visitorRange} monthly visitors
//             </div>
            
//             <div className="space-y-2">
//               {tier.features.map((feature, index) => (
//                 <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
//                   <Check className="w-4 h-4 text-green-500" />
//                   <span>{feature}</span>
//                 </div>
//               ))}
//             </div>
            
//             {selectedPrice === tier.price && (
//               <div className="absolute top-2 right-2">
//                 <div className="bg-blue-500 text-white p-1 rounded-full">
//                   <Check className="w-4 h-4" />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default PricingTiers;

import React from 'react';
import { DollarSign, Check } from 'lucide-react';

const PricingTiers = ({ selectedPrice, onPriceSelect }) => {
  const tiers = [
    {
      name: 'bronze',
      price: 10,
      visitorRange: { min: 0, max: 5 },
      color: 'bg-amber-700',
      features: ['Basic analytics', 'Standard support']
    },
    {
      name: 'silver',
      price: 20,
      visitorRange: { min: 10000, max: 100000 },
      color: 'bg-gray-400',
      features: ['Advanced analytics', 'Priority support']
    },
    {
      name: 'gold',
      price: 30,
      visitorRange: { min: 100000, max: 1000000 },
      color: 'bg-yellow-500',
      features: ['Premium analytics', '24/7 support']
    },
    {
      name: 'platinum',
      price: 50,
      visitorRange: { min: 1000000, max: Number.MAX_SAFE_INTEGER },
      color: 'bg-gray-700',
      features: ['Enterprise analytics', 'Dedicated support']
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          onClick={() => onPriceSelect({
            price: tier.price,
            tier: tier.name,
            visitorRange: tier.visitorRange
          })}
          className={`relative rounded-lg overflow-hidden transition-all duration-300 cursor-pointer
            ${isSelected(tier)
              ? 'ring-2 ring-blue-500 transform scale-105' 
              : 'hover:shadow-lg hover:-translate-y-1'}`}
        >
          <div className={`${tier.color} p-4`}>
            <h3 className="text-xl font-bold text-white mb-2 capitalize">{tier.name}</h3>
            <div className="flex items-center gap-1 text-white">
              <DollarSign className="w-5 h-5" />
              {/* <span className="text-sm">RWF</span> */}
              <span className="text-1xl font-bold">{tier.price}</span>
              <span className="text-sm">/month</span>
            </div>
          </div>
          
          <div className="bg-white p-4 space-y-3">
            <div className="text-sm text-gray-600 font-medium">
              {formatVisitorRange(tier.visitorRange)}
            </div>
            
            <div className="space-y-2">
              {tier.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            {isSelected(tier) && (
              <div className="absolute top-2 right-2">
                <div className="bg-blue-500 text-white p-1 rounded-full">
                  <Check className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PricingTiers;