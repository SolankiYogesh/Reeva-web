import './style.scss'

import _ from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import AppAnimatedButton from '../../../Components/AppAnimatedButton/AppAnimatedButton'
import EmptyComponent from '../../../Components/EmptyComponent/EmptyComponent'
import AppLoader, { type AppLoaderRef } from '../../../Components/Loader/AppLoader'
import English from '../../../Helpers/English'
import Images from '../../../Helpers/Images'
import Paths from '../../../Helpers/Paths'
import APICall from '../../../Network/APICall'
import EndPoints from '../../../Network/EndPoints'
import VoiceChatHeader from '../NewContract/Component/VoiceChatHeader'
import TemplateItem from './Components/TemplateItem'

const EmailTemplates = () => {
  const user = useSelector((state: any) => state?.user?.userData)
  const [templates, setTemplates] = useState([])
  const navigate = useNavigate()
  const loaderRef = useRef<AppLoaderRef>(null)
  const username = `${user?.first_name} ${user?.last_name}`
  const [isEditable, setISEditable] = useState(false)
  const location = useLocation()
  const isCalled = useRef(false)
  const [bodyText, setBodyText] = useState({
    text: '',
    name: '',
    index: 0
  })
  const contact = location.state?.contact

  const onLoad = useCallback((state: boolean) => {
    if (loaderRef.current) {
      loaderRef.current?.showLoader(state)
    }
  }, [])

  useEffect(() => {
    const input = document.getElementById('textarea-templte')
    if (input && isEditable) {
      input.focus()
    }
  }, [isEditable])

  const onPress = useCallback(
    (item: any, index: number) => {
      setISEditable(false)

      const regex = /<\/?body>|<br\s?\/?>/gi

      const fomratedText = String(item?.email_body)
        .replace(regex, '')
        ?.replace('{{ receiver_name }}', contact?.name || '{{ receiver_name }}')
        .replace('{{ sender_name }}', username || '{{ sender_name }}')

      setBodyText({
        text: fomratedText,
        name: item?.email_type,
        index
      })
    },
    [contact, username]
  )

  const onPressSend = useCallback(() => {
    if (contact) {
      const payload = {
        email_type: bodyText?.name,
        email_body: bodyText?.text,
        to_email: contact?.email,
        receiver_name: contact?.name,
        from_email: user?.email,
        sender_name: username
      }
      onLoad(true)
      APICall('post', payload, EndPoints.getEmailTemplates)
        .then(async (resp: any) => {
          onLoad(false)
          if (resp?.status === 200 && resp?.data) {
            toast.success('Email sent!')
            navigate(Paths.MainDrawer + Paths.Dashboard + Paths.EmailTemplates)
          }
        })
        .catch((e) => {
          toast.error(String(e?.data?.message))
          onLoad(false)
        })
    } else {
      navigate(Paths.MainDrawer + Paths.Dashboard + Paths.MyContacts, {
        state: {
          template: bodyText
        }
      })
    }
  }, [bodyText, contact, navigate, onLoad, user?.email, username])

  const getEmailTemplates = useCallback(async () => {
    onLoad(true)
    APICall('get', {}, EndPoints.getEmailTemplates)
      .then((resp: any) => {
        onLoad(false)

        if (resp?.status === 200 && resp?.data) {
          onPress(resp?.data?.data[0], 0)
          setTemplates(resp?.data?.data)
        } else {
          toast.error(String(resp?.data?.message))
        }
      })
      .catch((e) => {
        toast.error(String(e?.data?.message))
        onLoad(false)
      })
  }, [onLoad, onPress])

  useEffect(() => {
    if (!isCalled.current) {
      isCalled.current = true
      getEmailTemplates()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="email-container">
      <VoiceChatHeader
        current={Number(user?.plan_details?.monthly_templates)}
        total={Number(user?.plan_details?.template_limit)}
        isTemplate
        image={Images.email_contract}
        text1={English.R106}
        text2={English.R107}
      />
      {templates.length > 0 ? (
        <div className="email-container--inner">
          <div className="email-container--inner-scroll">
            {_.map(templates, (i: any, index: number) => {
              return (
                <TemplateItem
                  key={i?.email_type}
                  isFocus={bodyText.index === index}
                  onPress={() => onPress(i, index)}
                  item={i}
                />
              )
            })}
          </div>
          <div className="email-container--inner-template">
            <div className="email-container--inner-title-header">
              <span className="email-container--inner-title-header title">{bodyText?.name}</span>
              <img
                onClick={() => setISEditable((state) => !state)}
                src={isEditable ? Images.right : Images.pencil}
                className="email-container--inner-title-header pencil"
              />
            </div>
            <textarea
              className="email-container--inner-input"
              disabled={!isEditable}
              onChange={(event: any) => {
                setBodyText({
                  name: bodyText.name,
                  text: event.target.value,
                  index: bodyText.index
                })
              }}
              id="textarea-templte"
              value={bodyText.text}
              rows="5"
            />
            <AppAnimatedButton
              divId="send-template-btn"
              title={English.R108}
              onClick={onPressSend}
              isImage={Images.template_send}
            />
          </div>
        </div>
      ) : (
        <EmptyComponent title={English.R118} />
      )}
      <AppLoader ref={loaderRef} />
    </div>
  )
}

export default EmailTemplates
