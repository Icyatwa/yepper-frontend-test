import React from 'react'
import Header from '../../components/description-header';
import Section1 from './section1'
import Footer from '../../components/footer'

function HomePage() {
    return (
        <div className='ad-waitlist min-h-screen bg-gradient-to-br from-white to-blue-50'>
            <Header />
            <Section1 />
            <Footer />
        </div>
    )
}

export default HomePage