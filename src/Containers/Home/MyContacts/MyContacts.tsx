import './style.scss'

import _ from 'lodash'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import AppAnimatedButton from '../../../Components/AppAnimatedButton/AppAnimatedButton'
import AppInput from '../../../Components/AppInput/AppInput'
import AppProfileIcon from '../../../Components/AppProfileIcon/AppProfileIcon'
import EmptyComponent from '../../../Components/EmptyComponent/EmptyComponent'
import AppLoader, { type AppLoaderRef } from '../../../Components/Loader/AppLoader'
import Constant from '../../../Helpers/Constant'
import English from '../../../Helpers/English'
import Images from '../../../Helpers/Images'
import Paths from '../../../Helpers/Paths'
import Utility from '../../../Helpers/Utility'
import APICall from '../../../Network/APICall'
import EndPoints from '../../../Network/EndPoints'
import { setPlanData } from '../../../Redux/Reducers/UserSlice'
import VoiceChatHeader from '../NewContract/Component/VoiceChatHeader'
import ContactItem from './Components/ContactItem'

const MyContacts = () => {
  const [contacts, setContacts] = useState<any[]>([])
  const loaderRef = useRef<AppLoaderRef>(null)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [errEmail, setErrEmail] = useState('')
  const [email, setEmail] = useState('')
  const [search, setSearch] = useState('')
  const allContactRef = useRef<any>([])
  const location = useLocation()
  const template = location?.state?.template
  const contract = location?.state?.contract
  const user = useSelector((state: any) => state?.user?.userData)
  const username = `${user?.first_name} ${user?.last_name}`
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isCalled = useRef(false)

  const onLoad = useCallback((state: boolean) => {
    if (loaderRef.current) {
      loaderRef.current?.showLoader(state)
    }
  }, [])

  const onPress = useCallback((item: any) => {
    setSelectedUser(item)
    setEmail(item?.email)
  }, [])

  const getAllContactSync = useCallback(
    async (isLoader = true) => {
      onLoad(isLoader)

      APICall('get', {}, EndPoints.getContacts)
        .then((resp: any) => {
          onLoad(false)

          if ((resp?.status === 200 || resp?.status === 400) && resp?.data?.data) {
            const formateData = _.map(resp?.data?.data || [], (i) => {
              return {
                ...i,
                value: i?.name
              }
            })

            const filterNumbers = _.filter(
              formateData,
              (i) => i?.number !== 'n/a' && i?.number !== 'null' && !!i?.number
            )
            const filterUniqueNumbers = _.uniqBy(filterNumbers, (i) => i?.number)
            allContactRef.current = filterUniqueNumbers

            onPress(filterUniqueNumbers[0])
            setContacts(filterUniqueNumbers)
          }
        })
        .catch((e) => {
          toast.error(String(e?.data?.message))
          onLoad(false)
        })
    },
    [onLoad, onPress]
  )

  useEffect(() => {
    if (!isCalled.current) {
      isCalled.current = true
      getAllContactSync()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onContactUpdate = useCallback(async () => {
    if (_.trim(email)) {
      const url = EndPoints.updateContact.replace('ID', selectedUser?.id)
      const payload = {
        email,
        name: selectedUser?.name,
        number: selectedUser?.number
      }
      APICall('put', payload, url)
    }
  }, [email, selectedUser?.id, selectedUser?.name, selectedUser?.number])

  const onPressSendContract = useCallback(() => {
    if (Utility.isValid(email)) {
      setErrEmail(English.R1)
      return
    }

    onContactUpdate()
    if (selectedUser?.email && contract?.cache_id) {
      const payload = {
        email_add: email,
        cache_id: contract?.cache_id
      }
      onLoad(true)

      APICall('post', payload, EndPoints.sendOffer)
        .then(async (resp: any) => {
          onLoad(false)

          if (resp?.status === 200 && resp?.data?.sendgrid_response_code === 200) {
            toast.success('offer sent!')
            navigate(Paths.MainDrawer + Paths.Dashboard + Paths.MyContacts)
            if (user?.plan_details?.plan_name === Constant.Plans.Free) {
              dispatch(
                setPlanData({
                  monthly_send_emails: Number(user?.plan_details?.monthly_send_emails || 0) + 1
                })
              )
            }
          }
        })
        .catch((e) => {
          toast.error(String(e?.data?.message))
          onLoad(false)
        })
    } else {
      navigate(Paths.MainDrawer + Paths.Dashboard + Paths.DraftedContracts, {
        state: {
          contact: selectedUser
        }
      })
    }
  }, [
    contract?.cache_id,
    dispatch,
    email,
    navigate,
    onContactUpdate,
    onLoad,
    selectedUser,
    user?.plan_details?.monthly_send_emails,
    user?.plan_details?.plan_name
  ])

  const onPressSendTemplate = useCallback(() => {
    if (Utility.isValid(email)) {
      setErrEmail(English.R1)
      return
    }
    onContactUpdate()
    if (template) {
      const payload = {
        email_type: template?.name,
        email_body: template?.text,
        to_email: email,
        receiver_name: selectedUser?.name,
        from_email: user?.email,
        sender_name: username
      }
      onLoad(true)
      APICall('post', payload, EndPoints.getEmailTemplates)
        .then(async (resp: any) => {
          onLoad(false)
          if (resp?.status === 200 && resp?.data) {
            toast.success('Email sent!')
            navigate(Paths.MainDrawer + Paths.Dashboard + Paths.MyContacts)
          }
        })
        .catch((e) => {
          toast.error(String(e?.data?.message))
          onLoad(false)
        })
    } else {
      navigate(Paths.MainDrawer + Paths.Dashboard + Paths.EmailTemplates, {
        state: {
          contact: selectedUser
        }
      })
    }
  }, [email, navigate, onContactUpdate, onLoad, selectedUser, template, user?.email, username])

  const renderContactsList = useMemo(() => {
    const DATA = _(contacts)
      .orderBy(['value'], ['asc'])
      .groupBy((item) => {
        const firstChar = item?.value?.charAt(0)?.toUpperCase()
        return /[A-Z]/.test(firstChar) ? firstChar : '#'
      })
      .map((value, key) => ({ title: key, data: value }))
      .sortBy([(group) => (group.title === '#' ? 1 : 0)])
      .value()
    const sectionsData = _.reduce(
      DATA,
      (result: any, { title, data }) => {
        const filteredData = _.filter(data, (item) => {
          const searchDataItem = _.get(item, 'value', item)

          return _.includes(_.toLower(searchDataItem), _.toLower(search))
        })

        if (filteredData.length) {
          result.push({ title, data: filteredData })
        }

        return result
      },
      []
    )
    return _.map(sectionsData, (i) => {
      return (
        <ContactItem
          selected={selectedUser}
          isFocusable
          key={i?.title}
          item={i}
          onPress={onPress}
        />
      )
    })
  }, [contacts, onPress, search, selectedUser])

  return (
    <div className="contact-container">
      <VoiceChatHeader total={0} current={0} isScore={false} isTemplate title={English.R112} />
      {contacts.length > 0 ? (
        <div className="contact-container--inner">
          <div className="contact-container--inner-scroll">
            <AppInput
              isRightImage={Images.search}
              value={search}
              style={{
                background: 'linear-gradient(91.48deg, #8a63f4 0.29%, #b090ff 100%)',
                opacity: 0.07
              }}
              placeholder={English.R115}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="contact-container--inner-scroll-inner">{renderContactsList}</div>
          </div>
          <div className="contact-container--inner-template">
            <AppProfileIcon borderRadius={300} size={120} isNamed={selectedUser?.name} />
            <span className="contact-container--inner-template title">{selectedUser?.name}</span>
            <AppInput
              type="text"
              value={Utility.formateNumber(selectedUser?.number)}
              disabled
              divId="contact-input"
              maxLength={14}
              placeholder={English.R36}
            />
            <AppInput
              value={email}
              divId="contact-input"
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
            <div className="contact-container--inner-template-inner">
              {!template && (
                <AppAnimatedButton
                  onClick={onPressSendContract}
                  divId="send-btn-contact"
                  title={English.R113}
                />
              )}
              {!contract && (
                <AppAnimatedButton
                  onClick={onPressSendTemplate}
                  divId="send-btn-contact"
                  title={English.R114}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <EmptyComponent title={English.R117} />
      )}
      <AppLoader ref={loaderRef} />
    </div>
  )
}

export default MyContacts
