import React from 'react';
import './styles/footer.css';
import Logo from './logo';

function Footer() {
  return (
    <div className='footer-container'>
      <div className='upper'>
        <div className='logo-container'>
          <Logo />
        </div>
      </div>

      <div className='middle'>
        <div className='subs'>
          <div className='sub'>
            <div className='title'>
              <label>Contact us</label>
            </div>
            <div className='links'>
              <a href='mailto:olympusexperts@gmail.com?subject=Customer%20Inquiry&body=Hello%20Yepper%20Team,'>
                olympusexperts@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className='lower'>
        <label>© 2010-2024 Yepper Company S.L. All rights reserved.</label>
      </div>
    </div>
  );
}

export default Footer;