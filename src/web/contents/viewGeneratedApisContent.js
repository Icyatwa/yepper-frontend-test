// Preview.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { FiCopy } from 'react-icons/fi';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import '../styles/viewApi.css';

function Preview() {
  const { user } = useUser();
  const [spaces, setSpaces] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchSpaces = async () => {
      if (user) {
        const ownerId = user.primaryEmailAddress.emailAddress;
        try {
          const response = await axios.get(`https://yepper-backend-test.onrender.com/api/ad-spaces/spaces/${ownerId}`);
          setSpaces(response.data);
        } catch (error) {
          console.error('Error fetching spaces:', error);
        }
      }
    };

    fetchSpaces();
  }, [user]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 4);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 4) % 4);
  };

  return (
    <div>
      <div className='view-api'>
        {spaces.map((space) => (
          <div key={space._id} className="space-preview">
            <div className='reqments'>
              <h3 style={{color: 'black'}}>Website: {space.categoryId?.websiteId?.websiteName}</h3>
              <div className='container'>
                <div className='data'>
                  <h4>Category: {space.categoryId?.categoryName}</h4>
                  <div className='ctn'>
                    <div className='type'>
                      <span>Price: {space.categoryId?.price}$</span>
                    </div>
                  </div>
                </div>

                <div className='data'>
                  <p>Space Type: {space.spaceType}</p>
                  <p>Price: {space.price}$</p>
                  <p>Availability: {space.availability}</p>
                </div>
              </div>
            </div>

            <div className='divider'></div>

            <div className='carousel'>
              <div className='carousel-track' style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                <div className='carousel-slide'>
                  <h5>HTML</h5>
                  <pre>{space.apiCodes?.HTML || 'No HTML code available'}</pre>
                  <FiCopy className='copy-icon' onClick={() => handleCopy(space.apiCodes?.HTML)} />
                </div>
                <div className='carousel-slide'>
                  <h5>JavaScript</h5>
                  <pre>{space.apiCodes?.JavaScript || 'No JavaScript code available'}</pre>
                  <FiCopy className='copy-icon' onClick={() => handleCopy(space.apiCodes?.JavaScript)} />
                </div>
                <div className='carousel-slide'>
                  <h5>PHP</h5>
                  <pre>{space.apiCodes?.PHP || 'No PHP code available'}</pre>
                  <FiCopy className='copy-icon' onClick={() => handleCopy(space.apiCodes?.PHP)} />
                </div>
                <div className='carousel-slide'>
                  <h5>Python</h5>
                  <pre>{space.apiCodes?.Python || 'No Python code available'}</pre>
                  <FiCopy className='copy-icon' onClick={() => handleCopy(space.apiCodes?.Python)} />
                </div>
              </div>

              {/* Carousel navigation buttons */}
              <button className='carousel-nav prev' onClick={handlePrevSlide}>
                <MdArrowBackIos />
              </button>
              <button className='carousel-nav next' onClick={handleNextSlide}>
                <MdArrowForwardIos />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Preview;