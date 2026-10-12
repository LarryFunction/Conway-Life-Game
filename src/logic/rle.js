function empty() {
  return { name: '', width: 0, height: 0, cells: [] }
}

function parsePlainText(text) {
  const lines = text.split(/\r?\n/).filter((l) => !l.trimStart().startsWith('#'))
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop()
  while (lines.length && lines[0].trim() === '') lines.shift()

  const cells = []
  let width = 0
  let height = 0
  lines.forEach((line, r) => {
    if (line.length > width) width = line.length
    for (let c = 0; c < line.length; c++) {
      const ch = line[c]
      if (ch === 'O' || ch === 'o' || ch === '*' || ch === '1') {
        cells.push([r, c])
      }
    }
    height = r + 1
  })

  let maxC = -1
  for (const [, cc] of cells) if (cc > maxC) maxC = cc
  if (maxC + 1 > width) width = maxC + 1

  return { name: '', width, height, cells }
}

export function parseRLE(text) {
  if (!text || !text.trim()) return empty()

  const hasBang = text.includes('!')
  const hasHeader = /(^|\n)\s*x\s*=/i.test(text)
  if (!hasBang && !hasHeader) {
    return parsePlainText(text)
  }

  const lines = text.split(/\r?\n/).map((l) => l.trim())
  let name = ''
  let header = null
  const bodyParts = []
  for (const line of lines) {
    if (!line) continue
    if (line.startsWith('#')) {
      if (!name) name = line.replace(/^#+[A-Za-z]?\s*/, '').trim()
      continue
    }
    if (header === null && /^x\s*=/i.test(line)) {
      header = line
      continue
    }
    if (/^[a-zA-Z][a-zA-Z0-9]*\s*=/.test(line)) continue
    bodyParts.push(line)
  }

  let width = 0
  let height = 0
  if (header) {
    const mx = header.match(/x\s*=\s*(\d+)/i)
    const my = header.match(/y\s*=\s*(\d+)/i)
    if (mx) width = parseInt(mx[1], 10)
    if (my) height = parseInt(my[1], 10)
  }

  const body = bodyParts.join('')
  const cells = []
  let r = 0
  let c = 0
  let num = ''
  for (const ch of body) {
    if (ch >= '0' && ch <= '9') {
      num += ch
      continue
    }
    const count = num ? parseInt(num, 10) : 1
    num = ''
    if (ch === 'b' || ch === 'B' || ch === '.') {
      c += count
    } else if (ch === 'o' || ch === 'O' || ch === '*') {
      for (let i = 0; i < count; i++) cells.push([r, c + i])
      c += count
    } else if (ch === '$') {
      r += count
      c = 0
    } else if (ch === '!') {
      break
    }
  }

  let maxR = -1
  let maxC = -1
  for (const [rr, cc] of cells) {
    if (rr > maxR) maxR = rr
    if (cc > maxC) maxC = cc
  }
  if (!height) height = maxR + 1
  if (!width) width = maxC + 1

  return { name, width, height, cells }
}

export function toRLE(grid, rows, cols) {
  const rowStrings = []
  for (let r = 0; r < rows; r++) {
    const tokens = []
    let c = 0
    while (c < cols) {
      const val = grid[r * cols + c]
      let run = 1
      while (c + run < cols && grid[r * cols + c + run] === val) run++
      tokens.push({ count: run, alive: val })
      c += run
    }
    while (tokens.length && !tokens[tokens.length - 1].alive) tokens.pop()
    let line = ''
    for (const t of tokens) {
      line += (t.count > 1 ? t.count : '') + (t.alive ? 'o' : 'b')
    }
    rowStrings.push(line)
  }
  while (rowStrings.length && rowStrings[rowStrings.length - 1] === '') rowStrings.pop()
  const body = rowStrings.join('$') + '!'
  return `x = ${cols}, y = ${rows}, rule = B3/S23\n${body}`
}

export function toPlainText(grid, rows, cols) {
  const lines = []
  for (let r = 0; r < rows; r++) {
    let line = ''
    for (let c = 0; c < cols; c++) {
      line += grid[r * cols + c] ? 'O' : '.'
    }
    lines.push(line.replace(/\.+$/, ''))
  }
  while (lines.length && lines[lines.length - 1] === '') lines.pop()
  return lines.join('\n')
}
