import React from 'react'
import Sidebar from '../Sidebar'
import Header from '../header'
import WebsiteContent from './contents/websiteContent'

function Website() {
    return (
        <div className="ads-container">
            <Sidebar />
            <div className='main-content'>
                <Header />
                <WebsiteContent />
            </div>
        </div>
    )
}

export default Website