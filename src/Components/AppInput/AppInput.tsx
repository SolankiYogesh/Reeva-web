import './style.scss'

import React, { type InputHTMLAttributes, useCallback, useState } from 'react'

import Images from '../../Helpers/Images'

interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string
  divId?: string
  isError?: string
  isPasswordEye?: boolean
  isRightImage?: any
  onRightImageClick?: () => void
  rightImageID?: string
  isMultiLine?: boolean
}

const AppInput = (props: AppInputProps) => {
  const {
    placeholder = '',
    divId,
    isError = '',
    isPasswordEye,
    type,
    isRightImage = null,
    onRightImageClick,
    rightImageID,
    isMultiLine = false,
    ...rest
  } = props
  const [isPassword, setISPassword] = useState(isPasswordEye)

  const onPressEye = useCallback(() => {
    setISPassword((state) => !state)
  }, [])

  const onPressRightImage = useCallback(() => {
    if (onRightImageClick) {
      onRightImageClick()
    }
  }, [onRightImageClick])

  return (
    <div id={divId} className="input-group">
      {isMultiLine ? (
        <textarea
          type={isPassword ? 'password' : type}
          placeholder=" "
          className={`input ${isError ? 'error' : ''}`}
          {...rest}
        />
      ) : (
        <input
          type={isPassword ? 'password' : type}
          placeholder=" "
          className={`input ${isError ? 'error' : ''}`}
          {...rest}
        />
      )}

      <label className={`placeholder ${isMultiLine ? 'multi' : ''}`}>{placeholder}</label>
      {!!isError && <div className="error-message">{isError}</div>}
      {isPasswordEye && (
        <img
          onClick={onPressEye}
          className="input-group--eye"
          src={isPassword ? Images.eye : Images.hideEye}
        />
      )}
      {isRightImage && (
        <img
          onClick={onPressRightImage}
          id={rightImageID}
          className="input-group--eye"
          src={isRightImage}
        />
      )}
    </div>
  )
}

export default AppInput
