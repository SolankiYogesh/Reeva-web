import './style.scss'

import _ from 'lodash'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'

import Constant from '../../../Helpers/Constant'
import English from '../../../Helpers/English'
import EndPoints from '../../../Network/EndPoints'
import VoiceChatHeader from '../NewContract/Component/VoiceChatHeader'
import PlanTab from './Component/PlanTab'

const data = [
  {
    features: ['3 Offers / mo.', '10 Emails / mo.', 'Unlimited Contacts & Templates'],
    id: Constant.Plans.Free,
    price: 'Free'
  },
  {
    features: ['Unlimited Offers', 'Unlimited Emails', 'Unlimited Contacts & Templates'],
    id: Constant.Plans.Plus,
    price: '8.99'
  },
  {
    features: [
      '3 Offers / mo.',
      '10 Emails / mo.',
      'Unlimited Contacts & Templates',
      'Talk to REEVA (Voice)'
    ],
    id: Constant.Plans.Pro,
    price: '14.99'
  }
]

const PricingPlans = () => {
  const plan_details = useSelector((state: any) => state?.user?.userData?.plan_details)

  const onPressTermsPrivacy = useCallback((url: string) => {
    window.open(url, '_blank')
  }, [])

  return (
    <div className="plan-container">
      <VoiceChatHeader isTemplate isScore={false} total={0} current={0} title={English.R139} />
      <div className="plan-container--grid">
        {_.map(data, (i, index) => {
          return <PlanTab index={index} isCurrent={plan_details?.plan_name === i.id} item={i} />
        })}
      </div>
      <div className="plan-container--inner">
        <span className="plan-container--text1" onClick={() => onPressTermsPrivacy(EndPoints.TNC)}>
          {English.R142}
        </span>
        <span
          className="plan-container--text2"
          onClick={() => onPressTermsPrivacy(EndPoints.privacy)}
        >
          {English.R143}
        </span>
      </div>
    </div>
  )
}

export default PricingPlans
