import './style.scss'

import React from 'react'
import TypeWriter from 'react-typewriter'

import AppProfileIcon from '../../../../../Components/AppProfileIcon/AppProfileIcon'
import Images from '../../../../../Helpers/Images'
import Typing from './Typing'

interface ChatReevaItemProps {
  item: any
  loading: boolean
  disabled?: boolean
  onTypingEnd?: () => void
}
const ChatReevaItem = ({
  item,
  loading = false,
  disabled = false,
  onTypingEnd = () => {}
}: ChatReevaItemProps) => {
  return (
    <div className={`chat-reeva-container ${disabled ? 'disabledAnim' : ''}`}>
      <AppProfileIcon
        style={{
          marginTop: 'auto'
        }}
        size={30}
        url={Images.Reeva}
      />
      {loading && !item?.text ? (
        <Typing />
      ) : disabled ? (
        <div className="chat-reeva-container--reeva-item">{item?.text}</div>
      ) : (
        <TypeWriter
          initDelay={0}
          maxDelay={50}
          minDelay={10}
          onTypingEnd={onTypingEnd}
          className="chat-reeva-container--reeva-item"
          typing={1}
        >
          {item?.text}
        </TypeWriter>
      )}
    </div>
  )
}

export default ChatReevaItem
