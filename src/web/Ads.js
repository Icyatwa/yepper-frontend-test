import React from 'react'
import Sidebar from '../Sidebar'
import Header from '../header'
import AdsContent from './contents/adsContent'

function Ads() {
    return (
        <div className="ads-container">
            <Sidebar />
            <div className='spaces-container'>
                <Header />
                <AdsContent />
            </div>
        </div>
    )
}

export default Ads