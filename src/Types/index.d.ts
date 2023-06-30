declare namespace JSX {
  type IntrinsicElements = Record<string, any>
}
// declare module 'react'
interface ComonSectionType {
  onFocus: (state: boolean) => void
}
declare namespace React {
  interface HTMLProps<T> extends HTMLAttributes, ClassAttributes<T> {}
}
declare module 'react-typewriter'
