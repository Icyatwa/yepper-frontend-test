import React, { useState } from 'react';
import { Edit3, Target, Shield, BarChart2, Star } from 'lucide-react';

const ServiceCard = ({ icon: Icon, title, description, alignment, color }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`group relative backdrop-blur-md bg-gradient-to-b ${
        color === 'blue' 
          ? 'from-blue-900/30 to-blue-900/10' 
          : 'from-orange-900/30 to-orange-900/10'
      } rounded-3xl overflow-hidden border border-white/10 transition-all duration-500`}
      style={{
        boxShadow: isHovered && color !== 'blue' 
          ? '0 0 40px rgba(249, 115, 22, 0.3)' 
          : isHovered && color === 'blue'
          ? '0 0 40px rgba(59, 130, 246, 0.3)'
          : '0 0 0 rgba(0, 0, 0, 0)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`absolute inset-0 bg-gradient-to-r ${
          color === 'blue' 
            ? 'from-blue-600/10 to-indigo-600/10' 
            : 'from-orange-600/10 to-rose-600/10'
        } opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0`}
      >
      </div>
      
      <div className="p-10 relative z-10">
        <div className="flex items-center mb-8">
          <div className="relative">
            <div className={`absolute inset-0 rounded-full ${
              color === 'blue' ? 'bg-blue-500' : 'bg-orange-500'
            } blur-md opacity-40`}></div>
            <div className={`relative p-3 rounded-full bg-gradient-to-r ${
              color === 'blue' ? 'from-blue-600 to-blue-400' : 'from-orange-600 to-orange-400'
            }`}>
              <Icon className="text-white" size={24} />
            </div>
          </div>
          <div className="ml-4">
            <h2 className="text-3xl font-bold">{title}</h2>
          </div>
        </div>
        
        <p className="text-white/70 mb-8">
          {description}
        </p>
        
        <div className="space-y-4 mb-12">
          {alignment.split('. ').filter(sentence => sentence.trim().length > 0).map((sentence, idx) => (
            <div key={idx} className="flex items-center text-white/80">
              <div className={`w-8 h-8 rounded-full ${
                color === 'blue' ? 'bg-blue-500/20' : 'bg-orange-500/20'
              } flex items-center justify-center mr-3`}>
                {color === 'blue' 
                  ? <Edit3 size={14} className="text-blue-400" />
                  : <Star size={14} className="text-orange-400" />
                }
              </div>
              <span>{sentence}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Section1 = () => {
  const services = [
    {
      icon: Edit3,
      title: "Flexible Ad Spaces",
      description:
        "Yepper provides diverse advertising spaces tailored to different industries and audiences. From banners to widgets and full-page takeovers, we cater to website owners looking to monetize their platforms.",
      alignment:
        "By offering flexible spaces, we ensure advertisers and publishers connect seamlessly. Creating engaging ad experiences. Enhancing user interaction through design.",
      color: "blue"
    },
    {
      icon: Target,
      title: "Categorized Placements",
      description:
        "Our sophisticated categorization system ensures precise targeting and relevance. Each ad space is carefully classified based on industry, audience demographics, and content type.",
      alignment:
        "Supporting our mission of providing 'unboring' spaces. Focusing on relevance in advertising. Enabling optimal matches between advertisers and publishers.",
      color: "orange"
    },
    {
      icon: Shield,
      title: "Transparent Approval",
      description:
        "Experience a streamlined workflow with our transparent approval and payment system. Our platform facilitates clear communication between parties and ensures secure, timely transactions.",
      alignment:
        "Transparency ensures trust between parties. Reinforcing Yepper as the go-to platform. Providing professional and stress-free solutions.",
      color: "blue"
    },
    {
      icon: BarChart2,
      title: "Data-Driven Insights",
      description:
        "Access comprehensive analytics and performance metrics to optimize your advertising strategy. Our platform provides real-time data visualization and detailed reporting tools for informed decision-making.",
      alignment:
        "Empowering both parties to refine strategies. Achieving success through measurement. Fulfilling our vision of impactful advertising.",
      color: "orange"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {services.map((service, index) => (
        <ServiceCard key={index} {...service} />
      ))}
    </div>
  );
};

export default Section1;