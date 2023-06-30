import './style.scss'

import _ from 'lodash'
import React, { type CSSProperties, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import Utility from '../../Helpers/Utility'

interface AppProfileIconProps {
  url?: string
  isNamed?: ''
  onClick?: () => void
  borderRadius?: number
  size?: number
  fontStyle?: CSSProperties
  style?: CSSProperties
  to?: string
}

const AppProfileIcon = (props: AppProfileIconProps) => {
  const user = useSelector((state: any) => state?.user?.userData)
  const [isError, setISError] = useState(false)
  const {
    url,
    isNamed = '',
    onClick,
    borderRadius,
    size,
    fontStyle = {},
    style = {},
    to = ''
  } = props

  const styles: CSSProperties = {
    borderRadius: borderRadius ?? 15,
    width: size ?? 68,
    height: size ?? 68,
    pointerEvents: !!_.trim(to) ?? !!onClick ? 'auto' : 'none',
    ...style
  }

  const onError = useCallback(() => {
    setISError(true)
  }, [])

  return (
    <NavLink
      to={to}
      onClick={() => {
        if (onClick) {
          onClick()
        }
      }}
      style={styles}
      className={`picture-container ${!url || isError || isNamed ? 'isNameContainer' : ''}`}
    >
      {!url || isError || isNamed ? (
        <span className="picture-container--profile-name" style={fontStyle}>
          {Utility.convert(isNamed || `${user?.first_name} ${user?.last_name}`)}
        </span>
      ) : (
        <img onError={onError} className="picture-container--profile-image" src={url} />
      )}
    </NavLink>
  )
}

export default AppProfileIcon
