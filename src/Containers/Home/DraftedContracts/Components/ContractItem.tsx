import './style.scss'

import moment from 'moment'
import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import AlertModal from '../../../../Components/AlertModal/AlertModal'
import AppAnimatedButton from '../../../../Components/AppAnimatedButton/AppAnimatedButton'
import Constant from '../../../../Helpers/Constant'
import English from '../../../../Helpers/English'
import Images from '../../../../Helpers/Images'
import Paths from '../../../../Helpers/Paths'

interface ContractItemProps {
  item: any
  contact: any
}

const ContractItem = ({ item, contact }: ContractItemProps) => {
  const navigate = useNavigate()
  const [isAlert, setISAlert] = useState(false)
  const plan_details = useSelector((state: any) => state?.user?.userData?.plan_details)

  const onPressUpgrade = useCallback(() => {
    navigate(Paths.MainDrawer + Paths.Dashboard + Paths.PricingPlans)
  }, [navigate])

  const onPressContract = useCallback(() => {
    if (
      plan_details &&
      Number(plan_details?.monthly_send_emails) >= Number(plan_details?.send_offer_limit) &&
      plan_details?.plan_name === Constant.Plans.Free
    ) {
      setISAlert(true)
      return
    }
    navigate(Paths.MainDrawer + Paths.Dashboard + Paths.contractDetails, {
      state: {
        contract: item,
        contact
      }
    })
  }, [contact, item, navigate, plan_details])

  const renderLables = useCallback((img: any, target: string, value: string) => {
    return (
      <div className="draft-item-container--bottom-label-con">
        <img className="draft-item-container--bottom-label-con imgdraft" src={img} />
        <span className="draft-item-container--bottom-label-con targetdraft">{target}</span>
        <span className="draft-item-container--bottom-label-con targetdraft valuedraft">
          {value}
        </span>
      </div>
    )
  }, [])

  return (
    <div className="draft-item-container">
      <div className="draft-item-container--top">
        <div className="draft-item-container--top-add-con">
          <span className="draft-item-container--top-add">{item?.address}</span>
        </div>
        <span className="draft-item-container--top-add-time">
          {moment(item?.created).format('DD MMM YYYY')}
        </span>
      </div>
      <div className="draft-item-container--bottom">
        <div className="draft-item-container--bottom-iner">
          {renderLables(Images.buyer, English.R110, item?.buyer || '        -')}
          {renderLables(Images.seller, English.R111, item?.seller || '        -')}
        </div>

        <AppAnimatedButton
          divId="draft-send-btn"
          imageId="draft-send-img"
          isImage={Images.send}
          onClick={onPressContract}
        />
      </div>
      {isAlert && (
        <AlertModal
          onPress={onPressUpgrade}
          alertText={English.R148}
          cancelText={English.R121}
          deleteText={English.R85}
          onClose={() => setISAlert(false)}
        />
      )}
    </div>
  )
}

export default ContractItem
