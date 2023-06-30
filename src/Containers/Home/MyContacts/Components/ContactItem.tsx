import './style.scss'

import _ from 'lodash'
import React from 'react'

import AppProfileIcon from '../../../../Components/AppProfileIcon/AppProfileIcon'

interface DataType {
  title: string
  data: any[]
}

interface ContactItemProps {
  item?: DataType
  onPress: (state: any) => void
  selected: any
  isFocusable?: boolean
}

const ContactItem = ({ item, onPress, selected, isFocusable = false }: ContactItemProps) => {
  return (
    <div className="contact-item-container">
      <span className="contact-item-container--title">{item?.title}</span>
      {_.map(item?.data, (i: any) => {
        const isFocus = selected?.id === i?.id
        return (
          <div
            onClick={() => onPress(i)}
            className={`contact-item-container--item  ${isFocus ? 'isFocus' : ''} ${
              isFocusable ? 'isFocusable' : ''
            }`}
          >
            <AppProfileIcon size={40} isNamed={i?.name} />
            <span className="contact-item-container--name">{i?.name}</span>
          </div>
        )
      })}
    </div>
  )
}

export default ContactItem
