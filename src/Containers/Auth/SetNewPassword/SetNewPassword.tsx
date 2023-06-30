import './style.scss'

import React, { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import AppAnimatedButton from '../../../Components/AppAnimatedButton/AppAnimatedButton'
import AppInput from '../../../Components/AppInput/AppInput'
import AuthContainer from '../../../Components/AuthContainer/AuthContainer'
import English from '../../../Helpers/English'
import Paths from '../../../Helpers/Paths'
import Utility from '../../../Helpers/Utility'
import APICall from '../../../Network/APICall'
import EndPoints from '../../../Network/EndPoints'

const SetNewPassword = () => {
  const [confirmPassword, setConfirmpassword] = useState('')
  const [password, setPassword] = useState('')
  const [errPassword, setErrPassword] = useState('')
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('')
  const location = useLocation()
  const tokenData = location.state?.data
  const navigate = useNavigate()
  const [isLoading, setISLoading] = useState(false)

  const onPressLogin = useCallback(() => {
    navigate(Paths.Login)
  }, [navigate])

  const onPressChangePassword = useCallback(async () => {
    if (!Utility.isEmpty(password)) {
      setErrPassword(English.R56)
      return
    }
    if (!Utility.isEmpty(confirmPassword)) {
      setErrorConfirmPassword(English.R57)
      return
    }
    if (password !== confirmPassword) {
      setErrPassword(English.R49)
      return
    }

    const payload = {
      email: location.state?.email,
      password
    }
    const header: any = {
      Authorization: `Bearer ${tokenData?.token}`
    }
    setISLoading(true)
    APICall('post', payload, EndPoints.resetpassword, header)
      .then(async (resp: any) => {
        setISLoading(false)

        if (resp?.status === 200) {
          navigate(Paths.PasswordChanged)
        } else {
          toast.error(resp?.data?.message)
        }
      })
      .catch((e) => {
        toast.error(String(e?.data?.message))
        setISLoading(false)
      })
  }, [password, confirmPassword, location.state?.email, tokenData?.token, navigate])

  return (
    <AuthContainer title={English.R20} desciption={English.R21} isLoading={isLoading}>
      <span className="setp-container--label">{English.R20}</span>

      <AppInput
        onChange={(event) => {
          setErrPassword('')
          setPassword(event.target.value)
        }}
        value={password}
        divId="login-input"
        isPasswordEye
        isError={errPassword}
        placeholder={English.R23}
      />
      <AppInput
        value={confirmPassword}
        onChange={(event) => {
          setErrorConfirmPassword('')
          setConfirmpassword(event.target.value)
        }}
        divId="login-input"
        isPasswordEye
        isError={errorConfirmPassword}
        placeholder={English.R24}
      />

      <AppAnimatedButton divId="fgbBTN" onClick={onPressChangePassword} title={English.R22} />

      <span className="dontacc-text">
        {English.R8}{' '}
        <span className="dontacc-text__singUp" onClick={onPressLogin}>
          {English.R9}
        </span>
      </span>
    </AuthContainer>
  )
}

export default SetNewPassword
