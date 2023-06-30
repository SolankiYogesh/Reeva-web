import './style.scss'

import React, { forwardRef } from 'react'

const Pricing = forwardRef((_, ref) => {
  return (
    <section ref={ref} className="section">
      <h2>Pricing</h2>
    </section>
  )
})

export default Pricing
