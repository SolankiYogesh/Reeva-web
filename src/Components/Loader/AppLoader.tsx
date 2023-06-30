import './style.scss'

import React, { forwardRef, useImperativeHandle } from 'react'

export interface AppLoaderRef {
  showLoader: (state: boolean) => void
}

const AppLoader = forwardRef<AppLoaderRef, any>((_, ref) => {
  useImperativeHandle(ref, () => ({
    showLoader(state: boolean) {
      const modal = document.querySelector('.container')

      if (state) {
        modal?.classList.add('visible')
      } else {
        modal?.classList.remove('visible')
      }
    }
  }))

  return (
    <div className="container">
      {/* <CylinderSpinLoader /> */}
      <div className="loadingio-spinner-double-ring-pvzlx5pegx">
        <div className="ldio-b7frrla9j6d">
          <div />
          <div />
          <div>
            <div />
          </div>
          <div>
            <div />
          </div>
        </div>
      </div>
      {/* <div className="spinner">
        <div className="spinner-item" />
        <div className="spinner-item" />
        <div className="spinner-item" />
      </div> */}
    </div>
  )
})

export default AppLoader
