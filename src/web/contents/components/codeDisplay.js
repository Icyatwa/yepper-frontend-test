import React from 'react';
import { 
    Code, 
    Copy ,
    ChevronLeft, 
    ChevronRight,
} from 'lucide-react';
import { Button } from "./button";

const CodeDisplay = ({ codes }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const languages = ['HTML', 'JavaScript', 'PHP', 'Python'];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % languages.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + languages.length) % languages.length);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="bg-zinc-900 rounded-lg overflow-hidden">
        <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-700">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-zinc-400" />
            <h4 className="font-medium text-zinc-200">{languages[activeIndex]}</h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigator.clipboard.writeText(codes[languages[activeIndex]])}
            className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-4 text-sm font-mono text-zinc-200 overflow-x-auto">
          <code>{codes[languages[activeIndex]] || `No ${languages[activeIndex]} code available`}</code>
        </div>
      </div>

      <button
        className="absolute -left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 text-white rounded-full bg-[#FF4500] hover:bg-orange-500 transition-colors shadow-lg"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        className="absolute -right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 text-white rounded-full bg-[#FF4500] hover:bg-orange-500 transition-colors shadow-lg"
        onClick={nextSlide}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CodeDisplay;