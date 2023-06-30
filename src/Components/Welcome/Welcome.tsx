import './style.scss'

import React from 'react'

import Logo from '../../Assets/SVG/Logo'
import Images from '../../Helpers/Images'

interface WelcomeProps {
  title: string
  desciption: string
}

const Welcome = (props: WelcomeProps) => {
  const { title, desciption } = props
  return (
    <div className="welcome">
      <div className="welcome--inner-container">
        <Logo />
        <span className="welcome--wlc-text">{title}</span>
        <span className="welcome--wlc-hint">{desciption}</span>
        <div className="welcome--img-container">
          <div className="welcome--img-inner">
            <img className="welcome--img" src={Images.p1} alt="profile1" />
            <img className="welcome--img" src={Images.p2} alt="profile2" />
            <img className="welcome--img" src={Images.p3} alt="profile3" />
          </div>
          <span className="welcome--img-text">3k+ people joined us, now it’s your turn</span>
        </div>
      </div>
    </div>
  )
}

export default Welcome
