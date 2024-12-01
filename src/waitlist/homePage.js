import React from 'react'
import './styles/homePage.css'
import Header from './header'
import Section1 from './section1'
import Section2 from './section2'
import Section3 from './section3'

function HomePage() {
    return (
        <div className='waitlist'>
            <Header />
            <Section1 />
            <Section2 />
            <Section3 />
        </div>
    )
}

export default HomePage