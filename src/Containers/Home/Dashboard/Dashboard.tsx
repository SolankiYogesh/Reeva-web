import './style.scss'

import React, { useCallback, useEffect, useRef } from 'react'

import { emitter } from '../../../Helpers/Constant'
import AboutUs from './Components/AboutUs/AboutUs'
import Home from './Components/Home/Home'
import Pricing from './Components/Pricing/Pricing'

const Dashboard = () => {
  const sectionRefs = useRef<any[]>([null, null, null])

  const scrollToSection = useCallback(
    (index: number) => {
      if (sectionRefs.current[index]) {
        sectionRefs.current[index]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    },
    [sectionRefs]
  )

  useEffect(() => {
    const emit = emitter.addListener('onSectionChanged', (index: number) => {
      scrollToSection(index)
    })

    return () => {
      if (emit) {
        emit?.remove()
      }
    }
  }, [scrollToSection])

  return (
    <div className="app-container">
      <Home ref={sectionRefs.current[0]} />
      <AboutUs ref={sectionRefs.current[1]} />
      <Pricing ref={sectionRefs.current[2]} />
    </div>
  )
}

export default Dashboard
