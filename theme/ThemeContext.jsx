import React, { createContext, useContext, useMemo, useState } from 'react'
import { MicSparkle24Regular, FlowSparkle24Regular, SparkleAction24Regular } from '@fluentui/react-icons'
import pazaIllustration from '../assets/paza-illustration.png'
import atlasIllustration from '../assets/atlas-illustration.png'
import vibhashaIllustration from '../assets/vibhasha-illustration.png'
import pazaSvg from '../assets/paza.svg'
import atlasSvg from '../assets/atlas.svg'
import vibhashaSvg from '../assets/vibhasha.svg'

const ThemeContext = createContext(null)

export const brandPalettes = {
  teal: {
    light: {
      headerBg: '#0f766e', headerText: '#ffffff',
      footerBg: '#9FF2E426', footerText: '#ffffff',
      sidebarBg: '#9FF2E40D', sidebarText: '#0f766e',
      buttonBg: '#0f766e', buttonText: '#ffffff',
      pageBg: '#ffffff', pageText: '#262626'
    }
  },
  pink: {
    light: {
      headerBg: '#9F1459', headerText: '#ffffff',
      footerBg: '#FECBE626', footerText: '#ffffff',
      sidebarBg: '#FFF3FA', sidebarText: '#9F1459',
      buttonBg: '#9F1459', buttonText: '#ffffff',
      pageBg: '#ffffff', pageText: '#262626'
    }
  },
  indigo: {
    light: {
      headerBg: '#312A9A', headerText: '#ffffff',
      footerBg: '#D1D1FF26', footerText: '#ffffff',
      sidebarBg: '#F5F5FF', sidebarText: '#312A9A',
      buttonBg: '#312A9A', buttonText: '#ffffff',
      pageBg: '#ffffff', pageText: '#262626'
    }
  }
}

// Icon registry by brand
export const iconByBrand = {
  teal: MicSparkle24Regular,
  pink: FlowSparkle24Regular,
  indigo: SparkleAction24Regular,
}

// Brand SVG mapping for favicon
const brandSvgs = {
  paza: pazaSvg,
  atlas: atlasSvg,
  vibhasha: vibhashaSvg,
}

// App catalog and brand mapping by app name
const appCatalog = {
  paza: { title: 'Paza', subtitle: 'Speech Models Playbook', brand: 'teal', Icon: iconByBrand.teal },
  atlas: { title: 'Atlas', subtitle: 'Human Centred AI Playbook', brand: 'pink', Icon: iconByBrand.pink },
  vibhasha: { title: 'Vibhasha', subtitle: 'Multi-lingual LLMs Playbook', brand: 'indigo', Icon: iconByBrand.indigo }
}

// Brand image mapping by app key
const brandImages = {
  paza: pazaIllustration,
  atlas: atlasIllustration,
  vibhasha: vibhashaIllustration,
}

function resolveAppInfo(appNameLike){
  const defaultKey = 'paza'
  if (!appNameLike) return { key: defaultKey, ...appCatalog[defaultKey] }
  const lowered = appNameLike.toLowerCase()
  const key = Object.keys(appCatalog).find(k => lowered.includes(k)) || defaultKey
  return { key, ...appCatalog[key] }
}

export function ThemeProvider({ children, initialAppName }){
  const [appInfo, setAppInfo] = useState(() => resolveAppInfo(initialAppName))

  const colors = useMemo(() => {
    const palette = brandPalettes[appInfo.brand] || brandPalettes.teal
    return palette.light
  }, [appInfo.brand])

  // Optionally expose CSS variables for existing stylesheets
  React.useEffect(() => {
    const root = document.documentElement.style
    root.setProperty('--color-header-bg', colors.headerBg)
    root.setProperty('--color-header-text', colors.headerText)
    root.setProperty('--color-footer-bg', colors.footerBg)
    root.setProperty('--color-footer-text', colors.footerText)
    root.setProperty('--color-sidebar-bg', colors.sidebarBg)
    root.setProperty('--color-sidebar-text', colors.sidebarText)
    root.setProperty('--color-button-bg', colors.buttonBg)
    root.setProperty('--color-button-text', colors.buttonText)
    root.setProperty('--color-page-bg', colors.pageBg)
    root.setProperty('--color-page-text', colors.pageText)
  }, [colors])

  // Update document title and favicon based on app info
  React.useEffect(() => {
    document.title = `${appInfo.title} - ${appInfo.subtitle}`
    
    // Set favicon from brand SVG asset
    const faviconUrl = brandSvgs[appInfo.key] || brandSvgs.paza
    
    // Update or create favicon link element
    let link = document.querySelector("link[rel~='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.type = 'image/svg+xml'
    link.href = faviconUrl
  }, [appInfo, colors])

  function setAppName(nextName){
    setAppInfo(resolveAppInfo(nextName))
  }

  const allApps = useMemo(() => (
    Object.keys(appCatalog).map(key => ({
      key,
      title: appCatalog[key].title,
      brand: appCatalog[key].brand,
      Icon: appCatalog[key].Icon,
    }))
  ), [])

  const value = useMemo(() => ({
    colors,
    appName: appInfo.title,
    appSubtitle: appInfo.subtitle,
    brand: appInfo.brand,
    AppIcon: appInfo.Icon,
    brandImage: brandImages[appInfo.key],
    allApps,
    setAppName,
  }), [colors, appInfo])

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme(){
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
