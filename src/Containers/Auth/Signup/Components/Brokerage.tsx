import '../style.scss'

import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import AppAnimatedButton from '../../../../Components/AppAnimatedButton/AppAnimatedButton'
import AppInput from '../../../../Components/AppInput/AppInput'
import Constant from '../../../../Helpers/Constant'
import English from '../../../../Helpers/English'
import Paths from '../../../../Helpers/Paths'
import Utility from '../../../../Helpers/Utility'
import APICall from '../../../../Network/APICall'
import EndPoints from '../../../../Network/EndPoints'
import { setUserData } from '../../../../Redux/Reducers/UserSlice'

interface BrokerageProps {
  brokerData?: any
  data?: any
  onDataChange: (data: any) => void
  onLoading: (state: boolean) => void
}

const Brokerage = ({ data, onDataChange, brokerData, onLoading }: BrokerageProps) => {
  const registerData = useLocation().state?.registerData?.broker

  const [brokerName, setBrokername] = useState(
    brokerData?.brokerName || registerData?.broker_name || ''
  )
  const [brokerAddress, setBrokerAddress] = useState(
    brokerData?.brokerAddress || registerData?.broker_address || ''
  )
  const [licence, setLicence] = useState(
    brokerData?.brokerlicence || registerData?.broker_license_no || ''
  )
  const [sLNumber, setSLNumber] = useState(
    brokerData?.sLNumber || registerData?.supervisor_license_no || ''
  )
  const [PTC, setPTC] = useState(brokerData?.PTC || registerData?.title_company || '')
  const [PTCA, setPTCA] = useState(brokerData?.PTCA || registerData?.title_company_address || '')
  const [sName, setSName] = useState(brokerData?.sName || registerData?.supervisor_name || '')
  const [brokerNammeError, setBrokerNammeError] = useState('')
  const [brokerAddressError, setBrokerAddressError] = useState('')
  const [sNameError, setSNameError] = useState('')
  const [brokerLincenseError, setBrokerLincenseError] = useState('')
  const [sLNumberError, setSLNumberError] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    onDataChange({
      brokerName,
      brokerAddress,
      brokerlicence: licence,
      PTC,
      PTCA,
      sName,
      sLNumberError
    })
  }, [PTC, PTCA, brokerAddress, brokerName, licence, onDataChange, sLNumberError, sName])

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

  const onPressRegister = useCallback(() => {
    if (!Utility.isEmpty(brokerName)) {
      setBrokerNammeError(English.R58)
      return
    }
    if (!Utility.isEmpty(licence)) {
      setBrokerLincenseError(English.R54)
      return
    }
    if (!Utility.isEmpty(brokerAddress)) {
      setBrokerAddressError(English.R62)
      return
    }

    if (!Utility.isEmpty(sName)) {
      setSNameError(English.R60)
      return
    }
    if (!Utility.isEmpty(sLNumber)) {
      setSLNumberError(English.R61)
      return
    }
    const payload: any = {
      email: data?.email,
      first_name: data?.firstName,
      last_name: data?.lastName,
      phone_number: data?.phoneNumber,
      address: data?.address,
      license_no: data?.userLicence,
      broker: {
        broker_name: brokerName,
        broker_address: brokerAddress,
        broker_license_no: licence,
        supervisor_name: sName,
        supervisor_license_no: sLNumber,
        title_company: PTC,
        title_company_address: PTCA
      }
    }
    if (!data?.isGoogleData) {
      payload.password = data?.password
    }
    onLoading(true)

    APICall(
      'post',
      payload,
      data?.isGoogleData ? EndPoints.googleLogin : EndPoints.register,
      {},
      false
    )
      .then((resp: any) => {
        onLoading(false)

        if (resp?.status === 201) {
          navigate(Paths.Verification, {
            state: {
              isRegister: true,
              email: data?.email,
              registerData: payload
            }
          })
        } else if (resp?.status === 200 && data?.isGoogleData) {
          onLoginSetup(resp)
        } else {
          toast.error(resp?.data?.message)
        }
      })
      .catch((e) => {
        toast.error(String(e?.data?.message))
        onLoading(false)
      })
  }, [
    PTC,
    PTCA,
    brokerAddress,
    brokerName,
    data?.address,
    data?.email,
    data?.firstName,
    data?.isGoogleData,
    data?.lastName,
    data?.password,
    data?.phoneNumber,
    data?.userLicence,
    licence,
    navigate,
    onLoading,
    onLoginSetup,
    sLNumber,
    sName
  ])

  return (
    <div className="tab">
      <div className="signup-container--row">
        <AppInput
          isError={brokerNammeError}
          type="text"
          onChange={(e) => {
            setBrokerNammeError('')
            setBrokername(String(e.target.value.replace(/[^\w\s]/gi, '').replace(/[0-9]/g, '')))
          }}
          divId="left-input"
          value={brokerName}
          placeholder={English.R69}
        />
        <AppInput
          onChange={(e) => {
            setBrokerLincenseError('')
            setLicence(String(e.target.value))
          }}
          isError={brokerLincenseError}
          type="text"
          divId="right-input"
          value={licence}
          placeholder={English.R68}
        />
      </div>
      <AppInput
        isError={brokerAddressError}
        divId="signup-input"
        type="text"
        onChange={(e) => {
          setBrokerAddressError('')
          setBrokerAddress(String(e.target.value))
        }}
        placeholder={English.R38}
        value={brokerAddress}
      />
      <div className="signup-container--row">
        <AppInput
          isError={sNameError}
          onChange={(e) => {
            setSNameError('')
            setSName(String(e.target.value.replace(/[^\w\s]/gi, '').replace(/[0-9]/g, '')))
          }}
          divId="left-input"
          type="text"
          value={sName}
          placeholder={English.R70}
        />
        <AppInput
          onChange={(e) => {
            setSLNumberError('')
            setSLNumber(String(e.target.value))
          }}
          isError={sLNumberError}
          type="text"
          divId="right-input"
          value={sLNumber}
          placeholder={English.R45}
        />
      </div>

      <div className="signup-container--row">
        <AppInput
          onChange={(e) => setPTC(String(e.target.value))}
          type="text"
          value={PTC}
          placeholder={English.R44}
        />
      </div>
      <AppInput
        onChange={(e) => setPTCA(String(e.target.value))}
        divId="signup-input"
        type="text"
        value={PTCA}
        placeholder={English.R43}
      />

      <AppAnimatedButton id="singup-btn" onClick={onPressRegister} title={English.R42} />
    </div>
  )
}

export default Brokerage
