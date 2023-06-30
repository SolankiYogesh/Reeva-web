import './style.scss'

import _ from 'lodash'
import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import AlertModal from '../../../Components/AlertModal/AlertModal'
import English from '../../../Helpers/English'
import Images from '../../../Helpers/Images'
import Paths from '../../../Helpers/Paths'
import { logOut } from '../../../Redux/Reducers/UserSlice'

const tabData = [
  {
    to: Paths.NewContract,
    image: Images.newcontract,
    title: English.R71
  },
  {
    to: Paths.DraftedContracts,
    image: Images.drafted_contracts,
    title: English.R72
  },
  {
    to: Paths.MyContacts,
    image: Images.contacts,
    title: English.R77
  },
  {
    to: Paths.EmailTemplates,
    image: Images.email_template,
    title: English.R73
  },
  {
    to: Paths.PricingPlans,
    image: Images.plan_tab,
    title: English.R74
  }
]
const settingData = [
  {
    to: Paths.feedback,
    image: Images.feedback,
    title: English.R75
  },
  {
    to: '#',
    image: Images.log_out,
    title: English.R76
  }
]

const MainDrawer = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLogOutModal, setISLogOutModal] = useState(false)

  const navigationStyle: any = ({ isActive }: any) => {
    return {
      color: isActive ? '#262E4A' : '#9CA8BA'
    }
  }

  const onLogOut = useCallback(() => {
    navigate(Paths.Dashboard)
    dispatch(logOut())
  }, [dispatch, navigate])

  return (
    <div className="drawer-navigation">
      <div className="drawer">
        <ul className="drawer--items">
          <div className="drawer--flex-items">
            {_.map(tabData, (i) => {
              const focus = location.pathname.endsWith(i.to)
              return (
                <NavLink key={i.title} to={i.to} className="drawer--item" style={navigationStyle}>
                  <img
                    src={i.image}
                    className={`drawer--item-icon ${focus ? 'active' : ''}`}
                    alt="log_out"
                  />
                  {i.title}
                </NavLink>
              )
            })}
          </div>
          {_.map(settingData, (i, index) => {
            const focus = location.pathname.endsWith(i.to)
            return (
              <NavLink
                key={i.title}
                onClick={() => {
                  if (index === settingData.length - 1) {
                    setISLogOutModal(true)
                  }
                }}
                to={i.to}
                className="drawer--item"
                style={({ isActive }) => {
                  return navigationStyle({ isActive: isActive && index !== 1 })
                }}
              >
                <img
                  src={i.image}
                  className={`drawer--item-icon ${focus ? 'active' : ''}`}
                  alt="log_out"
                />
                {i.title}
              </NavLink>
            )
          })}

          <NavLink
            key={Paths.absUserProfile}
            to={Paths.absUserProfile}
            className="drawer--item hidden"
            style={(data: any) => navigationStyle(data)}
          >
            {Paths.absUserProfile}
          </NavLink>
          <NavLink
            key={Paths.contractDetails}
            to={Paths.contractDetails}
            className="drawer--item hidden"
            style={(data: any) => navigationStyle(data)}
          >
            {Paths.contractDetails}
          </NavLink>
        </ul>
      </div>

      <div className="content">
        <Outlet />
      </div>
      {isLogOutModal && (
        <AlertModal
          onClose={() => setISLogOutModal(false)}
          cancelText={English.R120}
          deleteText={English.R121}
          alertText={English.R122}
          onPress={onLogOut}
        />
      )}
    </div>
  )
}

export default MainDrawer
