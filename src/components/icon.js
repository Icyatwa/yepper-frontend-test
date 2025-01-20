import React from 'react'
import logoIcon from '../img/logo.png'
import './styles/logo.css'

function Logo() {
    return (
        <div className='logo-container'>
            <img src={logoIcon} alt='' />
        </div>
    )
}

export default Logo