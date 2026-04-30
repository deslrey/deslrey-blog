import React, { createContext, useContext, useMemo } from 'react'

export interface TabLocationValue {
  path: string
  search: string
}

const TabLocationContext = createContext<TabLocationValue | null>(null)

export const TabLocationProvider: React.FC<{ path: string; search: string; children: React.ReactNode }> = ({
  path,
  search,
  children,
}) => {
  const value = useMemo(() => ({ path, search }), [path, search])
  return <TabLocationContext.Provider value={value}>{children}</TabLocationContext.Provider>
}

/** 在标签页内渲染时返回当前标签的 search 解析成的 URLSearchParams；否则返回 null，调用方用 useSearchParams() 兜底 */
export function useTabSearchParams(): URLSearchParams | null {
  const ctx = useContext(TabLocationContext)
  const search = ctx?.search || ''
  return useMemo(() => {
    if (!search) return null
    return new URLSearchParams(search)
  }, [search])
}
