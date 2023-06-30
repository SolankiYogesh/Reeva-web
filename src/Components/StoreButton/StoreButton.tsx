import './style.scss'

import React from 'react'

import AppleButton from '../../Assets/SVG/AppleButton'
import PlayStoreButton from '../../Assets/SVG/PlayStoreButton'

const StoreButton = () => {
  return (
    <div id="social-container">
      <PlayStoreButton id="social-btn" />
      <AppleButton id="social-btn" />
    </div>
  )
}

export default StoreButton
