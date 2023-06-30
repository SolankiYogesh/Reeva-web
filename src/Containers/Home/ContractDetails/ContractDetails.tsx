import './style.scss'

import React, { useCallback, useRef, useState } from 'react'
import Iframe from 'react-iframe'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import AlertModal from '../../../Components/AlertModal/AlertModal'
import AppAnimatedButton from '../../../Components/AppAnimatedButton/AppAnimatedButton'
import AppLoader, { type AppLoaderRef } from '../../../Components/Loader/AppLoader'
import Config from '../../../Config/Config'
import Constant from '../../../Helpers/Constant'
import English from '../../../Helpers/English'
import Images from '../../../Helpers/Images'
import Paths from '../../../Helpers/Paths'
import APICall from '../../../Network/APICall'
import EndPoints from '../../../Network/EndPoints'
import { setPlanData } from '../../../Redux/Reducers/UserSlice'

const ContractDetails = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const contact: any = location.state?.contact
  const contract: any = location.state?.contract
  const isSend: any = location.state?.isSend
  const [isAlert, setISAlert] = useState(false)
  const user = useSelector((state: any) => state?.user?.userData)
  const dispatch = useDispatch()
  const loaderRef = useRef<AppLoaderRef>(null)
  const onPressUpgrade = useCallback(() => {
    navigate(Paths.MainDrawer + Paths.Dashboard + Paths.PricingPlans)
  }, [navigate])

  const onLoad = useCallback((state: boolean) => {
    if (loaderRef.current) {
      loaderRef.current?.showLoader(state)
    }
  }, [])

  const onPressContract = useCallback(() => {
    if (
      user?.plan_details &&
      Number(user?.plan_details?.monthly_send_emails) >=
        Number(user?.plan_details?.send_offer_limit) &&
      user?.plan_details?.plan_name === Constant.Plans.Free
    ) {
      setISAlert(true)
      return
    }
    if (contact) {
      const payload = {
        email_add: contact?.email,
        cache_id: contract?.cache_id
      }
      onLoad(true)

      APICall('post', payload, EndPoints.sendOffer)
        .then(async (resp: any) => {
          onLoad(false)
          if (resp?.status === 200 && resp?.data?.sendgrid_response_code === 200) {
            toast.success('offer sent!')
            navigate(Paths.MainDrawer + Paths.Dashboard + Paths.DraftedContracts)
            if (user?.plan_details?.plan_name === Constant.Plans.Free) {
              dispatch(
                setPlanData({
                  monthly_send_emails: Number(user?.plan_details?.monthly_send_emails || 0) + 1
                })
              )
            }
          }
        })
        .catch((e) => {
          toast.error(String(e?.data?.message))
          onLoad(false)
        })
    } else {
      navigate(Paths.MainDrawer + Paths.Dashboard + Paths.MyContacts, {
        state: {
          contract
        }
      })
    }
  }, [contact, contract, dispatch, navigate, onLoad, user?.plan_details])

  return (
    <div className="contract-details-container">
      <div className="contract-details-container--inner-template">
        <div className="contract-details-container--inner-title-header">
          <span className="contract-details-container--inner-title-header title">
            {contract?.address}
          </span>
        </div>
        <Iframe
          url={String(Config.API_URL + (contract.filled_form || ''))}
          display="block"
          className="contract-details-container--inner-frame"
          position="relative"
        />
      </div>
      {!isSend && (
        <AppAnimatedButton
          divId="contract-send-btn"
          title={English.R108}
          onClick={onPressContract}
          isImage={Images.template_send}
        />
      )}
      <AppLoader ref={loaderRef} />
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

export default ContractDetails
