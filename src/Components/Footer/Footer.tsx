import './style.scss'

import React from 'react'

import LogoWhite from '../../Assets/SVG/LogoWhite'
import Images from '../../Helpers/Images'
import StoreButton from '../StoreButton/StoreButton'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__tab">
          <LogoWhite />
          <p className="tryOvelText">
            Try Oval free for 30 days to start connected with all your teams. Cancel any time.
          </p>
          <div className="form__container">
            <div className="form__group field">
              <input
                type="input"
                className="form__field"
                placeholder="Name"
                name="Enter your email"
                id="name"
                required
              />
              <label htmlFor="name" className="form__label">
                Enter your email
              </label>
            </div>
            <div className="stone" />
          </div>
        </div>
        <div className="footer__tab">
          <div>
            <span className="list-label">FAQ</span>
            <div className="list">
              <a className="list-item">Email Marketing</a>
              <a className="list-item">Campaigns</a>
              <a className="list-item">Branding</a>
              <a className="list-item">Offline</a>
            </div>
          </div>
          <div>
            <span className="list-label">Our Link</span>
            <div className="list">
              <a className="list-item">Overview</a>
              <a className="list-item">Features</a>
              <a className="list-item">Plans</a>
              <a className="list-item">Contact</a>
            </div>
          </div>
        </div>
        <div className="footer__tab">
          <StoreButton />
        </div>
      </div>
      <div className="footer__bottom">
        <span className="tncprivacy">
          Terms &amp; Conditions <span>Privacy Policy</span>
        </span>
        <div className="social-icons">
          <img src={Images.facebook} className="social-icon" alt="Facebook" />
          <img src={Images.twitter} className="social-icon" alt="Twitter" />
          <img src={Images.instgram} className="social-icon" alt="Instagram" />
        </div>
      </div>
    </footer>
  )
}

export default Footer
