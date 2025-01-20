import React from 'react'
import { Link } from "react-router-dom";
import './styles/logo.css'

export default function Logo() {
  return (
    <Link to='/' className='logo-container'>
      <h2>Yepper</h2>
    </Link>
  )
}