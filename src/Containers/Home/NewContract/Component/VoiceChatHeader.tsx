import './style.scss'

import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import AppProfileIcon from '../../../../Components/AppProfileIcon/AppProfileIcon'
import Constant from '../../../../Helpers/Constant'
import English from '../../../../Helpers/English'
import Images from '../../../../Helpers/Images'
import Utility from '../../../../Helpers/Utility'

interface VoiceChatHeaderProps {
  isTemplate?: boolean
  total: number
  current: number
  image?: any
  text1?: string
  text2?: string
  isScore?: boolean
  title?: string
  onPress?: () => void
}

const VoiceChatHeader = ({
  image = Images.contract,
  isTemplate = false,
  total,
  current,
  text1 = English.R81,
  text2 = English.R82,
  isScore = true,
  title = English.R105,
  onPress
}: VoiceChatHeaderProps) => {
  const user = useSelector((state: any) => state?.user?.userData)

  const remianingContacts = useMemo(() => {
    const count = total - current
    return count < 0 ? 0 : count
  }, [total, current])

  return (
    <div className="voice-chat-header">
      {isTemplate ? (
        <span className="voice-chat-header--template">{title}</span>
      ) : (
        <div className="voice-chat-header--inner-text-container">
          <AppProfileIcon borderRadius={100} url={Images.Reeva} />
          <div className="voice-chat-header--text-container">
            <span className="voice-chat-header--title">{English.R88 + user.first_name}</span>
            <span className="voice-chat-header--hint-text">
              {English.R80 + Utility.getTimeString()}
            </span>
          </div>
        </div>
      )}
      {user?.plan_details && user?.plan_details?.plan_name === Constant.Plans.Free && isScore && (
        <div className="voice-chat-header--score-container">
          <img src={image} className="voice-chat-header--score-img" />
          {remianingContacts === 0 ? (
            <span className="voice-chat-header--score-text">
              {remianingContacts + English.R84}
              <span onClick={onPress} className="voice-chat-header--score-text active">
                {English.R85}
              </span>
            </span>
          ) : (
            <span className="voice-chat-header--score-text">
              {text1}
              <span className="voice-chat-header--score-text active">{remianingContacts}</span>
              {text2}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default VoiceChatHeader
