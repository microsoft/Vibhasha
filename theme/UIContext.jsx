import React, { createContext, useContext, useMemo, useState } from 'react'

const UIContext = createContext(null)

export function UIProvider({ children }){
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const value = useMemo(() => ({
    sidebarOpen,
    setSidebarOpen,
    searchOpen,
    setSearchOpen,
    toggleSidebar: () => setSidebarOpen(s => !s),
    toggleSearch: () => setSearchOpen(s => !s),
    closeSidebar: () => setSidebarOpen(false),
    closeSearch: () => setSearchOpen(false),
  }), [sidebarOpen, searchOpen])

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI(){
  const context = useContext(UIContext)
  if (!context) throw new Error('useUI must be used within UIProvider')
  return context
}
