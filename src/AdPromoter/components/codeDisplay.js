// codeDisplay.js
import React, { useState } from 'react'; // Added missing import
import { Code, Maximize2, Copy, Check, X, ChevronLeft, ChevronRight } from 'lucide-react'; // Make sure all icons are imported
import { Button } from '../../components/button'; // Make sure this import is correct

const CodeDisplay = ({ codes }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const languages = ['HTML', 'JavaScript', 'PHP', 'Python'];

  const formatCode = (code, isCompact = false) => {
    if (!code) return '';
    
    // For compact view, only show first few lines
    const lines = code.split('\n');
    const displayLines = isCompact ? lines.slice(0, 3) : lines;
    
    return displayLines.map((line, i) => (
      <div key={i} className="flex">
        <span className="text-zinc-600 select-none w-10 text-right pr-3 border-r border-zinc-700">{i + 1}</span>
        <span className="pl-3 flex-1 whitespace-pre">{line}</span>
      </div>
    ));
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codes[languages[activeIndex]]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Compact view for the card display
  const CompactCodeView = () => (
    <div className="bg-[#1e1e1e] rounded-lg overflow-hidden shadow-sm">
      <div className="flex justify-between items-center px-3 py-1 border-b border-zinc-700">
        <div className="flex items-center gap-1">
          <Code className="w-3 h-3 text-zinc-400" />
          <h5 className="text-xs font-medium text-zinc-200">{languages[activeIndex]}</h5>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleModal}
            className="p-1 h-6 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          >
            <Maximize2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="p-1 h-6 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 relative"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            {copied && (
              <span className="absolute -bottom-8 right-0 bg-zinc-800 text-zinc-200 text-xs px-2 py-1 rounded shadow-md whitespace-nowrap">
                Copied!
              </span>
            )}
          </Button>
        </div>
      </div>
      <div className="p-2 text-xs font-mono overflow-hidden max-h-24">
        <div className="min-w-max text-zinc-200">
          {formatCode(codes[languages[activeIndex]], true)}
          {codes[languages[activeIndex]]?.split('\n').length > 3 && (
            <div className="text-right text-xs text-zinc-500 pt-1">
              + {codes[languages[activeIndex]]?.split('\n').length - 3} more lines...
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Full modal view - Fixed with proper z-index and positioning
  const ModalCodeView = () => {
    const [modalCopied, setModalCopied] = useState(false);
    
    const handleModalCopy = () => {
      navigator.clipboard.writeText(codes[languages[activeIndex]]);
      setModalCopied(true);
      setTimeout(() => setModalCopied(false), 2000);
    };
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70" onClick={toggleModal}></div>
        
        <div className="relative w-full max-w-4xl mx-4 bg-[#1e1e1e] rounded-lg overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-700">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-zinc-300" />
              <h4 className="font-medium text-zinc-100">{languages[activeIndex]} Code</h4>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleModalCopy}
                className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 relative"
              >
                {modalCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-1 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleModal}
                className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-4 text-sm font-mono overflow-auto max-h-96">
            <div className="min-w-max text-zinc-200">
              {formatCode(codes[languages[activeIndex]] || `No ${languages[activeIndex]} code available`)}
            </div>
          </div>
          
          <div className="flex justify-between items-center px-4 py-3 border-t border-zinc-700 bg-zinc-900">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveIndex((prev) => (prev - 1 + languages.length) % languages.length)}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex gap-2">
              {languages.map((lang, idx) => (
                <Button
                  key={lang}
                  variant={activeIndex === idx ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveIndex(idx)}
                  className={activeIndex === idx 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"}
                >
                  {lang}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveIndex((prev) => (prev + 1) % languages.length)}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Main component render
  return (
    <div className="relative w-full">
      {/* Compact card view with language selector */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-center">
          <div className="inline-flex items-center bg-zinc-900 rounded-full p-1">
            {languages.map((lang, idx) => (
              <button
                key={lang}
                onClick={() => setActiveIndex(idx)}
                className={`text-xs px-2 py-1 rounded-full transition-colors ${
                  activeIndex === idx 
                    ? 'bg-blue-600 text-white' 
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
        
        <CompactCodeView />
      </div>
      
      {/* Modal for expanded view */}
      {modalOpen && <ModalCodeView />}
    </div>
  );
};

export default CodeDisplay;