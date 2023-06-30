import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Paths from '../Helpers/Paths'

const Init = () => {
  const user = useSelector((state: any) => state?.user?.userData)
  const navigate = useNavigate()
  useEffect(() => {
    navigate(user?.token ? Paths.MainDrawer : Paths.Login)
  }, [navigate, user?.token])
  return null
}

export default Init
