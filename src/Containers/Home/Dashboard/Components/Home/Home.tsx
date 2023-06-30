import './style.scss'

import React, { forwardRef } from 'react'

const Home = forwardRef((_, ref) => {
  return (
    <section ref={ref} className="section">
      <h2>Home</h2>
    </section>
  )
})

export default Home
