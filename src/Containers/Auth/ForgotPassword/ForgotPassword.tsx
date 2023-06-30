import './style.scss'

import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import EmailNotFound from '../../../Assets/SVG/EmailNotFound'
import AppAnimatedButton from '../../../Components/AppAnimatedButton/AppAnimatedButton'
import AppInput from '../../../Components/AppInput/AppInput'
import AuthContainer from '../../../Components/AuthContainer/AuthContainer'
import AppModal from '../../../Components/Modal/AppModal'
import English from '../../../Helpers/English'
import Paths from '../../../Helpers/Paths'
import Utility from '../../../Helpers/Utility'
import APICall from '../../../Network/APICall'
import EndPoints from '../../../Network/EndPoints'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isModal, setISModal] = useState(false)
  const [errEmail, setErrEmail] = useState('')
  const navigate = useNavigate()
  const [isLoading, setISLoading] = useState(false)

  const onPressSendCode = useCallback(async () => {
    if (Utility.isValid(email)) {
      setErrEmail(English.R1)
      return
    }
    const payload = {
      email
    }
    setISLoading(true)
    APICall('post', payload, EndPoints.forgotPass)
      .then(async (resp: any) => {
        setISLoading(false)

        if (resp?.status === 200) {
          navigate(Paths.Verification, {
            state: {
              email
            }
          })
        } else if (resp?.status === 400) {
          setISModal(true)
        } else {
          toast.error(resp?.data?.message)
        }
      })
      .catch((e) => {
        toast.error(String(e?.data?.message))
        setISLoading(false)
      })
  }, [email, navigate])

  const onPressLogin = useCallback(() => {
    navigate(Paths.Login)
  }, [navigate])

  return (
    <>
      <AuthContainer title={English.R10} desciption={English.R11} isLoading={isLoading}>
        <span className="forgot-container--label">{English.R7}</span>
        <AppInput
          value={email}
          onChange={(event) => {
            setErrEmail('')
            setEmail(event.target.value)
          }}
          divId="forgot-input"
          type="email"
          isError={errEmail}
          placeholder={English.R27}
        />
        <AppAnimatedButton divId="fgbBTN" onClick={onPressSendCode} title={English.R33} />

        <span className="dontacc-text">
          {English.R8}{' '}
          <span className="dontacc-text__singUp" onClick={onPressLogin}>
            {English.R9}
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

export default ForgotPassword
