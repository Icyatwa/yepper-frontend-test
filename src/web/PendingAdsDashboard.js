import React from 'react'
import Sidebar from '../Sidebar'
import Header from '../header'
import PendingAdsDashboardContent from './contents/pendingAdsDashboardContent'

function Pending() {
    return (
        <div className="ads-container">
            <Sidebar />
            <div className='main-content'>
                <Header />
                <PendingAdsDashboardContent />
            </div>
        </div>
    )
}

export default Pending