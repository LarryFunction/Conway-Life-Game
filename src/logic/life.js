export function createGrid(rows, cols) {
  return new Uint8Array(rows * cols)
}

export function cloneGrid(grid) {
  return grid.slice()
}

export function countAlive(grid) {
  let n = 0
  for (let i = 0; i < grid.length; i++) if (grid[i]) n++
  return n
}

export function getCell(grid, rows, cols, r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= cols) return 0
  return grid[r * cols + c]
}

export function setCell(grid, cols, r, c, value) {
  grid[r * cols + c] = value ? 1 : 0
}

export function randomFill(grid, density) {
  for (let i = 0; i < grid.length; i++) {
    grid[i] = Math.random() < density ? 1 : 0
  }
  return grid
}

export function clearGrid(grid) {
  grid.fill(0)
  return grid
}

export function nextGeneration(grid, rows, cols, wrap) {
  const next = new Uint8Array(rows * cols)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let neighbors = 0
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          let nr = r + dr
          let nc = c + dc
          if (wrap) {
            nr = (nr + rows) % rows
            nc = (nc + cols) % cols
          } else if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
            continue
          }
          neighbors += grid[nr * cols + nc]
        }
      }
      const alive = grid[r * cols + c]
      if (alive) {
        next[r * cols + c] = neighbors === 2 || neighbors === 3 ? 1 : 0
      } else {
        next[r * cols + c] = neighbors === 3 ? 1 : 0
      }
    }
  }
  return next
}

export function resizeGrid(grid, oldRows, oldCols, newRows, newCols) {
  const next = new Uint8Array(newRows * newCols)
  const rows = Math.min(oldRows, newRows)
  const cols = Math.min(oldCols, newCols)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      next[r * newCols + c] = grid[r * oldCols + c]
    }
  }
  return next
}

export function stampPattern(grid, rows, cols, cells, originR, originC, wrap) {
  const next = grid.slice()
  for (const [dr, dc] of cells) {
    let r = originR + dr
    let c = originC + dc
    if (wrap) {
      r = (r + rows) % rows
      c = (c + cols) % cols
    } else if (r < 0 || r >= rows || c < 0 || c >= cols) {
      continue
    }
    next[r * cols + c] = 1
  }
  return next
}
