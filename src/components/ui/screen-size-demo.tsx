'use client'

import { useEffect, useState } from 'react'

export function ScreenSizeDemo() {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    function updateSize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', updateSize)
    updateSize()

    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Screen Size Demo</h2>
      <p>Width: {size.width}px</p>
      <p>Height: {size.height}px</p>
    </div>
  )
} 