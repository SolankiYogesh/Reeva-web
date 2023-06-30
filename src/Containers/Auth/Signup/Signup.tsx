import './style.scss'

import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import AuthContainer from '../../../Components/AuthContainer/AuthContainer'
import English from '../../../Helpers/English'
import TabContainer from '../../../TabContainer/TabContainer'
import Brokerage from './Components/Brokerage'
import Register from './Components/Register'

const Signup = () => {
  const [tab, setTab] = useState(1)
  const [data, setData] = useState(null)
  const [brokerData, setbrokerData] = useState(null)
  const location: any = useLocation().state

  const isGoogleData = location?.isGoogle
  const [isLoading, setISLoading] = useState(false)

  useEffect(() => {
    const registerTab = document.getElementById('registerTab')
    const brokerageTab = document.getElementById('brokerageTab')

    if (registerTab) {
      registerTab.style.pointerEvents = data ? 'auto' : 'none'
    }
    if (brokerageTab) {
      brokerageTab.style.pointerEvents = data ? 'auto' : 'none'
    }
  }, [data])

  return (
    <AuthContainer title={English.R25} desciption={English.R26} isLoading={isLoading}>
      <div className="signup-container--tab">
        <span className="signup-container--label">{tab === 1 ? English.R30 : English.R41}</span>
        <TabContainer value={tab} onChange={setTab} />
      </div>
      {tab === 1 ? (
        <Register
          onDataChange={(d: any) => {
            setData(d)
            setTab(2)
          }}
          isGoogleData={isGoogleData}
          data={data}
        />
      ) : (
        <Brokerage
          onLoading={setISLoading}
          data={data}
          brokerData={brokerData}
          onDataChange={setbrokerData}
        />
      )}
    </AuthContainer>
  )
}

export default Signup
