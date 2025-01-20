// Home.js
import React from "react";
import './index.css'
import './home.css'
import Header from './components/header'
import ApprovedAds from './components/approvedAds';

function Home() {

  return (
    <div className='ad-waitlist min-h-screen'>
      <Header />
      <ApprovedAds />
    </div>
  )
}

export default Home