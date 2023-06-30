import './style.scss'

import React, { useCallback, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import AppAnimatedButton from '../../../Components/AppAnimatedButton/AppAnimatedButton'
import AppInput from '../../../Components/AppInput/AppInput'
import { type AppLoaderRef } from '../../../Components/Loader/AppLoader'
import AppModal from '../../../Components/Modal/AppModal'
import English from '../../../Helpers/English'
import Images from '../../../Helpers/Images'
import Paths from '../../../Helpers/Paths'
import Utility from '../../../Helpers/Utility'
import APICall from '../../../Network/APICall'
import EndPoints from '../../../Network/EndPoints'
import VoiceChatHeader from '../NewContract/Component/VoiceChatHeader'

const Feedback = () => {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const [subjectErr, setSubjectErr] = useState('')
  const [messageErr, setMessageErr] = useState('')

  const loaderRef = useRef<AppLoaderRef>(null)
  const userData = useSelector((state: any) => state?.user?.userData)

  const navigate = useNavigate()

  const [modalVisible, setModalVisible] = useState(false)

  const onLoad = useCallback((state: boolean) => {
    if (loaderRef.current) {
      loaderRef.current?.showLoader(state)
    }
  }, [])

  const onPressSave = useCallback(() => {
    if (!Utility.isEmpty(subject)) {
      setSubjectErr(English.R134)
      return
    }
    if (!Utility.isEmpty(message)) {
      setMessageErr(English.R135)
      return
    }

    const payload: any = {
      email: userData?.email,
      subject,
      message
    }

    onLoad(true)

    APICall('post', payload, EndPoints.reportIssue, {}, true)
      .then((resp: any) => {
        onLoad(false)

        if (resp?.status === 200) {
          // toast.success(resp?.data?.message)
          // navigate(Paths.MainDrawer + Paths.Dashboard + Paths.NewContract)
          setModalVisible(true)
          setSubject('')
          setMessage('')
        } else {
          onLoad(false)
          toast.error(resp?.data?.message)
        }
      })
      .catch((e) => {
        onLoad(false)
        toast.error(String(e?.data?.message))
      })
  }, [subject, message, userData?.email, onLoad])

  return (
    <div className="feedback-container">
      <VoiceChatHeader title={English.R132} isScore={false} isTemplate total={0} current={0} />
      <div className="feedback-container--input-subject">
        <AppInput
          placeholder={English.R130}
          value={subject}
          onChange={(event) => {
            setSubjectErr('')
            setSubject(event.target.value)
          }}
          isError={subjectErr}
        />
        <AppInput
          isMultiLine
          id="msg-input"
          placeholder={English.R131}
          value={message}
          onChange={(event) => {
            setMessageErr('')
            setMessage(event.target.value)
          }}
          isError={messageErr}
        />
        <AppAnimatedButton divId="feedback-button" onClick={onPressSave} title={English.R15} />
      </div>
      <AppModal
        isVisible={modalVisible}
        btnText={English.R136}
        descText={English.R138}
        title={English.R137}
        onClose={() => setModalVisible(false)}
        isImage={<img src={Images.feedback_report} />}
        onPress={() => {
          setModalVisible(false)
          navigate(Paths.MainDrawer + Paths.Dashboard + Paths.NewContract)
        }}
      />
    </div>
  )
}

export default Feedback
