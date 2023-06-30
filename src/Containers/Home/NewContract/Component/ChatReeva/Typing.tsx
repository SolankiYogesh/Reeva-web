import './style.scss'

import React, { useEffect, useRef, useState } from 'react'

import English from '../../../../../Helpers/English'

const Typing = () => {
  const [dots, setDots] = useState('')
  const typingAnimation = useRef<NodeJS.Timer>()

  useEffect(() => {
    typingAnimation.current = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length >= 3) {
          return ''
        }
        return `${prevDots}.`
      })
    }, 500)

    return () => {
      if (typingAnimation.current) {
        clearInterval(typingAnimation.current)
      }
    }
  }, [])
  return <span className="chat-reeva-container--reeva-item">{English.R83 + dots}</span>
}

export default Typing
