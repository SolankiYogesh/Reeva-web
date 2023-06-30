import './style.scss'

import _ from 'lodash'
import React, { type ButtonHTMLAttributes } from 'react'

interface AppButtonProps extends ButtonHTMLAttributes<HTMLInputElement> {
  title?: string
  divId?: string
  isImage?: any
  imageId?: string
}

const AppAnimatedButton = (props: AppButtonProps) => {
  const { title, divId = '', isImage, imageId = '' } = props
  let rest: any = props
  if (props.isImage) {
    rest = _.omit(props, 'isImage')
  }
  if (props.divId) {
    rest = _.omit(props, 'divId')
  }

  return (
    <button id={divId} className="quote" {...rest}>
      {isImage && <img className="gredient-img" id={imageId} src={isImage} />}
      {title && <span className="gredient-text">{title}</span>}
    </button>
  )
}

export default AppAnimatedButton
