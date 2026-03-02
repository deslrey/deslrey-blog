import type * as React from 'react'

declare module 'react' {
  export const Activity: React.FC<{
    mode?: 'visible' | 'hidden'
    children?: React.ReactNode
  }>
}
