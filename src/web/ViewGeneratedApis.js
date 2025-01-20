import React from 'react'
import Sidebar from '../Sidebar'
import Header from '../header'
import ViewGeneratedApisContent from './contents/viewGeneratedApisContent'

function ViewGeneratedApis() {
    return (
        <div className="ads-container">
            <Sidebar />
            <div className='main-content'>
                <Header />
                <ViewGeneratedApisContent />
            </div>
        </div>
    )
}

export default ViewGeneratedApis