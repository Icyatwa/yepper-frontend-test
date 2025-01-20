import React from 'react'
import Header from '../../components/description-header';
import Section1 from './section1'
import Section2 from './section2'
import Footer from '../../components/footer'

function HomePage() {
    return (
        <div className='ad-waitlist bg-gradient-to-br from-white to-blue-50'>
            <Header />
            <Section1 />
            <Section2 />
            <Footer />
        </div>
    )
}

export default HomePage