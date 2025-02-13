// src/context/StyleGuideContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react'

interface StyleGuideContextType {
  styleGuide: any // Replace with proper type
  updateStyleGuide: (newStyleGuide: any) => void
}

const StyleGuideContext = createContext<StyleGuideContextType | undefined>(undefined)

export function StyleGuideProvider({ children }: { children: ReactNode }) {
  const [styleGuide, setStyleGuide] = useState({})

  const updateStyleGuide = (newStyleGuide: any) => {
    setStyleGuide(newStyleGuide)
  }

  return (
    <StyleGuideContext.Provider value={{ styleGuide, updateStyleGuide }}>
      {children}
    </StyleGuideContext.Provider>
  )
}

export function useStyleGuide() {
  const context = useContext(StyleGuideContext)
  if (context === undefined) {
    throw new Error('useStyleGuide must be used within a StyleGuideProvider')
  }
  return context
}