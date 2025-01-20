import React from 'react';
import { Link, useNavigate  } from "react-router-dom";
import { PlusIcon } from 'lucide-react';
import Header from '../components/backToPreviousHeader';

function Request() {
  const navigate = useNavigate();

  const handleWebNavigate = () => {
    navigate('/request');
  };

  const handleFileNavigate = () => {
    navigate('/file');
  };

  return (
    <div className='ad-waitlist min-h-screen'>
      <Header />
      <div className="flex justify-center items-center gap-5 p-12 flex-wrap">
        <Link 
          to="/create-website"
          className="relative flex flex-col items-center justify-center w-[300px] h-[400px] text-white no-underline rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <img 
            className="absolute inset-0 w-full h-full object-cover z-0 brightness-[0.3]" 
            src="https://img.freepik.com/free-photo/working-from-home-ergonomic-workstation_23-2149204621.jpg?uid=R102997587&ga=GA1.1.1987372731.1735646770&semt=ais_hybrid" 
            alt="background" 
          />
          <h1 className="relative z-10 text-2xl text-center mb-5 px-3 py-1 rounded-lg">
            Add your website
          </h1>
          <button 
            onClick={handleWebNavigate}
            className="flex items-center justify-center relative z-10 p-2 rounded-full bg-[#FF4500] hover:bg-orange-500 transition-colors duration-200"
          >
            <PlusIcon 
              className="text-white w-6 h-6 sm:w-8 sm:h-8" 
              strokeWidth={2.5}
            />
          </button>
        </Link>

        <Link 
          to="/select"
          className="relative flex flex-col items-center justify-center w-[300px] h-[400px] text-white no-underline rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <img 
            className="absolute inset-0 w-full h-full object-cover z-0 brightness-[0.3]" 
            src="https://img.freepik.com/premium-photo/modern-workday-bliss-black-woman-balances-work-breakfast-cozy-living-room_1164924-30919.jpg?uid=R102997587&ga=GA1.1.2142793496.1716934876&semt=ais_hybrid" 
            alt="background" 
          />
          <h1 className="relative z-10 text-2xl text-center mb-5 px-3 py-1 rounded-lg">
            Add your Ad
          </h1>
          <button 
            onClick={handleFileNavigate}
            className="flex items-center justify-center relative z-10 p-2 rounded-full bg-[#FF4500] hover:bg-orange-600 transition-colors duration-200"
          >
            <PlusIcon 
              className="text-white w-6 h-6 sm:w-8 sm:h-8" 
              strokeWidth={2.5}
            />
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Request;
