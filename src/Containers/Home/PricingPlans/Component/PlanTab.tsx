import './style.scss'

import _ from 'lodash'
import React from 'react'

import AppAnimatedButton from '../../../../Components/AppAnimatedButton/AppAnimatedButton'
import AppButton from '../../../../Components/AppButton/AppButton'
import Constant from '../../../../Helpers/Constant'
import English from '../../../../Helpers/English'
import Images from '../../../../Helpers/Images'

interface PlanItemProps {
  features: string[]
  id: string
  price: string
}

interface PlanTabProps {
  item: PlanItemProps
  index: number
  isCurrent: boolean
}

const PlanTab = (props: PlanTabProps) => {
  const { item, isCurrent, index } = props
  return (
    <div className="plan-header-container">
      {item.id === Constant.Plans.Plus && <img className="plan-header" src={Images.plan_header} />}
      <div className="plan-tab-container">
        <div className="plan-tab-container--inner">
          <span className="plan-tab-container--title">{item.price}</span>
          <div className="plan-tab-container--features-container">
            {_.map(item.features, (i) => {
              return (
                <div className="plan-tab-container--features">
                  <div className="plan-tab-container--features-img-container">
                    <img src={Images.right} className="plan-tab-container--features-img" />
                  </div>
                  <span className="plan-tab-container--features-title">{i}</span>
                </div>
              )
            })}
          </div>
        </div>
        {isCurrent ? (
          <AppButton disabled title={English.R141} />
        ) : (
          index !== 0 && <AppAnimatedButton title={English.R140} />
        )}
      </div>
    </div>
  )
}

export default PlanTab
