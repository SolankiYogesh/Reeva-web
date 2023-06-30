import './style.scss'

import React from 'react'

import Images from '../../../../Helpers/Images'

interface TemplateItemProps {
  item?: any
  onPress: () => void
  isFocus: boolean
}
const TemplateItem = ({ item, onPress = () => {}, isFocus }: TemplateItemProps) => {
  return (
    <div onClick={onPress} className={`template--container ${isFocus ? 'focus' : ''}`}>
      <span className="template--container--title">{item?.email_type}</span>
      <img className="template--container--send" src={Images.template_send} />
    </div>
  )
}

export default TemplateItem
