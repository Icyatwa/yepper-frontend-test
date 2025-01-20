import React from 'react'
import Sidebar from '../Sidebar'
import Header from '../header'
import SpacesContent from './contents/spacesContent'

function Projects() {
    return (
        <div className="ads-container">
            <Sidebar />
            <div className='main-content'>
                <Header />
                <SpacesContent />
            </div>
        </div>
    )
}

export default Projects