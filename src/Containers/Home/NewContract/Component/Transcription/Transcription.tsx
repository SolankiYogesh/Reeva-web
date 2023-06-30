import './style.scss'

import _ from 'lodash'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

import AppAnimatedButton from '../../../../../Components/AppAnimatedButton/AppAnimatedButton'
import English from '../../../../../Helpers/English'
import Paths from '../../../../../Helpers/Paths'
import APICall from '../../../../../Network/APICall'
import EndPoints from '../../../../../Network/EndPoints'
import ChatReevaItem from '../ChatReeva/ChatReevaItem'
import ChatUserItem from '../ChatUser/ChatUserItem'

interface TranscriptionProps {
  onLoad: (state: boolean) => void
  onPressNew: () => void
  contract?: any
}

const Transcription = (props: TranscriptionProps) => {
  const { onLoad, contract, onPressNew } = props
  const [message, setMessages] = useState<any[]>([])
  const navigate = useNavigate()

  const onPressOpen = useCallback(() => {
    navigate(Paths.MainDrawer + Paths.Dashboard + Paths.contractDetails, {
      state: {
        contract,
        isSend: true
      }
    })
  }, [contract, navigate])

  const getTranscription = useCallback(async () => {
    if (contract?.cache_id) {
      const url = EndPoints.getChat.replace('ID', contract?.cache_id)
      onLoad(true)
      APICall('get', {}, url)
        .then((resp: any) => {
          onLoad(false)
          if (resp?.status === 200 && resp?.data) {
            const mapData: any[] = _.map(resp?.data?.messages, (i) => {
              return {
                ...i,
                isMe: i?.username !== 'reeva',
                text: i?.transcript,
                id: uuidv4()
              }
            })
            const scrolldiv = document.getElementById('scoll-tran-dev')
            if (scrolldiv) {
              scrolldiv.scrollTop = scrolldiv.scrollHeight
            }
            setMessages(mapData)
          }
        })
        .catch((e) => {
          onLoad(false)

          toast.error(String(e?.data?.message))
        })
    }
  }, [contract?.cache_id, onLoad])

  const renderChatList = useMemo(() => {
    const ellipseTime = Number(contract?.elapsed_time || 0)
    const time = 30 * 60 - ellipseTime
    return (
      <div id="scoll-tran-dev" className="tran-container--con">
        {_.map(message, (i) => {
          return i.isMe ? (
            <ChatUserItem disabled item={i} key={i.id} />
          ) : (
            <ChatReevaItem disabled loading={false} item={i} key={i.id} />
          )
        })}
        <div className="tran-container--com">
          <span className="tran-container--create-text" onClick={onPressOpen}>
            {English.R89}
          </span>
          <span className="tran-container--time-text">
            {English.R90.replace('[time]', new Date(time * 1000).toISOString().substring(14, 16))}
          </span>
          <AppAnimatedButton onClick={onPressNew} divId="new-contract-text" title={English.R91} />
        </div>
      </div>
    )
  }, [contract?.elapsed_time, message, onPressNew, onPressOpen])

  useEffect(() => {
    getTranscription()
  }, [getTranscription])

  return <div className="tran-container">{renderChatList}</div>
}

export default Transcription
