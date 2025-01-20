import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { ChevronLeft } from "lucide-react";

const BackButton = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center">
      <motion.button 
        className={'flex items-center text-white p-2 rounded-full text-sm font-bold sm:text-base bg-[#FF4500] hover:bg-orange-500 transition-colors'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBack}
      >
        <ChevronLeft 
          className="text-white w-6 h-6 sm:w-8 sm:h-8" 
          strokeWidth={2.5}
        />
      </motion.button>
    </div>
  )
}

export default BackButton;