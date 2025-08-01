import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="spinner-container">
        <div className="twisted-ring"></div>
      </div>
      
      <style jsx>{`
        .spinner-container {
          perspective: 1000px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .twisted-ring {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #000;
          border-radius: 50%;
          position: relative;
          animation: spin 1s linear infinite;
        }

        .twisted-ring::before {
          display: none;
        }

        .twisted-ring::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          background: #000;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        @keyframes twist-spin {
          0% {
            transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg);
          }
          25% {
            transform: rotateY(90deg) rotateX(15deg) rotateZ(90deg);
          }
          50% {
            transform: rotateY(180deg) rotateX(0deg) rotateZ(180deg);
          }
          75% {
            transform: rotateY(270deg) rotateX(-15deg) rotateZ(270deg);
          }
          100% {
            transform: rotateY(360deg) rotateX(0deg) rotateZ(360deg);
          }
        }

        @keyframes counter-twist {
          0% {
            transform: rotateX(0deg) rotateZ(0deg);
          }
          25% {
            transform: rotateX(-10deg) rotateZ(-45deg);
          }
          50% {
            transform: rotateX(0deg) rotateZ(-90deg);
          }
          75% {
            transform: rotateX(10deg) rotateZ(-135deg);
          }
          100% {
            transform: rotateX(0deg) rotateZ(-180deg);
          }
        }

        @keyframes pulse-center {
          0%, 100% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;