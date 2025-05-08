import React, { useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern

interface GridOffset {
  x: number
  y: number
}

interface SquaresProps {
  className?: string
  speed?: number
  borderColor?: CanvasStrokeStyle
  squareSize?: number
}

const Squares: React.FC<SquaresProps> = ({ speed = 1, borderColor = '#555', squareSize = 40, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number | null>(null)
  const numSquaresX = useRef<number>(0)
  const numSquaresY = useRef<number>(0)
  const gridOffset = useRef<GridOffset>({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1
      numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    const drawGrid = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize)
          const squareY = y - (gridOffset.current.y % squareSize)

          ctx.strokeStyle = borderColor
          ctx.strokeRect(squareX, squareY, squareSize, squareSize)
        }
      }

      // const gradient = ctx.createRadialGradient(
      //   canvas.width / 2,
      //   canvas.height / 2,
      //   0,
      //   canvas.width / 2,
      //   canvas.height / 2,
      //   Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2,
      // )
      // gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
      // gradient.addColorStop(1, '#060606')

      // ctx.fillStyle = gradient
      // ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1)
      gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize
      gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize

      drawGrid()
      requestRef.current = requestAnimationFrame(updateAnimation)
    }

    requestRef.current = requestAnimationFrame(updateAnimation)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [speed, borderColor, squareSize])

  return <canvas ref={canvasRef} className={twMerge('block h-full w-full border-0', className)}></canvas>
}

export default Squares
