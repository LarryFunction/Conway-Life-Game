import { useEffect, useRef, useState } from 'react'

const BG = '#0b1220'
const GRID_LINE = 'rgba(148, 163, 184, 0.15)'
const ALIVE = '#38bdf8'

export default function Grid({ grid, rows, cols, onPaint, onStamp, stamping }) {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const [cellSize, setCellSize] = useState(12)
  const paintingRef = useRef(false)
  const paintModeRef = useRef(1)
  const lastCellRef = useRef(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => {
      const size = Math.max(3, Math.min(26, Math.floor(el.clientWidth / cols)))
      setCellSize(size)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [cols])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const w = cols * cellSize
    const h = rows * cellSize
    canvas.width = Math.max(1, Math.round(w * dpr))
    canvas.height = Math.max(1, Math.round(h * dpr))
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = BG
    ctx.fillRect(0, 0, w, h)

    if (cellSize >= 7) {
      ctx.strokeStyle = GRID_LINE
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let c = 0; c <= cols; c++) {
        const x = c * cellSize + 0.5
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
      }
      for (let r = 0; r <= rows; r++) {
        const y = r * cellSize + 0.5
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
      }
      ctx.stroke()
    }

    ctx.fillStyle = ALIVE
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r * cols + c]) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize)
        }
      }
    }
  }, [grid, rows, cols, cellSize])

  const toCell = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const c = Math.floor((e.clientX - rect.left) / cellSize)
    const r = Math.floor((e.clientY - rect.top) / cellSize)
    if (r < 0 || r >= rows || c < 0 || c >= cols) return null
    return { r, c }
  }

  const handlePointerDown = (e) => {
    const cell = toCell(e)
    if (!cell) return
    e.preventDefault()
    if (stamping) {
      onStamp(cell.r, cell.c)
      return
    }
    paintingRef.current = true
    lastCellRef.current = cell
    paintModeRef.current = grid[cell.r * cols + cell.c] ? 0 : 1
    onPaint(cell.r, cell.c, paintModeRef.current)
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (stamping || !paintingRef.current) return
    const cell = toCell(e)
    if (!cell) return
    const last = lastCellRef.current
    if (last && last.r === cell.r && last.c === cell.c) return
    lastCellRef.current = cell
    onPaint(cell.r, cell.c, paintModeRef.current)
  }

  const handlePointerUp = (e) => {
    paintingRef.current = false
    lastCellRef.current = null
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }

  return (
    <div className="grid-wrap" ref={wrapRef}>
      <canvas
        ref={canvasRef}
        className={'grid-canvas' + (stamping ? ' stamping' : '')}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={() => {
          paintingRef.current = false
        }}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  )
}
