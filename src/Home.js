import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className='request-container'>
            <Link className='object' to='/photo'>
                <img className='background' src='https://img.freepik.com/free-photo/beautiful-landscape-contained-photo-frame_23-2149443191.jpg?ga=GA1.1.1130816230.1724152257&semt=ais_hybrid' alt='' />
                <h1>Import a pic</h1>
                <img src='https://cdn-icons-png.flaticon.com/128/1828/1828817.png' alt='' />
            </Link>

            <Link className='object' to='/list'>
                <img className='background' src='https://img.freepik.com/premium-photo/modern-workday-bliss-black-woman-balances-work-breakfast-cozy-living-room_1164924-30919.jpg?uid=R102997587&ga=GA1.1.2142793496.1716934876&semt=ais_hybrid' alt='' />
                <h1>View the pics</h1>
                <img src='https://cdn-icons-png.flaticon.com/128/1828/1828817.png' alt='' />
            </Link>

            <Link className='object' to='/wallet'>
                <img className='background' src='https://img.freepik.com/free-photo/atm-operation-bank_1359-1209.jpg?ga=GA1.1.1130816230.1724152257&semt=ais_hybrid' alt='' />
                <h1>Request for a payout</h1>
                <img src='https://cdn-icons-png.flaticon.com/128/1828/1828817.png' alt='' />
            </Link>
        </div>
    );
}


export default Home;
