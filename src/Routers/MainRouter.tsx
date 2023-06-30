import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'

import ChangePassword from '../Containers/Home/ChangePassword/ChangePassword'
import ContractDetails from '../Containers/Home/ContractDetails/ContractDetails'
import DraftedContracts from '../Containers/Home/DraftedContracts/DraftedContracts'
import EmailTemplates from '../Containers/Home/EmailTemplates/EmailTemplates'
import Feedback from '../Containers/Home/Feedback/Feedback'
import MainDrawer from '../Containers/Home/MainDrawer/MainDrawer'
import MyContacts from '../Containers/Home/MyContacts/MyContacts'
import NewContract from '../Containers/Home/NewContract/NewContract'
import PricingPlans from '../Containers/Home/PricingPlans/PricingPlans'
import UserProfile from '../Containers/Home/UserProfile/UserProfile'
import Init from '../Containers/Init'
import Constant, { emitter } from '../Helpers/Constant'
import Paths from '../Helpers/Paths'
import Utility from '../Helpers/Utility'
import { logOut, setToken } from '../Redux/Reducers/UserSlice'

const MainRouter = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const emit = emitter.addListener(Constant.eventListenerKeys.updateToken, async (data: any) => {
      await Utility.wait(3000)
      Constant.token = data?.token
      Constant.refresh = data?.refresh_token
      dispatch(setToken(data))
    })

    const emit2 = emitter.addListener(Constant.eventListenerKeys.logOut, () => {
      dispatch(logOut())
      navigate(Paths.Login)
    })
    return () => {
      if (emit2) {
        emit2.remove()
      }
      if (emit) {
        emit.remove()
      }
    }
  }, [dispatch, navigate])

  return (
    <Routes>
      <Route Component={Init} path="*" />
      <Route Component={MainDrawer} path={Paths.MainDrawer}>
        <Route Component={NewContract} index path={Paths.NewContract} />
        <Route Component={DraftedContracts} path={Paths.DraftedContracts} />
        <Route Component={MyContacts} path={Paths.MyContacts} />
        <Route Component={EmailTemplates} path={Paths.EmailTemplates} />
        <Route Component={PricingPlans} path={Paths.PricingPlans} />
        <Route Component={Feedback} path={Paths.feedback} />
        <Route Component={UserProfile} path={Paths.UserProfile} />
        <Route Component={ContractDetails} path={Paths.contractDetails} />
        <Route Component={ChangePassword} path={Paths.ChangePassword} />
        <Route element={<Navigate replace to={Paths.NewContract} />} path="" />
      </Route>
    </Routes>
  )
}

export default MainRouter
