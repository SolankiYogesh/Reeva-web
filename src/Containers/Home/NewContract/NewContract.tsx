import './style.scss'

import Filter from 'bad-words'
import _ from 'lodash'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useStateRef from 'react-usestateref'
import { v4 as uuidv4 } from 'uuid'

import AlertModal from '../../../Components/AlertModal/AlertModal'
import AppAnimatedButton from '../../../Components/AppAnimatedButton/AppAnimatedButton'
import AppInput from '../../../Components/AppInput/AppInput'
import AppProfileIcon from '../../../Components/AppProfileIcon/AppProfileIcon'
import AppLoader, { type AppLoaderRef } from '../../../Components/Loader/AppLoader'
import Constant from '../../../Helpers/Constant'
import English from '../../../Helpers/English'
import Images from '../../../Helpers/Images'
import Paths from '../../../Helpers/Paths'
import Utility from '../../../Helpers/Utility'
import APICall from '../../../Network/APICall'
import EndPoints from '../../../Network/EndPoints'
import { setPlanData } from '../../../Redux/Reducers/UserSlice'
import ChatReevaItem from './Component/ChatReeva/ChatReevaItem'
import ChatUserItem from './Component/ChatUser/ChatUserItem'
import Transcription from './Component/Transcription/Transcription'
import VoiceChatHeader from './Component/VoiceChatHeader'

// Generate a random index

