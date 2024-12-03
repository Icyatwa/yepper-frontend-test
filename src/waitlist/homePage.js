import React from 'react'
import './styles/homePage.css'
import Header from './header'
import Section1 from './section1'
import Section2 from './section2'
import Section3 from './section3'
import Section4 from './section4'
import Footer from './footer'

function HomePage() {
    return (
        <div className='waitlist'>
            <Header />
            <Section1 />
            <Section2 />
            <Section3 />
            <Section4 />
            <Footer />
        </div>
    )
}

export default HomePage