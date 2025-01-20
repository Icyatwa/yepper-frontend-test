import React from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent } from '../components/card';
import InlineContent from '../../../img/inlineContent.png';

const InlineContentContainer = () => {
  const features = [
    {
      icon: <Check className="w-5 h-5" />,
      point: "Contextually relevant placement",
    },
    {
      icon: <Check className="w-5 h-5" />,
      point: "High reader engagement",
    },
    {
      icon: <Check className="w-5 h-5" />,
      point: "Natural content integration",
    },
    {
      icon: <Check className="w-5 h-5" />,
      point: "Targeted audience reach",
    },
    {
      icon: <Check className="w-5 h-5" />,
      point: "Reduced ad fatigue",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <Card className="max-w-6xl w-full bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative h-full min-h-[400px] bg-gray-900 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-600/90 mix-blend-multiply" />
              <img
                src={InlineContent}
                alt="InlineContent"
                className="w-full h-full object-cover opacity-90"
              />
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Inline Content
                </h1>
                
                <p className="text-gray-600 leading-relaxed mb-8">
                  Advertisements placed within the main text of articles or posts, leveraging readers' engaged state and benefiting from contextual relevance while maintaining natural content flow.
                </p>

                <div className="space-y-6 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg text-blue-600">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {feature.point}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InlineContentContainer;