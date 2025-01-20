import React from 'react'
import Sidebar from '../Sidebar'
import Header from '../header'
import ApisContent from './contents/apisContent'

function APIs() {
    return (
        <div className="ads-container">
            <Sidebar />
            <div className='spaces-container'>
                <Header />
                <ApisContent />
            </div>
        </div>
    )
}

export default APIs