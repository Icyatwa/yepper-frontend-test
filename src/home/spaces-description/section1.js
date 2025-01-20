import React from 'react';
import { Edit3, Target, Shield, BarChart2 } from 'lucide-react';

const ServiceCard = ({ icon: Icon, title, description, alignment }) => (
  <div className="group bg-white backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">
    <div className='flex flex-col items-start space-y-6'>
      <div className='flex items-center w-full'>
        <div className="bg-red-100 text-[#FF4500] p-2 md:p-3 rounded-lg md:rounded-xl mr-3 md:mr-4">
          <Icon />
        </div>
        <h3 className="text-xl font-bold text-blue-950">
          {title}
        </h3>
      </div>
      <div className="bg-gray-50 p-6 rounded-xl w-full">
        <p className="text-gray-600 leading-relaxed text-left">
          {description}
        </p>
        <div className="py-4">
          <p className="text-gray-600 leading-relaxed text-left relative inline-block">
            <span className="text-xs sm:text-sm text-gray-700 font-semibold">Goal Alignment:</span>{' '}
            {alignment}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const Section1 = () => {
  const services = [
    {
      icon: Edit3,
      title: "Flexible Advertising Spaces",
      description:
        "Yepper provides diverse advertising spaces tailored to different industries and audiences. From banners to widgets and full-page takeovers, we cater to website owners looking to monetize their platforms and advertisers seeking effective ad placements.",
      alignment:
        "By offering flexible and customizable spaces, we ensure advertisers and publishers connect seamlessly, creating engaging ad experiences.",
    },
    {
      icon: Target,
      title: "Categorized Ad Placements",
      description:
        "Our sophisticated categorization system ensures precise targeting and relevance. Each ad space is carefully classified based on industry, audience demographics, and content type, enabling optimal matches between advertisers and publishers.",
      alignment:
        "This categorization supports our mission of providing 'unboring' spaces, focusing on relevance and creativity in advertising.",
    },
    {
      icon: Shield,
      title: "Transparent Approval and Payment Process",
      description:
        "Experience a streamlined workflow with our transparent approval and payment system. Our platform facilitates clear communication between parties and ensures secure, timely transactions for all advertising arrangements.",
      alignment:
        "Transparency and efficiency ensure trust, reinforcing Yepper as the go-to platform for professional and stress-free advertising solutions.",
    },
    {
      icon: BarChart2,
      title: "Data-Driven Insights",
      description:
        "Access comprehensive analytics and performance metrics to optimize your advertising strategy. Our platform provides real-time data visualization and detailed reporting tools for informed decision-making.",
      alignment:
        "With data-driven insights, we empower both parties to refine their strategies and achieve success, fulfilling our vision of impactful and creative advertising.",
    },
  ];

  return (
    <div className="flex items-center py-16">
      <div className="max-w-6xl w-full mx-auto px-4">
        <div className="flex flex-col gap-12 items-center text-center">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-950 mb-4 relative inline-block">
              <span className="relative inline-block text-blue-600 font-bold">
                Collaborative
                <span className="absolute left-0 bottom-[-6px] w-full h-[6px] bg-blue-100 z-[-1]"></span>
              </span>{' '}
              Advertising Reimagined
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-8 w-full max-w-5xl">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section1;
