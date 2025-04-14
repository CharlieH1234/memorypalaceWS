import { createContext, useContext, useState, ReactNode } from 'react'

interface MemoryPalaceData {
  sourceText: string
  chunks: string[]
  images: { url: string; prompt: string }[]
  mapTemplate: string
  imagePositions: { id: string; position: { x: number; y: number } }[]
}

interface MemoryPalaceContextType {
  data: MemoryPalaceData
  setSourceText: (text: string) => void
  setChunks: (chunks: string[]) => void
  setImages: (images: { url: string; prompt: string }[]) => void
  setMapTemplate: (template: string) => void
  setImagePositions: (positions: { id: string; position: { x: number; y: number } }[]) => void
  currentStep: number
  setCurrentStep: (step: number) => void
}

const defaultData: MemoryPalaceData = {
  sourceText: '',
  chunks: [],
  images: [],
  mapTemplate: '',
  imagePositions: []
}

const MemoryPalaceContext = createContext<MemoryPalaceContextType | undefined>(undefined)

export const MemoryPalaceProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<MemoryPalaceData>(defaultData)
  const [currentStep, setCurrentStep] = useState(0)

  const setSourceText = (text: string) => {
    setData(prev => ({ ...prev, sourceText: text }))
  }

  const setChunks = (chunks: string[]) => {
    setData(prev => ({ ...prev, chunks }))
  }

  const setImages = (images: { url: string; prompt: string }[]) => {
    setData(prev => ({ ...prev, images }))
  }

  const setMapTemplate = (template: string) => {
    setData(prev => ({ ...prev, mapTemplate: template }))
  }

  const setImagePositions = (positions: { id: string; position: { x: number; y: number } }[]) => {
    setData(prev => ({ ...prev, imagePositions: positions }))
  }

  return (
    <MemoryPalaceContext.Provider
      value={{
        data,
        setSourceText,
        setChunks,
        setImages,
        setMapTemplate,
        setImagePositions,
        currentStep,
        setCurrentStep
      }}
    >
      {children}
    </MemoryPalaceContext.Provider>
  )
}

export const useMemoryPalace = () => {
  const context = useContext(MemoryPalaceContext)
  if (!context) {
    throw new Error('useMemoryPalace must be used within a MemoryPalaceProvider')
  }
  return context
}
