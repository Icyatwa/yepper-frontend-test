import React from 'react'
import './about.css'
import Header from '../components/header'
import Section1 from '../aboutComponents/section1'
import Section4 from '../aboutComponents/section4'
import Section5 from '../aboutComponents/section5'

function About() {
  return (
    <div className='about-container'>
      <Header />
      <Section1 />
      <Section4 />
      <Section5 />
    </div>
  )
}

export default About