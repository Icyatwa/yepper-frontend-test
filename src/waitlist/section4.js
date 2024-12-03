import React from 'react'
import './styles/sec4.css'
import { Link } from 'react-router-dom'

function Section4() {
    return (
        <div className='container section4'>
            <div className='info-container'>
                <div className="terms-container legal-container">
                    <h1 className="terms-title">Terms and Conditions</h1>
                    <p className="terms-subtitle">Effective Date: October 30, 2024</p>
                    
                    <div className="terms-point">
                        <h2 className="terms-heading">Services Provided</h2>
                        <ul className="styled-list">
                            <li>
                                Yepper is an online advertising management platform that connects website owners and advertisers. The platform provides features such as ad space setup, category selection, ad placement, and approval and payment processes.
                            </li>
                        </ul>
                    </div>
                    <Link to='/terms'>Read more</Link>
                </div>


                <div className="privacy-container legal-container">
                    <h1 className="privacy-title">Privacy Policy</h1>
                    <p className="privacy-subtitle">Effective Date: October 30, 2024</p>
                    
                    <div className="privacy-point">
                        <h2 className="privacy-heading">Information Collection</h2>
                        <ul className="styled-list">
                            <li>
                                Yepper collects personal information when users register, including name, email, and payment details, to provide and enhance our services. Non-personal data, such as browsing behavior, is also collected for platform optimization.
                            </li>
                        </ul>
                    </div>
                    <Link to='/privacy'>Read more</Link>
                </div>
            </div>
        </div>
    )
}

export default Section4