// Home.js
import React from "react";
import './index.css'
import './home.css'
import Header from './components/header'
import Projects from './web/Projects';

function Home() {
  return (
    <div>
      <Header />
      <Projects />
    </div>
  )
}

export default Home