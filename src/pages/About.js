import React from 'react'
import './about.css'
import Header from '../components/header'
import Section1 from '../aboutComponents/section1'
// import Section2 from '../aboutComponents/section2'
// import Section3 from '../aboutComponents/section3'
import Section4 from '../aboutComponents/section4'
import Section5 from '../aboutComponents/section5'
import Section6 from '../aboutComponents/section6'
// import Footer from '../components/footer'

function About() {
  return (
    <div className='about-container'>
      <Header />
      <Section1 />
      {/* <Section2 /> */}
      {/* <Section3 /> */}
      <Section4 />
      <Section5 />
      {/* <Section6 /> */}
      {/* <Footer /> */}
    </div>
  )
}

export default About