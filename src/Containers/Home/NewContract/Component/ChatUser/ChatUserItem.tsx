import './style.scss'

import React from 'react'
import { useSelector } from 'react-redux'

import AppProfileIcon from '../../../../../Components/AppProfileIcon/AppProfileIcon'

interface ChatUserItemProps {
  item: any
  disabled?: boolean
}

const ChatUserItem = ({ item, disabled = false }: ChatUserItemProps) => {
  const user = useSelector((state: any) => state?.user?.userData)
  return (
    <div className={`chat-user-container ${disabled ? 'disabledAnim' : ''}`}>
      <AppProfileIcon
        style={{
          marginTop: 'auto'
        }}
        size={30}
        url={user?.profile_image}
      />
      <div className="chat-user-container--user-item">{item?.text}</div>
    </div>
  )
}

export default ChatUserItem
