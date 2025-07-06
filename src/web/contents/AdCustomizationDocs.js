import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, Code, Palette, Layout, Smartphone, Monitor, Moon, Sun } from 'lucide-react';

const AdCustomizationDocs = () => {
  const [copiedText, setCopiedText] = useState('');
  const [expandedSections, setExpandedSections] = useState({});

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const CodeBlock = ({ code, label }) => (
    <div className="relative bg-gray-900 rounded-lg p-4 border border-gray-700">
      <button
        onClick={() => copyToClipboard(code, label)}
        className="absolute top-2 right-2 p-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
      >
        {copiedText === label ? (
          <Check size={16} className="text-green-400" />
        ) : (
          <Copy size={16} className="text-gray-400" />
        )}
      </button>
      <pre className="text-sm text-gray-300 overflow-x-auto pr-12">
        <code>{code}</code>
      </pre>
    </div>
  );

  const classCategories = [
    {
      title: "Main Container Classes",
      icon: <Layout className="w-5 h-5" />,
      classes: [
        {
          name: ".yepper-ad-wrapper",
          description: "Main wrapper for the entire ad block",
          usage: "Controls overall spacing and layout"
        },
        {
          name: ".yepper-ad-container", 
          description: "Inner container for ad content",
          usage: "Handles width, centering, and border radius"
        },
        {
          name: ".yepper-ad-item",
          description: "Individual ad card with glass morphism effect",
          usage: "Main styling for each ad including hover effects"
        }
      ]
    },
    {
      title: "Header & Badge Classes",
      icon: <Code className="w-5 h-5" />,
      classes: [
        {
          name: ".yepper-ad-header",
          description: "Top header section with branding",
          usage: "Contains 'Ad by Yepper' text and sponsored badge"
        },
        {
          name: ".yepper-ad-header-logo",
          description: "Yepper branding text",
          usage: "Logo/brand text styling"
        },
        {
          name: ".yepper-ad-header-badge",
          description: "Sponsored/Ad badge",
          usage: "Small badge indicating advertisement"
        }
      ]
    },
    {
      title: "Content Classes",
      icon: <Palette className="w-5 h-5" />,
      classes: [
        {
          name: ".yepper-ad-content",
          description: "Main content area of the ad",
          usage: "Contains image, title, description, and CTA"
        },
        {
          name: ".yepper-ad-image-wrapper",
          description: "Container for ad image",
          usage: "Image container with glass effect and aspect ratio"
        },
        {
          name: ".yepper-ad-image",
          description: "The actual ad image",
          usage: "Image styling with hover zoom effect"
        },
        {
          name: ".yepper-ad-business-name",
          description: "Business/ad title",
          usage: "Main heading of the advertisement"
        },
        {
          name: ".yepper-ad-description",
          description: "Ad description text",
          usage: "Supporting text below the title"
        },
        {
          name: ".yepper-ad-cta",
          description: "Call-to-action button",
          usage: "Button that users click to visit the ad"
        }
      ]
    },
    {
      title: "Footer Classes",
      icon: <Layout className="w-5 h-5" />,
      classes: [
        {
          name: ".yepper-ad-footer",
          description: "Bottom section of the ad",
          usage: "Contains additional branding and business info"
        },
        {
          name: ".yepper-ad-footer-brand",
          description: "Footer branding text",
          usage: "Yepper brand mention in footer"
        },
        {
          name: ".yepper-ad-footer-business",
          description: "Business information in footer",
          usage: "Additional business details"
        }
      ]
    },
    {
      title: "Empty State Classes",
      icon: <Monitor className="w-5 h-5" />,
      classes: [
        {
          name: ".yepper-ad-empty",
          description: "Container when no ads are available",
          usage: "Shown when there are no active advertisements"
        },
        {
          name: ".yepper-ad-empty-title",
          description: "Title for empty state",
          usage: "Main heading when no ads available"
        },
        {
          name: ".yepper-ad-empty-text",
          description: "Description for empty state",
          usage: "Explanatory text and pricing information"
        },
        {
          name: ".yepper-ad-empty-link",
          description: "CTA button for empty state",
          usage: "Button to advertise in the empty space"
        }
      ]
    }
  ];

  const customizationExamples = [
    {
      title: "Change Ad Background Color",
      code: `.yepper-ad-item {
  background: rgba(0, 100, 200, 0.25) !important;
  border-color: rgba(0, 100, 200, 0.3) !important;
}`,
      description: "Changes the glass morphism background to blue tint"
    },
    {
      title: "Customize Button Style",
      code: `.yepper-ad-cta {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24) !important;
  color: white !important;
  border: none !important;
}`,
      description: "Creates a red gradient button"
    },
    {
      title: "Modify Text Colors",
      code: `.yepper-ad-business-name {
  color: #2c3e50 !important;
}

.yepper-ad-description {
  color: #7f8c8d !important;
}`,
      description: "Changes title and description colors"
    },
    {
      title: "Adjust Border Radius",
      code: `.yepper-ad-item {
  border-radius: 25px !important;
}

.yepper-ad-image-wrapper {
  border-radius: 20px !important;
}`,
      description: "Makes the ad more rounded"
    },
    {
      title: "Custom Hover Effects",
      code: `.yepper-ad-item:hover {
  transform: scale(1.02) !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3) !important;
}`,
      description: "Enhanced hover animation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Code className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Ad Customization Guide</h1>
                <p className="text-sm text-gray-400">Learn how to customize your ad appearance</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm bg-white/10 px-3 py-1 rounded-full">
              <Palette className="w-4 h-4" />
              <span>CSS Classes Documentation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Introduction */}
        <div className="mb-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Sun className="w-6 h-6 mr-3 text-yellow-400" />
              How to Customize Your Ads
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                You can customize the appearance of your ads by adding custom CSS to your website. 
                The ads use specific CSS class names that you can target to change colors, fonts, spacing, and more.
              </p>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-200">
                  <strong>Important:</strong> Always use <code className="bg-black/30 px-2 py-1 rounded">!important</code> 
                  in your custom CSS to ensure your styles override the default ad styles.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CSS Classes Reference */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <Layout className="w-8 h-8 mr-3 text-purple-400" />
            CSS Classes Reference
          </h2>
          
          <div className="grid gap-6">
            {classCategories.map((category, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleSection(`category-${index}`)}
                  className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-purple-500/20 mr-4">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                  </div>
                  {expandedSections[`category-${index}`] ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                
                {expandedSections[`category-${index}`] && (
                  <div className="px-6 pb-6 border-t border-white/10">
                    <div className="grid gap-4 mt-4">
                      {category.classes.map((cls, clsIndex) => (
                        <div key={clsIndex} className="bg-black/30 rounded-lg p-4 border border-white/10">
                          <div className="flex items-start justify-between mb-2">
                            <code className="text-green-400 font-mono text-sm bg-black/50 px-2 py-1 rounded">
                              {cls.name}
                            </code>
                            <button
                              onClick={() => copyToClipboard(cls.name, cls.name)}
                              className="p-1 rounded hover:bg-white/10 transition-colors"
                            >
                              {copiedText === cls.name ? (
                                <Check size={14} className="text-green-400" />
                              ) : (
                                <Copy size={14} className="text-gray-400" />
                              )}
                            </button>
                          </div>
                          <p className="text-gray-300 text-sm mb-1">{cls.description}</p>
                          <p className="text-gray-400 text-xs">{cls.usage}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Customization Examples */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <Palette className="w-8 h-8 mr-3 text-green-400" />
            Customization Examples
          </h2>
          
          <div className="grid gap-6">
            {customizationExamples.map((example, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{example.title}</h3>
                  <p className="text-gray-400 mb-4">{example.description}</p>
                  <CodeBlock code={example.code} label={example.title} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Responsive Classes */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <Smartphone className="w-8 h-8 mr-3 text-blue-400" />
            Responsive Breakpoints
          </h2>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="grid gap-4">
              <div className="bg-black/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-2">Desktop (Default)</h4>
                <p className="text-gray-300 text-sm">No media query needed - default styles</p>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-2">Tablet (≤ 768px)</h4>
                <CodeBlock 
                  code={`@media (max-width: 768px) {
  .yepper-ad-content {
    padding: 14px !important;
  }
}`}
                  label="Tablet CSS"
                />
              </div>
              
              <div className="bg-black/30 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-400 mb-2">Mobile (≤ 480px)</h4>
                <CodeBlock 
                  code={`@media (max-width: 480px) {
  .yepper-ad-business-name {
    font-size: 14px !important;
  }
}`}
                  label="Mobile CSS"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dark Mode Support */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <Moon className="w-8 h-8 mr-3 text-indigo-400" />
            Dark Mode Support
          </h2>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-gray-300 mb-4">
              The ads automatically adapt to dark mode. You can customize dark mode appearance using:
            </p>
            <CodeBlock 
              code={`@media (prefers-color-scheme: dark) {
  .yepper-ad-item {
    background: rgba(20, 20, 20, 0.8) !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
  }
  
  .yepper-ad-business-name {
    color: #ffffff !important;
  }
}`}
              label="Dark Mode CSS"
            />
          </div>
        </div>

        {/* Implementation Guide */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm rounded-xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Code className="w-6 h-6 mr-3 text-purple-400" />
            How to Apply Custom Styles
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Method 1: Add to your website's CSS file</h3>
              <CodeBlock 
                code={`/* Add this to your main CSS file */
.yepper-ad-item {
  background: rgba(your-color-here) !important;
  /* Your custom styles */
}`}
                label="CSS File Method"
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Method 2: Add inline styles to your HTML</h3>
              <CodeBlock 
                code={`<style>
  .yepper-ad-item {
    background: rgba(your-color-here) !important;
    /* Your custom styles */
  }
</style>

<!-- Your ad script goes here -->`}
                label="Inline Styles Method"
              />
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <p className="text-yellow-200">
                <strong>Pro Tip:</strong> Test your customizations on different screen sizes and in both light and dark mode 
                to ensure they look good in all conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdCustomizationDocs;