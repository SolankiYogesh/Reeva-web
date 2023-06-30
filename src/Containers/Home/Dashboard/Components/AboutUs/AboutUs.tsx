import './style.scss'

import React, { forwardRef } from 'react'

const AboutUs = forwardRef((_, ref) => {
  return (
    <section ref={ref} className="section">
      <h2>About US</h2>
    </section>
  )
})

export default AboutUs
