import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import Header from '../Components/Header/Header'
import Config from '../Config/Config'
import Constant from '../Helpers/Constant'
import { setUserData } from '../Redux/Reducers/UserSlice'
import AuthRouter from './AuthRouter'
import MainRouter from './MainRouter'

const AppRouter = () => {
  const user = useSelector((state: any) => state?.user?.userData)
  const dispatch = useDispatch()
  const [isReady, setISReady] = useState(false)

  useEffect(() => {
    try {
      const value = localStorage.getItem('userData')

      if (value) {
        Constant.token = JSON.parse(value)?.token
        Constant.refresh = JSON.parse(value)?.refresh_token
        dispatch(setUserData(JSON.parse(value)))

        setISReady(true)
      } else {
        setISReady(true)
      }
    } catch (error) {
      setISReady(true)
    }
  }, [dispatch])

  const renderRouter = useMemo(() => {
    if (user?.token) {
      return <MainRouter />
    }
    return <AuthRouter />
  }, [user?.token])

  return (
    <BrowserRouter basename={Config.basename}>
      <Header />
      {isReady && renderRouter}
    </BrowserRouter>
  )
}

export default AppRouter
