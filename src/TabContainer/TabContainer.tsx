import './style.scss'

import React, { useEffect, useState } from 'react'

interface TabContainerProps {
  onChange: (id: number) => void
  value: number
}

const TabContainer = ({ onChange, value }: TabContainerProps) => {
  const [isChecked, setISChcked] = useState(false)

  useEffect(() => {
    setISChcked(value === 2)
  }, [value])
  return (
    <div className="tab-container">
      <div
        id="registerTab"
        className={`tab-container--tab ${!isChecked ? 'visible' : ''}`}
        onClick={() => {
          setISChcked(false)
          onChange(1)
        }}
      >
        1
      </div>
      <div
        id="brokerageTab"
        className={`tab-container--tab ${isChecked ? 'visible' : ''}`}
        onClick={() => {
          setISChcked(true)
          onChange(2)
        }}
      >
        2
      </div>
    </div>
  )
}

export default TabContainer
