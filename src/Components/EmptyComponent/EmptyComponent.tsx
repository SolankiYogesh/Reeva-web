import './style.scss'

import React from 'react'

interface EmptyComponentProps {
  title: string
}

const EmptyComponent = ({ title }: EmptyComponentProps) => {
  return <div className="empty-container">{title}</div>
}

export default EmptyComponent
