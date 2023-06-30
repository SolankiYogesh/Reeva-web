import './style.scss'

import _ from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import EmptyComponent from '../../../Components/EmptyComponent/EmptyComponent'
import AppLoader, { type AppLoaderRef } from '../../../Components/Loader/AppLoader'
import English from '../../../Helpers/English'
import Paths from '../../../Helpers/Paths'
import APICall from '../../../Network/APICall'
import EndPoints from '../../../Network/EndPoints'
import VoiceChatHeader from '../NewContract/Component/VoiceChatHeader'
import ContractItem from './Components/ContractItem'

const DraftedContracts = () => {
  const [offers, setOffers] = useState<any[]>([])
  const loaderRef = useRef<AppLoaderRef>(null)
  const user = useSelector((state: any) => state?.user?.userData)
  const location = useLocation()
  const contact = location.state?.contact
  const isCalled = useRef(false)
  const navigate = useNavigate()
  const onLoad = useCallback((state: boolean) => {
    if (loaderRef.current) {
      loaderRef.current?.showLoader(state)
    }
  }, [])

  const getOffer = useCallback(
    async (isLoader = true) => {
      onLoad(isLoader)
      APICall('get', {}, EndPoints.getOffers)
        .then((resp: any) => {
          onLoad(false)

          if (resp?.status === 200 && resp?.data?.contracts) {
            const sortingData: any[] = _.orderBy(resp?.data?.contracts, (t) => t?.created, 'desc')
            setOffers(sortingData)
          } else {
            toast.error(String(resp?.data?.message))
          }
        })
        .catch((e) => {
          toast.error(String(e?.data?.message))
          onLoad(false)
        })
    },
    [onLoad]
  )

  const onPressUpgrade = useCallback(() => {
    navigate(Paths.MainDrawer + Paths.Dashboard + Paths.PricingPlans)
  }, [navigate])

  useEffect(() => {
    if (!location.state?.isContract && !isCalled.current) {
      isCalled.current = true
      getOffer()
    } else {
      setOffers([location.state?.isContract])
    }
  }, [getOffer, location.state?.isContract])

  return (
    <div className="draft-container">
      <VoiceChatHeader
        title={English.R109}
        current={Number(user?.plan_details?.monthly_send_emails)}
        total={Number(user?.plan_details?.send_offer_limit)}
        isTemplate
        onPress={onPressUpgrade}
      />
      {offers.length > 0 ? (
        <div className="draft-container--grid">
          {_.map(offers, (i: any) => {
            return <ContractItem key={i?.id} item={i} contact={contact} />
          })}
        </div>
      ) : (
        <EmptyComponent title={English.R116} />
      )}
      <AppLoader ref={loaderRef} />
    </div>
  )
}

export default DraftedContracts
