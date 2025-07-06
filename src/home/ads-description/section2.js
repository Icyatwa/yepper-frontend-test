// Section2.js
import React from 'react';
import { Upload, Building, Globe, List, Layers, Eye } from 'lucide-react';

function Section2() {
  const steps = [
    {
      icon: Upload,
      title: "Ad Selection",
      description: "Choose from a variety of ad formats tailored to your campaign goals."
    },
    {
      icon: Building,
      title: "Business Information",
      description: "Provide key details about your business and target audience."
    },
    {
      icon: Globe,
      title: "Website Selection",
      description: "Select from our network of high-performing websites."
    },
    {
      icon: Layers,
      title: "Ad Spaces",
      description: "Pick optimal ad placements for maximum visibility."
    },
  ];

  return (
    <div className="py-24">
      <h2 className="text-center text-5xl font-bold mb-6 tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          How It Works
        </span>
      </h2>
      
      <p className="text-center text-white/70 max-w-2xl mx-auto text-lg mb-16">
        Our streamlined process ensures your ads reach the right audience at the right time.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <div 
            key={index}
            className="group relative backdrop-blur-md bg-gradient-to-b from-blue-900/30 to-blue-900/10 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
            
            <div className="p-8 relative z-10 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40"></div>
                <div className="relative p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                  <step.icon className="text-white" size={24} />
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-white/70">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Section2;