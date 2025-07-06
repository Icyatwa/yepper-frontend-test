import React from 'react';
import { DollarSign, Crown, Sparkles, Star } from 'lucide-react';
import Header from '../components/description-header';

const Pricing = ({ selectedPrice, onPriceSelect }) => {
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
  
  const getIconComponent = (tierName) => {
    return tierName === 'platinum' ? <Sparkles size={14} /> : <Star size={14} />;
  };

  return (
    <div className="min-h-screen bg-black text-white">
        <Header />
        
        <div className="max-w-7xl mx-auto px-6 py-20">
            
            <div className="flex items-center justify-center mb-6">
                <div className="h-px w-12 bg-blue-500 mr-6"></div>
                <span className="text-blue-400 text-sm font-medium uppercase tracking-widest">Yepper Platform</span>
                <div className="h-px w-12 bg-blue-500 ml-6"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {tiers.map((tier) => {
                return (
                <div
                    key={tier.name}
                    className={`group relative backdrop-blur-md bg-gradient-to-b ${tier.color} rounded-3xl overflow-hidden border border-white/10 transition-all duration-500 cursor-pointer`}
                >
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
                    </div>
                </div>
                );
            })}
            </div>
        </div>
    </div>
  );
};

export default Pricing;