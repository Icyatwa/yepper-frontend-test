import React from "react";
import { useNavigate } from "react-router-dom";
import './styles/header.css';
import backbutton from './img/backbutton.png'

function BackButton() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className='header-ctn back-ctn'>
        <header>
            <nav>
                <div className="btn-box">
                    <div className='logo'>
                        <button onClick={handleBack}>
                            <img src={backbutton} alt=""/>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    </div>
  )
}

export default BackButton;
