import './style.scss'

import React, { useCallback, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import AppAnimatedButton from '../../../Components/AppAnimatedButton/AppAnimatedButton'
import AppInput from '../../../Components/AppInput/AppInput'
import AppLoader, { type AppLoaderRef } from '../../../Components/Loader/AppLoader'
import English from '../../../Helpers/English'
import Paths from '../../../Helpers/Paths'
import Utility from '../../../Helpers/Utility'
import APICall from '../../../Network/APICall'
import EndPoints from '../../../Network/EndPoints'
import { logOut } from '../../../Redux/Reducers/UserSlice'

const UserProfile = () => {
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmpassword] = useState('')

  const navigate = useNavigate()

  const dispatch = useDispatch()

  // errors
  const [errNewPassword, setNewErrPassword] = useState('')
  const [errPassword, setErrPassword] = useState('')
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('')

  const loaderRef = useRef<AppLoaderRef>(null)

  const onLoad = useCallback((state: boolean) => {
    if (loaderRef.current) {
      loaderRef.current?.showLoader(state)
    }
  }, [])

  const onLogOut = useCallback(() => {
    navigate(Paths.Dashboard)
    dispatch(logOut())
  }, [dispatch, navigate])

  const onPressSave = useCallback(() => {
    if (!Utility.isEmpty(password)) {
      setErrPassword(English.R128)
      return
    }
    if (!Utility.validatePassword(password)) {
      setErrPassword(English.R2)
      return
    }
    if (!Utility.isEmpty(newPassword)) {
      setNewErrPassword(English.R129)
      return
    }
    if (!Utility.validatePassword(newPassword)) {
      setNewErrPassword(English.R2)
      return
    }

    if (!Utility.isEmpty(confirmPassword)) {
      setErrorConfirmPassword(English.R57)
      return
    }

    if (newPassword !== confirmPassword) {
      setNewErrPassword(English.R49)
      return
    }

    const payload: any = {
      old_password: password,
      new_password: newPassword
    }

    onLoad(true)

    APICall('put', payload, EndPoints.changePassword, {}, true)
      .then((resp: any) => {
        onLoad(false)
        if (resp?.status === 200) {
          toast.success(resp?.data?.message)
          onLogOut()
        } else {
          onLoad(false)
          toast.error(JSON.stringify(resp?.data))
        }
      })
      .catch((e) => {
        onLoad(false)
        toast.error(String(e))
      })
  }, [password, newPassword, confirmPassword, onLoad, onLogOut])

  return (
    <div className="cp-container">
      <span className="cp-container--row-label">{English.R20}</span>
      <div className="cp-container--inner-con">
        <AppInput
          value={password}
          onChange={(event) => {
            setErrPassword('')
            setPassword(event.target.value)
          }}
          divId="cp-input"
          isPasswordEye
          placeholder={English.R125}
          isError={errPassword}
        />
        <AppInput
          divId="cp-input"
          onChange={(event) => {
            setNewErrPassword('')
            setNewPassword(event.target.value)
          }}
          isPasswordEye
          value={newPassword}
          placeholder={English.R126}
          isError={errNewPassword}
        />

        <AppInput
          divId="cp-input"
          onChange={(event) => {
            setErrorConfirmPassword('')
            setConfirmpassword(event.target.value)
          }}
          isPasswordEye
          maxLength={14}
          value={confirmPassword}
          placeholder={English.R127}
          isError={errorConfirmPassword}
        />
      </div>

      <AppAnimatedButton divId="save-button" onClick={onPressSave} title={English.R102} />

      <AppLoader ref={loaderRef} />
    </div>
  )
}

export default UserProfile
