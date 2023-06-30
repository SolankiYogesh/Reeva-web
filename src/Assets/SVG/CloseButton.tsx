import * as React from 'react'
import { type SVGProps } from 'react'

const CloseButton = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M.957 13 12.92 1M.957 1 12.92 13"
      stroke="#595E69"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export default CloseButton
