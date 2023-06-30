import './style.scss'

import { useGoogleLogin } from '@react-oauth/google'
import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import EmailNotFound from '../../../Assets/SVG/EmailNotFound'
import GoogleLogo from '../../../Assets/SVG/GoogleLogo'
import AppAnimatedButton from '../../../Components/AppAnimatedButton/AppAnimatedButton'
import AppButton from '../../../Components/AppButton/AppButton'
import AppInput from '../../../Components/AppInput/AppInput'
import AuthContainer from '../../../Components/AuthContainer/AuthContainer'
import AppModal from '../../../Components/Modal/AppModal'
import Constant from '../../../Helpers/Constant'
import English from '../../../Helpers/English'
import Paths from '../../../Helpers/Paths'
import Utility from '../../../Helpers/Utility'
import APICall from '../../../Network/APICall'
import EndPoints from '../../../Network/EndPoints'
import { setUserData } from '../../../Redux/Reducers/UserSlice'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errEmail, setErrEmail] = useState('')
  const [errPassword, setErrPassword] = useState('')
  const dispatch = useDispatch()
  const [isModal, setISModal] = useState(false)
  const navigate = useNavigate()
  const [isLoading, setISLoading] = useState(false)

  const onLoginSetup = useCallback(
    (resp: any) => {
      Constant.token = resp?.data?.token
      Constant.refresh = resp?.data?.refresh_token
      const cloneData = Utility.deepClone(resp?.data?.data)
      cloneData.token = resp?.data?.token
      cloneData.refresh_token = resp?.data?.refresh_token
      navigate(Paths.Dashboard)
      dispatch(setUserData(cloneData))
    },
    [dispatch, navigate]
  )

  const onPressRegister = useCallback(
    (isGoogle: any = false) => {
      navigate(Paths.Signup, {
        state: {
          isGoogle: isGoogle || null
        }
      })
    },
    [navigate]
  )

  const onPressLogin = useCallback(() => {
    if (Utility.isValid(email)) {
      setErrEmail(English.R1)
      return
    }
    if (!Utility.isEmpty(password)) {
      setErrPassword(English.R56)
      return
    }
    if (!Utility.validatePassword(password)) {
      setErrPassword(English.R2)
      return
    }
    setISLoading(true)
    const payload = {
      email,
      password
    }

    APICall('post', payload, EndPoints.login)
      .then(async (resp: any) => {
        setISLoading(false)

        if (resp?.status === 200 && resp?.data?.data) {
          toast.success(resp?.data?.message)

          onLoginSetup(resp)
        } else if (resp?.status === 201) {
          navigate(Paths.Verification, {
            state: {
              isRegister: true,
              email
            }
          })
        } else if (resp?.status === 404) {
          setISModal(true)
        } else {
          toast.error(resp?.data?.message)
        }
      })
      .catch((e) => {
        toast.error(e?.data?.message)
        setISLoading(false)
      })
  }, [email, navigate, onLoginSetup, password])

  const onPressForgotPassword = useCallback(() => {
    navigate(Paths.ForgotPassword)
  }, [navigate])

  const onPressSignup = useCallback(() => {
    navigate(Paths.Signup)
  }, [navigate])

  const onGoogleSuccess = useCallback(
    async (tokenResponse: any) => {
      const userData: any = await Utility.getScope(tokenResponse?.access_token)
      const payload = {
        google_access_token: tokenResponse?.access_token,
        email: userData?.email,
        profile_image: userData?.picture
      }
      setISLoading(true)
      APICall('post', payload, EndPoints.googleLogin)
        .then(async (resp: any) => {
          setISLoading(false)
          if (resp?.status === 200 && resp?.data?.data && !resp?.data?.is_new_user) {
            onLoginSetup(resp)
          } else if (resp?.status === 201 && resp?.data?.is_new_user) {
            onPressRegister(userData)
          } else if (resp?.status === 202) {
            navigate(Paths.Verification, {
              state: {
                isRegister: true,
                email: userData?.email
              }
            })
          } else if (resp?.status === 404) {
            setISModal(true)
          } else {
            toast.error(resp?.data?.message)
          }
        })
        .catch((e) => {
          toast.error(String(e?.data?.message))
          setISLoading(false)
        })
    },
    [navigate, onLoginSetup, onPressRegister]
  )

  const googleLogin = useGoogleLogin({
    onSuccess: onGoogleSuccess
  })

  return (
    <>
      <AuthContainer title={English.R25} desciption={English.R26} isLoading={isLoading}>
        <span className="login-container--label">{English.R9}</span>
        <AppInput
          value={email}
          divId="login-input"
          type="email"
          onChange={(e) => {
            if (!Utility.isValid(e.target.value)) {
              setErrEmail('')
            }
            setEmail(String(e.target.value))
          }}
          isError={errEmail}
          placeholder={English.R27}
        />
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
        <div className="login-container--bottom-container">
          <span className="login-container--forgot-text" onClick={onPressForgotPassword}>
            {English.R28}
          </span>
          <AppAnimatedButton onClick={onPressLogin} title={English.R5} />
        </div>
        <div className="divider">
          <hr />
          <span className="divider-text">{English.R29}</span>
          <hr />
        </div>
        <AppButton
          isAppGoogle
          Image={<GoogleLogo />}
          onClick={() => googleLogin()}
          title={English.R5}
        />
        <span className="dontacc-text">
          {English.R32}{' '}
          <span onClick={onPressSignup} className="dontacc-text__singUp">
            {English.R30}
          </span>
        </span>
      </AuthContainer>
      <AppModal
        isVisible={isModal}
        btnText={English.R136}
        descText={English.R4}
        title={English.R3}
        onPress={() => setISModal(false)}
        onClose={() => setISModal(false)}
        isImage={<EmailNotFound />}
      />
    </>
  )
}

export default Login
