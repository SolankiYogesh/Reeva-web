import './style.scss'

import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Logo from '../../Assets/SVG/Logo'
import { emitter } from '../../Helpers/Constant'
import Paths from '../../Helpers/Paths'
import AppAnimatedButton from '../AppAnimatedButton/AppAnimatedButton'
import AppButton from '../AppButton/AppButton'
import AppProfileIcon from '../AppProfileIcon/AppProfileIcon'

const Header = () => {
  const user = useSelector((state: any) => state?.user?.userData)

  const scrollToSection = useCallback((index: number) => {
    emitter.emit('onSectionChanged', index)
  }, [])

  const navigate = useNavigate()

  const onPressLogin = useCallback(() => {
    navigate(Paths.Login)
  }, [navigate])

  const onPressSignup = useCallback(() => {
    navigate(Paths.Signup)
  }, [navigate])

  return (
    <header className="header">
      <div className="header__logo">
        <Logo />
      </div>
      {!user?.token && (
        <nav className="header__navigation">
          <ul className="header__tabs">
            <li onClick={() => scrollToSection(0)} className="header__tab">
              Home
            </li>
            <li className="header__tab" onClick={() => scrollToSection(1)}>
              About Us
            </li>
            <li className="header__tab" onClick={() => scrollToSection(2)}>
              Pricing
            </li>
          </ul>
        </nav>
      )}
      {!user?.token && (
        <div className="header__button">
          <AppButton id="header__btn" title="Login" onClick={onPressLogin} />
          <AppAnimatedButton id="header__btn" title="Sign up" onClick={onPressSignup} />
        </div>
      )}
      {user?.token && (
        <div className="profile-container">
          <span className="profile-container--name">{`${user?.first_name} ${user?.last_name}`}</span>
          <AppProfileIcon to={Paths.absUserProfile} size={50} url={user?.profile_image} />
        </div>
      )}
    </header>
  )
}

export default Header