const NewContract = () => {
  const [masssage, setMassages, masssageRef] = useStateRef<any[]>([])
  const [text, setText, textRef] = useStateRef('')
  const input = document.getElementById('voice-input')
  const scrolldiv = document.getElementById('scoll-dev')
  const plan_details = useSelector((state: any) => state?.user?.userData?.plan_details)
  const [contract, setContract] = useStateRef(null)
  const [loadingID, setLoadingID] = useStateRef('')
  const [viewIndex, setViewIndex] = useStateRef(1)
  const dispatch = useDispatch()
  const loaderRef = useRef<AppLoaderRef>(null)
  const [isDisable, setISDisable] = useStateRef(false)
  const [isAlert, setISAlert] = useState(false)
  const navigate = useNavigate()
  const filter = useMemo(
    () =>
      new Filter({
        placeHolder: ' '
      }),
    []
  )

  const scrolltoBottom = useCallback(() => {
    if (scrolldiv) {
      scrolldiv.scrollTop = scrolldiv.scrollHeight
    }
  }, [scrolldiv])

  const onKeyDown = useCallback((event: any) => {
    if (event.keyCode === 13) {
      event.preventDefault() // Prevent form submission
      const sendButton = document.getElementById('voice-send')
      if (sendButton) {
        sendButton.click()
      }
    }
  }, [])

  const onPressUpgrade = useCallback(() => {
    navigate(Paths.MainDrawer + Paths.Dashboard + Paths.PricingPlans)
  }, [navigate])

  const onPressSend = useCallback(
    async (text: string) => {
      if (
        plan_details &&
        Number(plan_details?.monthly_contracts) >= Number(plan_details?.contract_limit) &&
        plan_details?.plan_name === Constant.Plans.Free
      ) {
        setISAlert(true)
        setText('')
        return
      }

      if (_.trim(text)) {
        setISDisable(true)
        if (viewIndex === 1) {
          setViewIndex(2)
        }
        const lastItem = _.findLast(masssage, (i) =>
          Boolean(i?.instruction && i?.instruction !== 'error')
        )

        if (input) {
          input.blur()
        }
        setMassages((state) => {
          const clone = Utility.deepClone(state)
          clone.push({
            isMe: true,
            id: uuidv4(),
            text: filter.clean(_.trim(text))
          })

          return clone
        })
        scrolltoBottom()
        await Utility.wait(500)
        setMassages((state) => {
          const clone = Utility.deepClone(state)
          clone.push({
            isMe: false,
            id: uuidv4(),
            text: '',
            instruction: ''
          })
          return clone
        })
        scrolltoBottom()
        const lastIndex = Number(masssageRef.current?.length) - 1
        setLoadingID(masssageRef.current[lastIndex]?.id)
        setText('')
        const payload: any = {
          prompt: Utility.addSpaceToDollarNumber(text)
        }

        if (lastItem?.instruction) {
          payload.instruction = lastItem?.instruction
        }

        APICall('post', payload, EndPoints.sendPrompt)
          .then(async (resp: any) => {
            setLoadingID('')
            if (resp?.status === 200 && resp?.data) {
              if (
                _.includes(resp?.data?.instruction, 'success') &&
                !(
                  _.includes(resp?.data?.transcript, 'Contact') ||
                  _.includes(resp?.data?.transcript, 'contact')
                )
              ) {
                const contractsResponse: any = await APICall('get', {}, EndPoints.getOffers).catch(
                  () => {}
                )
                const contract = _.find(
                  contractsResponse?.data?.contracts,
                  (i) => i?.filled_form === `/${resp?.data?.transcript}`
                )

                setContract(contract)
                setViewIndex(3)
                if (plan_details?.plan_name === Constant.Plans.Free) {
                  dispatch(
                    setPlanData({
                      monthly_contracts: Number(plan_details?.monthly_contracts || 0) + 1
                    })
                  )
                }
                return
              }
              if (resp?.data?.transcript) {
                setMassages((state) => {
                  const clone = Utility.deepClone(state)
                  clone[lastIndex] = {
                    ...clone[lastIndex],
                    text: resp?.data?.transcript,
                    instruction: resp?.data?.instruction
                  }
                  return clone
                })
                scrolltoBottom()
              }
            }
          })
          .catch((e: any) => {
            if (e?.status === 500) {
              setLoadingID('')
              setMassages((state) => {
                const clone = Utility.deepClone(state)
                clone[lastIndex] = {
                  ...clone[lastIndex],
                  text: 'Hmm, Something went wrong. We are working on server. Please try again after sometimes.',
                  instruction: 'error'
                }
                return clone
              })
            }
          })
      }
    },
    [
      dispatch,
      filter,
      input,
      masssage,
      masssageRef,
      plan_details,
      scrolltoBottom,
      setContract,
      setISDisable,
      setLoadingID,
      setMassages,
      setText,
      setViewIndex,
      viewIndex
    ]
  )

  const renderChatList = useMemo(() => {
    return (
      <div id="scoll-dev" className="voice-container--scroll-container">
        {_.map(masssage, (i) => {
          return i.isMe ? (
            <ChatUserItem item={i} key={i.id} />
          ) : (
            <ChatReevaItem
              onTypingEnd={() => {
                setISDisable(false)
              }}
              loading={i.id === loadingID}
              item={i}
              key={i.id}
            />
          )
        })}
      </div>
    )
  }, [loadingID, masssage, setISDisable])

  const renderViews = useMemo(() => {
    return (
      <div className="voice-container--static-container">
        <AppProfileIcon borderRadius={300} size={150} url={Images.Reeva} />
        <span className="voice-container--static-text">{English.R86}</span>
        <AppAnimatedButton title={English.R87} onClick={async () => onPressSend('Hii')} />
      </div>
    )
  }, [onPressSend])

  const onLoad = useCallback((state: boolean) => {
    if (loaderRef) {
      loaderRef.current?.showLoader(state)
    }
  }, [])

  const onPressNew = useCallback(() => {
    setMassages([])
    setText('')
    setContract(null)
    setLoadingID('')
    setViewIndex(2)
  }, [setContract, setLoadingID, setMassages, setText, setViewIndex])

  const renderTypescript = useMemo(() => {
    return <Transcription contract={contract} onPressNew={onPressNew} onLoad={onLoad} />
  }, [contract, onLoad, onPressNew])

  return (
    <div className="voice-container">
      <VoiceChatHeader
        current={Number(plan_details?.monthly_contracts)}
        total={Number(plan_details?.contract_limit)}
        onPress={onPressUpgrade}
      />
      {viewIndex === 1 ? renderViews : viewIndex === 2 ? renderChatList : renderTypescript}
      <AppInput
        isRightImage={Images.send}
        divId="voice-input"
        type="text"
        disabled={isDisable}
        rightImageID="voice-send"
        value={text}
        onKeyDown={onKeyDown}
        onChange={(event) => setText(event.target.value)}
        onRightImageClick={async () => onPressSend(textRef.current)}
        placeholder={English.R78}
      />
      <AppLoader ref={loaderRef} />
      {isAlert && (
        <AlertModal
          onPress={onPressUpgrade}
          alertText={English.R149}
          cancelText={English.R121}
          deleteText={English.R85}
          onClose={() => setISAlert(false)}
        />
      )}
    </div>
  )
}

export default NewContract
