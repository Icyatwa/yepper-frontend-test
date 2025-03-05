import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsRight, Globe, FileText, TrendingUp, Users, DollarSign, Zap, HelpCircle, Key } from 'lucide-react';
import logo from './logo.png'

const InvestorPresentation = () => {
  // State for presentation control
  const [activeSection, setActiveSection] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [hoverFinancial, setHoverFinancial] = useState(false);
  const [hoverProjection, setHoverProjection] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [expandedTier, setExpandedTier] = useState(null);

  // Ref for keyboard controls
  const pageRef = useRef(null);

  // Sections data
  const sections = [
    { id: 0, title: "Introduction", key: "1" },
    { id: 1, title: "Investment Overview", key: "2" },
    { id: 2, title: "Revenue Projections", key: "3" },
    { id: 3, title: "Expenses Breakdown", key: "4" },
    { id: 4, title: "Implementation Timeline", key: "5" }
  ];

  // Tutorial steps
  const tutorials = [
    { text: "Welcome to Yepper's Investor Presentation! Press the right arrow key or click 'Next' to advance." },
    { text: "Press numbers 1-5 to jump to specific sections. Try pressing '2' to see our Investment Overview." },
    { text: "Hover over cards to see detailed information. Click on statistics to see expanded data." },
    { text: "Press 'H' anytime to show this tutorial again. Press 'ESC' to close pop-ups." },
  ];

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setActiveSection(prev => (prev < sections.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setActiveSection(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'h' || e.key === 'H') {
        setShowTutorial(true);
        setTutorialStep(0);
      } else if (e.key === 'Escape') {
        setShowModal(false);
        setShowTutorial(false);
      } else if (!isNaN(parseInt(e.key)) && parseInt(e.key) >= 1 && parseInt(e.key) <= 5) {
        setActiveSection(parseInt(e.key) - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sections.length]);

  // Tutorial navigation
  const nextTutorial = () => {
    if (tutorialStep < tutorials.length - 1) {
      setTutorialStep(prev => prev + 1);
    } else {
      setShowTutorial(false);
    }
  };

  // Show modal function
  const showDetailModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800" ref={pageRef}>
      {/* Modern header with blur effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo and title section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-white-600 to-grey-600 px-4 py-2 rounded-xl">
              <img src={logo} alt='' className="w-6 h-6" />
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 font-bold text-lg'>Yepper</span>
            </div>
            <div className="text-slate-500 font-medium hidden sm:block">Presentation</div>
          </div>
          
          {/* Navigation buttons - centered */}
          <div className="flex-1 flex justify-center">
            <div className="hidden md:flex items-center gap-3">
              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-3 py-2 rounded-lg font-medium transition-all ${
                    activeSection === section.id 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                      : 'bg-white/50 text-slate-600 hover:bg-blue-100'
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="text-sm">{section.title}</div>
                  <div className="text-xs opacity-70 mt-0.5">Press {section.key}</div>
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Help button - right aligned */}
          <div>
            <motion.button
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setShowTutorial(true);
                setTutorialStep(0);
              }}
            >
              <HelpCircle size={20} />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {activeSection === 0 && (
            <motion.div
              key="introduction"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="text-center space-y-6">
                <motion.h1 
                  className="text-5xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Financial Planning for Yepper
                </motion.h1>
                <motion.p 
                  className="text-xl text-slate-600 max-w-3xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  A detailed roadmap for scaling globally in a market with few competitors, dominated by powerful and wealthy players.
                </motion.p>
              </div>
              
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.div 
                  className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 h-full"
                  whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40"></div>
                        <div className="relative p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                          <TrendingUp className="text-white" size={24} />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h2 className="text-2xl font-bold text-slate-800">Current System Value</h2>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl">
                        <span className="font-medium text-blue-800">Initial capital</span>
                        <span className="text-xl font-bold text-blue-800">$351.02 USD</span>
                      </div>
                      <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl">
                        <span className="font-medium text-indigo-800">System Current Value</span>
                        <span className="text-xl font-bold text-indigo-800">$5,000 USD</span>
                      </div>
                      <div className="pt-4">
                        <h3 className="text-lg font-semibold text-slate-700 mb-3">Yepper Investment Breakdown</h3>
                        <ul className="space-y-2 text-slate-600">
                          <li className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                            <span>System Design: Canva, Figma</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                            <span>System frontend: Clerk, Freepik</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                            <span>System backend: Google Cloud, MongoDB</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                            <span>Payment processors: Flutterwave</span>
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                            <span>Marketing: Advertising</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 h-full"
                  whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-indigo-500 blur-md opacity-40"></div>
                        <div className="relative p-3 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400">
                          <Users className="text-white" size={24} />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h2 className="text-2xl font-bold text-slate-800">Projected User Growth</h2>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl">
                        <span className="font-medium text-blue-800">Web Owners</span>
                        <span className="text-xl font-bold text-blue-800">500</span>
                      </div>
                      <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl">
                        <span className="font-medium text-indigo-800">Advertisers</span>
                        <span className="text-xl font-bold text-indigo-800">5,000</span>
                      </div>
                      
                      <motion.div 
                        className="mt-6 bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-xl"
                        whileHover={{ scale: 1.02 }}
                      >
                        <h3 className="text-lg font-semibold text-slate-700 mb-3">Our Vision</h3>
                        <p className="text-slate-600">We aim to transform Yepper into Africa's leading AI-powered advertising platform, offering a robust African alternative to Google Ads with AI-driven efficiency.</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div
                className="mt-8 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <motion.button
                  onClick={() => setActiveSection(1)}
                  className="group relative h-16 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium overflow-hidden transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center justify-center">
                    <span className="uppercase tracking-wider mr-2">Continue to Investment Overview</span>
                    <ChevronsRight size={20} />
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {activeSection === 1 && (
            <motion.div
              key="investment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <motion.h2 
                className="text-4xl font-bold text-center bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Investment Overview
              </motion.h2>
              
              <motion.div 
                className="bg-white rounded-2xl shadow-xl p-8 overflow-hidden border border-blue-100"
                >
                  <p className="text-lg text-center text-slate-600 mb-8">
                    We aim to transform Yepper into Africa's leading AI-powered advertising platform. This investment breakdown outlines how the $3,000 funding will be strategically utilized over six months.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div 
                      className="bg-gradient-to-b from-blue-50 to-white rounded-xl p-6 border border-blue-100 shadow-md h-full"
                      whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
                      onClick={() => showDetailModal(
                        "Development & AI Integration",
                        "Enhance platform functionality, integrate AI-driven features, and ensure scalability. AI-Powered Features: Implement predictive analytics, automated ad placements, and personalized advertiser recommendations. ChatGPT Integration: Provide real-time support, ad copy suggestions, and campaign insights. Platform Optimization: Ensure a user-friendly interface and mobile-first design for accessibility."
                      )}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-blue-500 blur-sm opacity-30"></div>
                            <div className="relative p-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                              <Zap className="text-white" size={18} />
                            </div>
                          </div>
                          <h3 className="ml-3 text-lg font-semibold text-blue-800">Development & AI</h3>
                        </div>
                        <span className="text-xl font-bold text-blue-700">$1,500</span>
                      </div>
                      <div className="space-y-3">
                        <div className="w-full bg-blue-100 rounded-full h-2">
                          <motion.div 
                            className="bg-blue-600 h-2 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: '50%' }}
                            transition={{ duration: 1, delay: 0.3 }}
                          ></motion.div>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>50% of Budget</span>
                          <span>Click for details</span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gradient-to-b from-indigo-50 to-white rounded-xl p-6 border border-indigo-100 shadow-md h-full"
                      whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
                      onClick={() => showDetailModal(
                        "Marketing & Outreach",
                        "Boost brand awareness, onboard web owners & advertisers, and establish a strong market presence. Content Marketing: Publish insightful blog posts and case studies on AI-driven advertising. Social Media Advertising: Targeted campaigns on Facebook, LinkedIn, and Twitter. Partnerships: Collaborate with tech hubs, digital marketing agencies, and influencers. Email Marketing: Targeted outreach campaigns to attract advertisers and web owners."
                      )}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-indigo-500 blur-sm opacity-30"></div>
                            <div className="relative p-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400">
                              <Globe className="text-white" size={18} />
                            </div>
                          </div>
                          <h3 className="ml-3 text-lg font-semibold text-indigo-800">Marketing & Outreach</h3>
                        </div>
                        <span className="text-xl font-bold text-indigo-700">$1,200</span>
                      </div>
                      <div className="space-y-3">
                        <div className="w-full bg-indigo-100 rounded-full h-2">
                          <motion.div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: '40%' }}
                            transition={{ duration: 1, delay: 0.4 }}
                          ></motion.div>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>40% of Budget</span>
                          <span>Click for details</span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gradient-to-b from-purple-50 to-white rounded-xl p-6 border border-purple-100 shadow-md h-full"
                      whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
                      onClick={() => showDetailModal(
                        "Operations & Contingency",
                        "Ensure smooth operations and maintain financial flexibility for unforeseen needs. Operational Costs: Hosting fees, domain renewals, and software subscriptions. Contingency Fund: Reserve for unexpected costs or strategic opportunities."
                      )}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-purple-500 blur-sm opacity-30"></div>
                            <div className="relative p-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-400">
                              <FileText className="text-white" size={18} />
                            </div>
                          </div>
                          <h3 className="ml-3 text-lg font-semibold text-purple-800">Operations</h3>
                        </div>
                        <span className="text-xl font-bold text-purple-700">$300</span>
                      </div>
                      <div className="space-y-3">
                        <div className="w-full bg-purple-100 rounded-full h-2">
                          <motion.div 
                            className="bg-purple-600 h-2 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: '10%' }}
                            transition={{ duration: 1, delay: 0.5 }}
                          ></motion.div>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>10% of Budget</span>
                          <span>Click for details</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    className="mt-8 flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.button
                      onClick={() => setActiveSection(2)}
                      className="group relative h-16 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium overflow-hidden transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10 flex items-center justify-center">
                        <span className="uppercase tracking-wider mr-2">Continue to Revenue Projections</span>
                        <ChevronsRight size={20} />
                      </span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
  
            {activeSection === 2 && (
              <motion.div
                key="revenue"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <motion.h2 
                  className="text-4xl font-bold text-center bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Revenue Projections
                </motion.h2>
                
                <motion.div 
                  className="bg-white rounded-2xl shadow-xl p-8 overflow-hidden border border-blue-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Commission Model</h3>
                    <p className="text-slate-600">Tiered commission structure based on web owner's revenue generation.</p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-blue-50 text-blue-800">
                          <th className="p-4 text-left rounded-l-lg">Tier</th>
                          <th className="p-4 text-left">Web Owners</th>
                          <th className="p-4 text-left">Avg Monthly Ad Revenue</th>
                          <th className="p-4 text-left">Commission Rate</th>
                          <th className="p-4 text-left rounded-r-lg">Yepper's Revenue per Owner</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { 
                            tier: "Bronze", 
                            owners: 150, 
                            revenue: "50,000 RWF", 
                            rate: "15%", 
                            perOwner: "7,500 RWF",
                            color: "amber"
                          },
                          { 
                            tier: "Silver", 
                            owners: 200, 
                            revenue: "150,000 RWF", 
                            rate: "20%", 
                            perOwner: "30,000 RWF",
                            color: "slate"
                          },
                          { 
                            tier: "Gold", 
                            owners: 100, 
                            revenue: "500,000 RWF", 
                            rate: "25%", 
                            perOwner: "125,000 RWF",
                            color: "yellow"
                          },
                          { 
                            tier: "Platinum", 
                            owners: 50, 
                            revenue: "1,500,000 RWF", 
                            rate: "30%", 
                            perOwner: "450,000 RWF",
                            color: "blue"
                          }
                        ].map((row, index) => (
                          <motion.tr 
                            key={row.tier}
                            className="border-b border-blue-50 hover:bg-blue-50/50 cursor-pointer"
                            whileHover={{ backgroundColor: "#DBEAFE" }}
                            onClick={() => setExpandedTier(expandedTier === row.tier ? null : row.tier)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                          >
                            <td className="p-4">
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full bg-${row.color}-500 mr-2`}></div>
                                <span className="font-medium">{row.tier}</span>
                              </div>
                            </td>
                            <td className="p-4">{row.owners}</td>
                            <td className="p-4">{row.revenue}</td>
                            <td className="p-4">{row.rate}</td>
                            <td className="p-4 font-medium">{row.perOwner}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <motion.div 
                    className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Projected Total Revenue</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-700">Total Monthly Revenue</span>
                          <span className="text-xl font-bold text-blue-700">42,125,000 RWF</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-700">Total Monthly Revenue (USD)</span>
                          <span className="text-xl font-bold text-blue-700">~$31,500</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-700">Total 6-Month Revenue</span>
                          <span className="text-xl font-bold text-indigo-700">~$189,000</span>
                        </div>
                      </div>
                      <div>
                        <div className="h-28 bg-white rounded-lg p-4 flex items-center justify-center">
                          <motion.div
                            className="relative h-16 w-full bg-blue-100 rounded-full overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.9 }}
                          >
                            <motion.div 
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 2, delay: 1 }}
                            ></motion.div>
                            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                            6-Month Growth Projection
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="mt-8 flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <motion.button
                    onClick={() => setActiveSection(3)}
                    className="group relative h-16 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium overflow-hidden transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center">
                      <span className="uppercase tracking-wider mr-2">Continue to Expenses Breakdown</span>
                      <ChevronsRight size={20} />
                    </span>
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {activeSection === 3 && (
            <motion.div
              key="expenses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <motion.h2 
                className="text-4xl font-bold text-center bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Expenses Breakdown
              </motion.h2>
              
              <motion.div 
                className="bg-white rounded-2xl shadow-xl p-8 overflow-hidden border border-blue-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div 
                      className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100 shadow-md"
                      onMouseEnter={() => setHoverFinancial(true)}
                      onMouseLeave={() => setHoverFinancial(false)}
                    >
                      <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                        <DollarSign className="mr-2" size={20} />
                        Investment Allocation
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-700">Development & AI</span>
                            <span className="font-medium text-blue-700">$1,500</span>
                          </div>
                          <div className="w-full bg-blue-100 rounded-full h-3">
                            <motion.div 
                              className="bg-blue-600 h-3 rounded-full" 
                              initial={{ width: 0 }}
                              animate={{ width: hoverFinancial ? '50%' : 0 }}
                              transition={{ duration: 0.8 }}
                            ></motion.div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-700">Marketing & Outreach</span>
                            <span className="font-medium text-blue-700">$1,200</span>
                          </div>
                          <div className="w-full bg-blue-100 rounded-full h-3">
                            <motion.div 
                              className="bg-indigo-600 h-3 rounded-full" 
                              initial={{ width: 0 }}
                              animate={{ width: hoverFinancial ? '40%' : 0 }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                            ></motion.div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-700">Operations & Contingency</span>
                            <span className="font-medium text-blue-700">$300</span>
                          </div>
                          <div className="w-full bg-blue-100 rounded-full h-3">
                            <motion.div 
                              className="bg-purple-600 h-3 rounded-full" 
                              initial={{ width: 0 }}
                              animate={{ width: hoverFinancial ? '10%' : 0 }}
                              transition={{ duration: 0.8, delay: 0.4 }}
                            ></motion.div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-blue-100">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-700">Total Investment</span>
                          <span className="text-xl font-bold text-blue-800">$3,000</span>
                        </div>
                      </div>
                    </div>
                    
                    <motion.div 
                      className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 border border-indigo-100 shadow-md"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <h3 className="text-xl font-bold text-indigo-800 mb-4">Expected Outcomes</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mt-1">✓</div>
                          <span className="text-slate-700 ml-3">Increased efficiency in ad placement and performance tracking</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mt-1">✓</div>
                          <span className="text-slate-700 ml-3">Improved user experience, driving higher advertiser engagement</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mt-1">✓</div>
                          <span className="text-slate-700 ml-3">Competitive edge over traditional advertising solutions</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mt-1">✓</div>
                          <span className="text-slate-700 ml-3">Strengthened brand presence and credibility</span>
                        </li>
                      </ul>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <div 
                      className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-100 shadow-md h-full"
                      onMouseEnter={() => setHoverProjection(true)}
                      onMouseLeave={() => setHoverProjection(false)}
                    >
                      <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                        <TrendingUp className="mr-2" size={20} />
                        ROI Projection
                      </h3>
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-700">6-Month Investment</span>
                            <span className="font-medium text-purple-700">$3,000</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-700">6-Month Revenue</span>
                            <span className="font-medium text-purple-700">$189,000</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-700">ROI</span>
                            <motion.span 
                              className="text-2xl font-bold text-purple-700"
                              initial={{ scale: 1 }}
                              animate={{ scale: hoverProjection ? [1, 1.1, 1] : 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              6,200%
                            </motion.span>
                          </div>
                        </div>
                        
                        <div className="pt-4 space-y-3">
                          <p className="text-slate-600">With just a $3,000 investment, Yepper is projected to generate approximately $189,000 in revenue over 6 months, representing an ROI of 6,200%.</p>
                          <p className="text-slate-600">This exceptional return demonstrates the scalability and profit potential of our AI-powered advertising platform in the African market.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div
                  className="mt-8 flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.button
                    onClick={() => setActiveSection(4)}
                    className="group relative h-16 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium overflow-hidden transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center">
                      <span className="uppercase tracking-wider mr-2">Continue to Implementation Timeline</span>
                      <ChevronsRight size={20} />
                    </span>
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {activeSection === 4 && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <motion.h2 
                className="text-4xl font-bold text-center bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Implementation Timeline
              </motion.h2>
              
              <motion.div 
                className="bg-white rounded-2xl shadow-xl p-8 overflow-hidden border border-blue-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-blue-200"></div>
                  
                  {/* Timeline Items */}
                  <div className="space-y-12 relative">
                    {/* Month 1-2 */}
                    <motion.div 
                      className="relative md:ml-0 md:flex md:justify-between md:items-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <div className="hidden md:block md:w-1/2 pr-8 text-right">
                        <h3 className="text-xl font-bold text-blue-800">Month 1-2</h3>
                        <p className="text-slate-600 mt-1">Platform Development Phase</p>
                      </div>
                      
                      <div className="absolute left-0 md:left-1/2 transform -translate-y-1/4 md:-translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 shadow-md shadow-blue-200 z-10">
                        <span className="text-white font-bold">1</span>
                      </div>
                      
                      <div className="md:w-1/2 pl-12 md:pl-8">
                        <h3 className="text-xl font-bold text-blue-800 md:hidden">Month 1-2</h3>
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                          <ul className="space-y-3">
                            <li className="flex items-start">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mt-1">✓</div>
                              <span className="text-slate-700 ml-3">Complete platform enhancements and AI feature development</span>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mt-1">✓</div>
                              <span className="text-slate-700 ml-3">Create marketing materials and establish brand identity</span>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mt-1">✓</div>
                              <span className="text-slate-700 ml-3">Finalize AI integration for ad recommendation system</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Month 3-4 */}
                    <motion.div 
                      className="relative md:ml-0 md:flex md:justify-between md:items-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <div className="hidden md:block md:w-1/2 pr-8 text-right">
                        <h3 className="text-xl font-bold text-indigo-800">Month 3-4</h3>
                        <p className="text-slate-600 mt-1">Market Launch Phase</p>
                      </div>
                      
                      <div className="absolute left-0 md:left-1/2 transform -translate-y-1/4 md:-translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 shadow-md shadow-indigo-200 z-10">
                        <span className="text-white font-bold">2</span>
                      </div>
                      
                      <div className="md:w-1/2 pl-12 md:pl-8">
                        <h3 className="text-xl font-bold text-indigo-800 md:hidden">Month 3-4</h3>
                        <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 shadow-sm">
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs mt-1">✓</div>
                              <span className="text-slate-700 ml-3">Launch aggressive digital marketing campaigns</span>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs mt-1">✓</div>
                              <span className="text-slate-700 ml-3">Onboard first 250 web owners and 2,500 advertisers</span>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs mt-1">✓</div>
                              <span className="text-slate-700 ml-3">Collect user feedback and refine platform features</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Month 5-6 */}
                    <motion.div 
                      className="relative md:ml-0 md:flex md:justify-between md:items-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <div className="hidden md:block md:w-1/2 pr-8 text-right">
                        <h3 className="text-xl font-bold text-purple-800">Month 5-6</h3>
                        <p className="text-slate-600 mt-1">Scaling & Optimization Phase</p>
                      </div>
                      
                      <div className="absolute left-0 md:left-1/2 transform -translate-y-1/4 md:-translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 shadow-md shadow-purple-200 z-10">
                        <span className="text-white font-bold">3</span>
                      </div>
                      
                      <div className="md:w-1/2 pl-12 md:pl-8">
                        <h3 className="text-xl font-bold text-purple-800 md:hidden">Month 5-6</h3>
                        <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 shadow-sm">
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs mt-1">✓</div>
                              <span className="text-slate-700 ml-3">Optimize marketing strategies based on data insights</span>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs mt-1">✓</div>
                              <span className="text-slate-700 ml-3">Expand outreach to attract an additional 250 web owners and 2,500 advertisers</span>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs mt-1">✓</div>
                              <span className="text-slate-700 ml-3">Improve AI-powered automation for enhanced efficiency</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                <motion.div 
                  className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <h3 className="text-xl font-bold text-blue-800 mb-4">Conclusion</h3>
                  <p className="text-slate-700 mb-4">This strategic investment allocation ensures Yepper not only expands rapidly but also establishes itself as a leader in Africa's digital advertising space. With the right funding and execution, we position Yepper as the African alternative to Google Ads, powered by AI-driven efficiency.</p>
                  <p className="text-slate-700 font-medium">We invite you to be part of this vision, gaining a stake in a platform set to redefine advertising in Africa and beyond.</p>
                </motion.div>
                
                <motion.div
                  className="mt-8 flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.button
                    onClick={() => setActiveSection(0)}
                    className="group relative h-16 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium overflow-hidden transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center">
                      <span className="uppercase tracking-wider mr-2">Return to Introduction</span>
                      <ChevronsRight size={20} />
                    </span>
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modal for expanded information */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-blue-800 mb-4">{modalTitle}</h3>
              <p className="text-slate-700">{modalContent}</p>
              
              <button 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
                onClick={() => setShowModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="absolute top-0 right-0 -mt-6 -mr-6">
                <motion.div 
                  className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ rotate: 180, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Key size={24} />
                </motion.div>
              </div>
              
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Presentation Controls</h3>
              <p className="text-slate-700 mb-6">{tutorials[tutorialStep].text}</p>
              
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  {tutorials.map((_, index) => (
                    <div 
                      key={index} 
                      className={`w-2 h-2 rounded-full ${tutorialStep === index ? 'bg-blue-600' : 'bg-blue-200'}`}
                    ></div>
                  ))}
                </div>
                <div className="flex space-x-4">
                  <button 
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                    onClick={() => setShowTutorial(false)}
                  >
                    Skip
                  </button>
                  <button 
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    onClick={nextTutorial}
                  >
                    {tutorialStep < tutorials.length - 1 ? 'Next' : 'Start Presentation'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcuts help */}
      <div className="fixed bottom-4 right-4 z-40">
        <motion.button
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setShowTutorial(true);
            setTutorialStep(0);
          }}
        >
          <HelpCircle size={24} />
        </motion.button>
      </div>
    </div>
  );
};

export default InvestorPresentation;