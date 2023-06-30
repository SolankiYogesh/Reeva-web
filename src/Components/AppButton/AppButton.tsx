import './style.scss'

import React, { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
  Image?: any
  divId?: string
  titleID?: string
  isAppGoogle?: boolean
}

const AppButton = ({ title, Image, titleID, divId, isAppGoogle = false, ...rest }: ButtonProps) => {
  return (
    <button id={divId} className={`button ${isAppGoogle ? '' : 'quote'}`} {...rest}>
      {!!Image && <div className="button__image">{Image}</div>}
      <span id={titleID} className="gredient-text">
        {title}
      </span>
    </button>
  )
}

export default AppButton
