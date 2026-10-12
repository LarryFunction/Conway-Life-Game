import { useEffect, useMemo, useRef, useState } from 'react'
import Grid from './components/Grid.jsx'
import Controls from './components/Controls.jsx'
import Settings from './components/Settings.jsx'
import PatternPanel from './components/PatternPanel.jsx'
import Stats from './components/Stats.jsx'
import {
  createGrid,
  nextGeneration,
  countAlive,
  randomFill,
  clearGrid,
  resizeGrid,
  stampPattern,
} from './logic/life.js'
import { PATTERNS } from './logic/patterns.js'
import { parseRLE, toRLE, toPlainText } from './logic/rle.js'

const DEFAULT_ROWS = 45
const DEFAULT_COLS = 70

export default function App() {
  const [rows, setRows] = useState(DEFAULT_ROWS)
  const [cols, setCols] = useState(DEFAULT_COLS)
  const [grid, setGrid] = useState(() => createGrid(DEFAULT_ROWS, DEFAULT_COLS))
  const [running, setRunning] = useState(false)
  const [generation, setGeneration] = useState(0)
  const [speed, setSpeed] = useState(10)
  const [wrap, setWrap] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [density, setDensity] = useState(30)

  const rowsRef = useRef(rows)
  const colsRef = useRef(cols)
  const wrapRef = useRef(wrap)
  useEffect(() => {
    rowsRef.current = rows
    colsRef.current = cols
    wrapRef.current = wrap
  }, [rows, cols, wrap])

  useEffect(() => {
    if (!running) return
    const delay = Math.max(1000 / speed, 16)
    const id = window.setInterval(() => {
      setGrid((prev) => nextGeneration(prev, rowsRef.current, colsRef.current, wrapRef.current))
      setGeneration((g) => g + 1)
    }, delay)
    return () => window.clearInterval(id)
  }, [running, speed])

  const alive = useMemo(() => countAlive(grid), [grid])

  const handleToggle = () => setRunning((r) => !r)

  const handleStep = () => {
    setGrid((prev) => nextGeneration(prev, rows, cols, wrap))
    setGeneration((g) => g + 1)
  }

  const handleReset = () => {
    setRunning(false)
    setGrid(clearGrid(createGrid(rows, cols)))
    setGeneration(0)
  }

  const handleRandom = () => {
    setGrid((prev) => randomFill(prev.slice(), density / 100))
    setGeneration(0)
  }

  const handleResize = (newRows, newCols) => {
    setGrid((prev) => resizeGrid(prev, rows, cols, newRows, newCols))
    setRows(newRows)
    setCols(newCols)
    setGeneration(0)
  }

  const handlePaint = (r, c, value) => {
    setGrid((prev) => {
      const next = prev.slice()
      next[r * cols + c] = value
      return next
    })
  }

  const handleStamp = (r, c) => {
    if (selectedIndex == null) return
    const pattern = PATTERNS[selectedIndex]
    const originR = r - Math.floor(pattern.height / 2)
    const originC = c - Math.floor(pattern.width / 2)
    setGrid((prev) => stampPattern(prev, rows, cols, pattern.cells, originR, originC, wrap))
  }

  const handleImport = (text) => {
    const parsed = parseRLE(text)
    if (!parsed.cells.length) return false
    const newRows = Math.max(parsed.height + 4, 15)
    const newCols = Math.max(parsed.width + 4, 15)
    const next = createGrid(newRows, newCols)
    const originR = Math.floor((newRows - parsed.height) / 2)
    const originC = Math.floor((newCols - parsed.width) / 2)
    for (const [dr, dc] of parsed.cells) {
      next[(originR + dr) * newCols + (originC + dc)] = 1
    }
    setRunning(false)
    setRows(newRows)
    setCols(newCols)
    setGrid(next)
    setGeneration(0)
    return true
  }

  const handleExport = (format) => {
    return format === 'text' ? toPlainText(grid, rows, cols) : toRLE(grid, rows, cols)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>康威生命游戏</h1>
        <p className="subtitle">Conway&apos;s Game of Life · 自定义初始状态</p>
      </header>

      <main className="layout">
        <section className="board">
          <Grid
            grid={grid}
            rows={rows}
            cols={cols}
            onPaint={handlePaint}
            onStamp={handleStamp}
            stamping={selectedIndex != null}
          />
          <Stats generation={generation} alive={alive} rows={rows} cols={cols} />
        </section>

        <aside className="sidebar">
          <Controls
            running={running}
            onToggle={handleToggle}
            onStep={handleStep}
            onReset={handleReset}
            speed={speed}
            onSpeedChange={setSpeed}
          />
          <Settings rows={rows} cols={cols} onResize={handleResize} wrap={wrap} onWrapChange={setWrap} />
          <PatternPanel
            patterns={PATTERNS}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
            density={density}
            onDensityChange={setDensity}
            onRandom={handleRandom}
            onImport={handleImport}
            onExport={handleExport}
          />
        </aside>
      </main>
    </div>
  )
}
