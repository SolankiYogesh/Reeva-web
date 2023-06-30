import './style.scss'

import React, { type CSSProperties, useEffect } from 'react'

import CloseButton from '../../Assets/SVG/CloseButton'
import AppAnimatedButton from '../AppAnimatedButton/AppAnimatedButton'

interface AppModalProps {
  onClose?: () => void
  isVisible?: boolean
  isImage?: any
  title?: string
  descText?: string
  btnText?: string
  onPress?: () => void
  buttonStyle?: CSSProperties
  containerStyle?: CSSProperties
}

const AppModal = (props: AppModalProps) => {
  const {
    isVisible,
    onClose,
    isImage,
    title,
    descText,
    btnText,
    buttonStyle = {},
    onPress = () => {},
    containerStyle = {}
  } = props

  useEffect(() => {
    const modal = document.querySelector('.modal-container')
    if (isVisible) {
      modal?.classList.add('visible')
    } else {
      modal?.classList.remove('visible')
      if (onClose) {
        onClose()
      }
    }
  }, [isVisible, onClose])

  return (
    <div className="modal-container">
      <div style={containerStyle} className="modal-container__inner">
        <div
          onClick={() => {
            if (onClose) {
              onClose()
            }
          }}
          className="close"
        >
          <CloseButton />
        </div>
        {!!isImage && isImage}
        {!!title && <span className="modal-container__bold-text">{title}</span>}
        {!!descText && <span className="modal-container__small-text">{descText}</span>}
        {!!btnText && <AppAnimatedButton style={buttonStyle} onClick={onPress} title={btnText} />}
      </div>
    </div>
  )
}

export default AppModal
