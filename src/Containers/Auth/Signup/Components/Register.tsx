import '../style.scss'

import React, { useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import AppAnimatedButton from '../../../../Components/AppAnimatedButton/AppAnimatedButton'
import AppInput from '../../../../Components/AppInput/AppInput'
import English from '../../../../Helpers/English'
import Utility from '../../../../Helpers/Utility'
import EndPoints from '../../../../Network/EndPoints'

interface RegisterProps {
  data?: any
  onDataChange: (data: any) => void
  isGoogleData?: any
}

const Register = (props: RegisterProps) => {
  const { onDataChange, data, isGoogleData } = props
  const registerData = useLocation().state?.registerData
  const [check, setCheck] = useState(!!data || !!registerData)
  const [errEmail, setErrEmail] = useState('')
  const [errPassword, setErrPassword] = useState('')
  const [errPhoneNumber, setErrPhoneNumber] = useState('')
  const [errConfirmPassword, setErrConfirmPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState(
    data?.phoneNumber || registerData?.phone_number || ''
  )
  const [firstName, setFirstName] = useState(
    data?.firstName || registerData?.first_name || isGoogleData?.given_name || ''
  )
  const [lastName, setLastName] = useState(
    data?.lastName || registerData?.last_name || isGoogleData?.family_name || ''
  )
  const [address, setAddress] = useState(data?.address || registerData?.address || '')
  const [addressError, setAddressError] = useState('')
  const [email, setEmail] = useState(
    data?.email || registerData?.email || isGoogleData?.email || ''
  )
  const [password, setPassword] = useState(data?.password || registerData?.password || '')
  const [confirmPassword, setConfirmPassword] = useState(
    data?.password || registerData?.password || ''
  )
  const [licence, setLicence] = useState(data?.userLicence || registerData?.license_no || '')
  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [licenceError, setLicenceError] = useState('')

  const onPressTermsPrivacy = useCallback((url: string) => {
    window.open(url, '_blank')
  }, [])

  const onPressRegister = useCallback(() => {
    if (!Utility.isEmpty(firstName)) {
      setFirstNameError(English.R52)
      return
    }
    if (!Utility.isEmpty(lastName)) {
      setLastNameError(English.R53)
      return
    }
    if (!Utility.isEmpty(phoneNumber)) {
      setFirstNameError(English.R55)
      return
    }
    if (phoneNumber.length < 14) {
      setErrPhoneNumber(English.R46)
      return
    }
    if (!Utility.isEmpty(licence)) {
      setLicenceError(English.R54)
      return
    }

    if (Utility.isValid(email)) {
      setErrEmail(English.R1)
      return
    }
    if (!Utility.isEmpty(address)) {
      setAddressError(English.R63)
      return
    }
    if (!isGoogleData && !Utility.isEmpty(password)) {
      setErrPassword(English.R56)
      return
    }
    if (!isGoogleData && !Utility.validatePassword(password)) {
      setErrPassword(English.R2)
      return
    }
    if (!isGoogleData && !Utility.validatePassword(confirmPassword)) {
      setErrConfirmPassword(English.R57)
      return
    }
    if (!isGoogleData && confirmPassword !== password) {
      setErrPassword(English.R51)
      return
    }
    if (!check) {
      toast.info('Please agree to Terms & Conditions and Privacy Policy')
      return
    }
    const payload: any = {
      email,
      phoneNumber,
      firstName,
      lastName,
      userLicence: licence,
      address,
      isGoogleData: !!isGoogleData
    }
    if (!isGoogleData) {
      payload.password = password
    }

    onDataChange(payload)
  }, [
    address,
    check,
    confirmPassword,
    email,
    firstName,
    isGoogleData,
    lastName,
    licence,
    onDataChange,
    password,
    phoneNumber
  ])

  const formateText = useCallback((text: string) => {
    return text.replace(/[^a-z]/gi, '')
  }, [])

  return (
    <div className="tab">
      <div className="signup-container--row">
        <AppInput
          type="text"
          onChange={(e) => {
            setFirstNameError('')
            setFirstName(formateText(String(e.target.value)))
          }}
          divId="left-input"
          placeholder={English.R34}
          value={firstName}
          isError={firstNameError}
        />
        <AppInput
          type="text"
          onChange={(e) => {
            setLastNameError('')
            setLastName(formateText(String(e.target.value)))
          }}
          divId="right-input"
          placeholder={English.R35}
          value={lastName}
          isError={lastNameError}
        />
      </div>

      <div className="signup-container--row">
        <AppInput
          type="text"
          isError={errPhoneNumber}
          value={phoneNumber}
          onChange={(e) => {
            setErrPhoneNumber('')
            setPhoneNumber(
              Utility.formatPhoneNumber(e.target.value.replace(/\D/g, ''), phoneNumber)
            )
          }}
          divId="left-input"
          maxLength={14}
          placeholder={English.R36}
        />
        <AppInput
          onChange={(e) => {
            setLicenceError('')
            setLicence(String(e.target.value))
          }}
          type="text"
          divId="right-input"
          value={licence}
          isError={licenceError}
          placeholder={English.R50}
        />
      </div>
      <AppInput
        type="email"
        divId="signup-input"
        isError={errEmail}
        value={email}
        onChange={(e) => {
          if (!Utility.isValid(e.target.value)) {
            setErrEmail('')
          }
          setEmail(String(e.target.value))
        }}
        placeholder={English.R37}
      />
      <AppInput
        value={address}
        onChange={(e) => {
          setAddressError('')
          setAddress(String(e.target.value))
        }}
        isError={addressError}
        divId="signup-input"
        type="text"
        placeholder={English.R38}
      />
      {!isGoogleData && (
        <div className="signup-container--row">
          <AppInput
            onChange={(event) => {
              setErrPassword('')
              setPassword(event.target.value)
            }}
            divId="left-input"
            isPasswordEye
            value={password}
            isError={errPassword}
            placeholder={English.R23}
          />
          <AppInput
            onChange={(event) => {
              setErrConfirmPassword('')
              setErrPassword('')
              setConfirmPassword(event.target.value)
            }}
            divId="right-input"
            isPasswordEye
            value={confirmPassword}
            isError={errConfirmPassword}
            placeholder={English.R24}
          />
        </div>
      )}
      <div className="signup-container--row-check">
        <input
          className="signup-container--check"
          type="checkbox"
          checked={check}
          onChange={() => setCheck((state) => !state)}
        />
        <span className="dontacc-text">
          {English.R47} <span className="dontacc-text__singUp">{English.R144}</span>
          <span className="dontacc-text__singUp" onClick={() => onPressTermsPrivacy(EndPoints.TNC)}>
            {English.R146}
          </span>
          <span
            className="dontacc-text__singUp"
            onClick={() => onPressTermsPrivacy(EndPoints.privacy)}
          >
            {English.R145}
          </span>
        </span>
      </div>
      <AppAnimatedButton id="singup-btn" onClick={onPressRegister} title={English.R40} />
    </div>
  )
}

export default Register
