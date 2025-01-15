import React, { useState } from 'react';
import { Search, Filter, Info, X, Check } from 'lucide-react';
import aboveTheFold from './img/aboveTheFold.png';
import beneathTitle from './img/beneathTitle.png';
import bottom from './img/bottom.png';
import floating from './img/floating.png';
import header from './img/header.png';
import inFeed from './img/inFeed.png';
import inlineContent from './img/inlineContent.png';
import leftRail from './img/leftRail.png';
import mobileInterstial from './img/mobileInterstitial.png';
import modal from './img/modal.png';
import overlay from './img/overlay.png';
import proFooter from './img/proFooter.png';
import rightRail from './img/rightRail.png';
import sidebar from './img/sidebar.png';
import stickySidebar from './img/stickySidebar.png';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg max-w-lg w-full mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
        >
          <X size={20} className="text-gray-500" />
        </button>
        {children}
      </div>
    </div>
  );
};

const Spaces = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState(new Set());
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalTemplate, setModalTemplate] = useState(null);
  
  const templates = [
    { id: 'aboveTheFold', label: 'aboveTheFold', imgSrc: aboveTheFold, category: 'header', description: 'Prominent placement at the top of the page, immediately visible without scrolling.' },
    { id: 'beneathTitle', label: 'beneathTitle', imgSrc: beneathTitle, category: 'content', description: 'Located directly under the main title or heading of the content.' },
    { id: 'bottom', label: 'bottom', imgSrc: bottom, category: 'footer', description: 'Positioned at the bottom of the page, after all main content.' },
    { id: 'floating', label: 'floating', imgSrc: floating, category: 'overlay', description: 'Floats over the page content, typically in a fixed position as users scroll.' },
    { id: 'header', label: 'header', imgSrc: header, category: 'header', description: 'Integrated into the main header section of the page.' },
    { id: 'inFeed', label: 'inFeed', imgSrc: inFeed, category: 'content', description: 'Seamlessly integrated within a feed of content items.' },
    { id: 'inlineContent', label: 'inlineContent', imgSrc: inlineContent, category: 'content', description: 'Placed naturally within the flow of the main content.' },
    { id: 'leftRail', label: 'leftRail', imgSrc: leftRail, category: 'sidebar', description: 'Fixed position on the left side of the main content.' },
    { id: 'mobileInterstial', label: 'mobileInterstial', imgSrc: mobileInterstial, category: 'overlay', description: 'Full-screen ad that appears between content pages on mobile devices.' },
    { id: 'modal', label: 'modal', imgSrc: modal, category: 'overlay', description: 'Appears in a modal window over the main content.' },
    { id: 'overlay', label: 'overlay', imgSrc: overlay, category: 'overlay', description: 'Appears as an overlay on top of the main content.' },
    { id: 'proFooter', label: 'proFooter', imgSrc: proFooter, category: 'footer', description: 'Premium placement in the footer section.' },
    { id: 'rightRail', label: 'rightRail', imgSrc: rightRail, category: 'sidebar', description: 'Fixed position on the right side of the main content.' },
    { id: 'sidebar', label: 'sidebar', imgSrc: sidebar, category: 'sidebar', description: 'Appears in the sidebar area of the page.' },
    { id: 'stickySidebar', label: 'stickySidebar', imgSrc: stickySidebar, category: 'sidebar', description: 'Stays visible in the sidebar while scrolling.' }
  ];

  const filteredTemplates = templates.filter(template =>
    template.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTemplateClick = (template) => {
    setSelectedTemplates(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(template.id)) {
        newSelected.delete(template.id);
      } else {
        newSelected.add(template.id);
      }
      return newSelected;
    });
  };

  const handleInfoClick = (e, template) => {
    e.stopPropagation();
    setModalTemplate(template);
    setShowInfoModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-4">
              Ad Template Gallery
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-500">
              Choose from our professionally designed templates to create impactful advertisements.
            </p>
            {selectedTemplates.size > 0 && (
              <div className="mt-4 text-blue-600">
                {selectedTemplates.size} template{selectedTemplates.size !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative flex-1 max-w-lg w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            {selectedTemplates.size > 0 && (
              <button 
                onClick={() => setSelectedTemplates(new Set())}
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
              >
                Clear Selection
              </button>
            )}
            <button className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
              <Filter size={20} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              onClick={() => handleTemplateClick(template)}
              className={`group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer ${
                selectedTemplates.has(template.id) ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="relative aspect-video">
                <img
                  src={template.imgSrc}
                  alt={template.label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {selectedTemplates.has(template.id) && (
                  <div className="absolute top-2 left-2 p-1 rounded-full bg-blue-500 text-white">
                    <Check size={16} />
                  </div>
                )}
                <button
                  onClick={(e) => handleInfoClick(e, template)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                >
                  <Info size={20} className="text-gray-600" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {template.label}
                  </h3>
                  <span className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                    {template.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {selectedTemplates.has(template.id) ? 'Selected' : 'Click to select'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Info Modal */}
        <Modal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)}>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">{modalTemplate?.label}</h2>
            <div className="aspect-video w-full">
              <img
                src={modalTemplate?.imgSrc}
                alt={modalTemplate?.label}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Category:</span>
              <span className="ml-2 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                {modalTemplate?.category}
              </span>
            </div>
            <p className="text-gray-600">{modalTemplate?.description}</p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Spaces;