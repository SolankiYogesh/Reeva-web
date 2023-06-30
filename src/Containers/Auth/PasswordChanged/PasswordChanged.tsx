import './style.scss'

import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import PasswordChangedSVG from '../../../Assets/SVG/PasswordChangedSVG'
import AuthContainer from '../../../Components/AuthContainer/AuthContainer'
import English from '../../../Helpers/English'
import Paths from '../../../Helpers/Paths'

const PasswordChanged = () => {
  const naviagte = useNavigate()

  const onPressLogin = useCallback(() => {
    naviagte(Paths.Login)
  }, [naviagte])

  return (
    <AuthContainer title={English.R20} desciption={English.R21} isLoading={false}>
      <div className="passchange-container--svg">
        <PasswordChangedSVG />
      </div>
      <span className="passchange-container--label">{English.R64}</span>

      <span className="dontacc-text">
        {English.R65}{' '}
        <span className="dontacc-text__singUp" onClick={onPressLogin}>
          {English.R67}
        </span>
        {English.R66}
      </span>
    </AuthContainer>
  )
}

export default PasswordChanged
