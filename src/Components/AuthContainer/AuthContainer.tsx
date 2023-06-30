import './style.scss'

import React, { type ReactNode, useEffect, useRef } from 'react'

import AppLoader, { type AppLoaderRef } from '../Loader/AppLoader'
import Welcome from '../Welcome/Welcome'

interface AuthContainerProps {
  children: ReactNode
  isLoading: boolean
  title: string
  desciption: string
}

const AuthContainer = (props: AuthContainerProps) => {
  const { children, isLoading, title, desciption } = props
  const loaderRef = useRef<AppLoaderRef>(null)
  useEffect(() => {
    loaderRef.current?.showLoader(isLoading)
  }, [isLoading])

  return (
    <div className="auth-container">
      <Welcome title={title} desciption={desciption} />
      <div className="auth-container--con">
        <div className="auth-container--inner-container">
          <AppLoader ref={loaderRef} />
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthContainer
