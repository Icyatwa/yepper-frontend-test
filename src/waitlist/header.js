// header.js
import React from "react";
import './styles/header.css';
import Logo from "./logo";

function Header() {

  return (
    <div className='header-ctn'>
        <header>
            <Logo />
        </header>
    </div>
  )
}

export default Header;
