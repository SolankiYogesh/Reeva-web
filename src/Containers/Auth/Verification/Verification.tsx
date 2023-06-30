import './style.scss'

import _ from 'lodash'
import React, { type ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import AppAnimatedButton from '../../../Components/AppAnimatedButton/AppAnimatedButton'
import AppButton from '../../../Components/AppButton/AppButton'
import AppInput from '../../../Components/AppInput/AppInput'
import AuthContainer from '../../../Components/AuthContainer/AuthContainer'
import Constant from '../../../Helpers/Constant'
import English from '../../../Helpers/English'
import Paths from '../../../Helpers/Paths'
import Utility from '../../../Helpers/Utility'
import useCountdown from '../../../Hooks/useCountDown'
import APICall from '../../../Network/APICall'
import EndPoints from '../../../Network/EndPoints'

const Verification = () => {
  const [otp, setOtp] = useState('')
  const [isLoading, setISLoading] = useState(false)

  const [isResend, setISResend] = useState(false)
  const { time, startAgain } = useCountdown(60, () => {
    setISResend(true)
  })
  const navigate = useNavigate()
  const location = useLocation()

  const onFocus = useCallback(() => {
    const input = document.getElementById('otp-input-real')
    if (input) {
      input.addEventListener('blur', () => {
        Utility.wait(500).then(() => {
          input.focus()
        })
      })
      Utility.wait(500).then(() => {
        input.focus()
      })
    }
  }, [])

  useEffect(() => {
    onFocus()
  }, [onFocus])

  const onPressLogin = useCallback(() => {
    navigate(Paths.Login)
  }, [navigate])

  const onPressConfirm = useCallback(async () => {
    if (otp.length < 4) {
      toast.error(English.R147)
      return
    }

    const payload = {
      email: location.state?.email,
      otp
    }
    setISLoading(true)
    APICall('post', payload, EndPoints.verifyOTP)
      .then((resp: any) => {
        setISLoading(false)

        if (resp?.status === 200) {
          toast.success(String(resp?.data?.message))

          if (location.state?.isRegister) {
            navigate(Paths.Login)
          } else {
            Constant.token = resp?.data?.data?.token
            navigate(Paths.SetNewPassword, {
              state: {
                email: location.state?.email,
                data: resp?.data?.data
              }
            })
          }
        } else {
          setOtp('')
          toast.error(resp?.data?.message)
        }
      })
      .catch((e) => {
        toast.error(String(e?.data?.message))
        setISLoading(false)
      })
  }, [otp, location.state?.email, location.state?.isRegister, navigate])

  const onPressResend = useCallback(async () => {
    const payload = {
      email: location?.state?.email
    }
    setISLoading(true)
    APICall('post', payload, EndPoints.resendOTP)
      .then((resp: any) => {
        setISLoading(false)
        toast.success(resp?.data?.message)
        setOtp('')
        setISResend(false)
        startAgain(60)
      })
      .catch((e) => {
        toast.error(String(e?.data?.message))
        setISLoading(false)
      })
  }, [location?.state?.email, startAgain])

  const onChangeOTP = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const regex = new RegExp(`^.{0,${4}}$`)
    if (regex.test(event?.target?.value)) {
      setOtp(event?.target?.value)
    }
  }, [])

  const renderOTP = useMemo(() => {
    return (
      <div className="otp-container" onClick={onFocus}>
        {_.map(Array(4).fill(0), (i, index) => {
          return (
            <div
              onClick={onFocus}
              className={`otp-container${
                otp[index] || index === otp?.length ? '--active' : '--box'
              }`}
              key={index}
            >
              {otp[index]}
            </div>
          )
        })}
        <AppInput
          value={otp}
          onChange={onChangeOTP}
          divId="otp-input"
          id="otp-input-real"
          type="number"
          maxLength={2}
          placeholder=" "
        />
      </div>
    )
  }, [onChangeOTP, onFocus, otp])

  const onPressVerfication = useCallback(() => {
    navigate(Paths.Signup, {
      state: {
        registerData: location?.state?.registerData
      }
    })
  }, [location?.state?.registerData, navigate])

  return (
    <AuthContainer title={English.R12} desciption={English.R13} isLoading={isLoading}>
      <span className="verify-container--label">{English.R14}</span>
      <span className="dontacc-text nsText">{English.R17}</span>
      <span className="dontacc-text nsText emailtext">
        {Utility.hideEmail(location.state?.email)}
        <span onClick={onPressVerfication} className="dontacc-text nsText boldText">
          {English.R18}
        </span>
      </span>

      {renderOTP}
      <div className="time-container">
        {isResend ? (
          <AppButton onClick={onPressResend} title={English.R19} />
        ) : (
          <span className="dontacc-text nsText timeText">
            {English.R16.replace('[time]', time)}
          </span>
        )}

        <AppAnimatedButton divId="fgbBTN" onClick={onPressConfirm} title={English.R15} />
      </div>

      <span className="dontacc-text">
        {English.R8}{' '}
        <span className="dontacc-text__singUp" onClick={onPressLogin}>
          {English.R9}
        </span>
      </span>
    </AuthContainer>
  )
}

export default Verification
