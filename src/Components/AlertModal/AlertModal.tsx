import './style.scss'

import React, { type CSSProperties } from 'react'

import CloseButton from '../../Assets/SVG/CloseButton'
import AppAnimatedButton from '../AppAnimatedButton/AppAnimatedButton'
import AppButton from '../AppButton/AppButton'

interface AlertModalProps {
  onClose?: () => void
  containerStyle?: CSSProperties
  cancelText?: string
  deleteText?: string
  onPress: () => void
  alertText?: string
}

const AlertModal = ({
  onClose = () => {},
  containerStyle = {},
  cancelText = '',
  deleteText = '',
  onPress = () => {},
  alertText = ''
}: AlertModalProps) => {
  return (
    <div className="alert-modal-container">
      <div style={containerStyle} className="alert-modal-container__inner">
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
        <p>{alertText}</p>
        <div className="cd-buttons">
          <AppButton divId="alert-button" onClick={onClose} title={cancelText} />
          <AppAnimatedButton divId="alert-button" onClick={onPress} title={deleteText} />
        </div>
      </div>
    </div>
  )
}

export default AlertModal
