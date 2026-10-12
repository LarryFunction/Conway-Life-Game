import { useEffect, useState } from 'react'

export default function Settings({ rows, cols, onResize, wrap, onWrapChange }) {
  const [draftRows, setDraftRows] = useState(String(rows))
  const [draftCols, setDraftCols] = useState(String(cols))

  useEffect(() => setDraftRows(String(rows)), [rows])
  useEffect(() => setDraftCols(String(cols)), [cols])

  const commit = () => {
    const r = Math.max(3, Math.min(300, parseInt(draftRows, 10) || rows))
    const c = Math.max(3, Math.min(300, parseInt(draftCols, 10) || cols))
    setDraftRows(String(r))
    setDraftCols(String(c))
    if (r !== rows || c !== cols) onResize(r, c)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') e.currentTarget.blur()
  }

  return (
    <div className="panel">
      <h2 className="panel-title">网格设置</h2>
      <div className="size-row">
        <label className="field inline">
          <span className="field-label">列</span>
          <input
            type="number"
            min="3"
            max="300"
            value={draftCols}
            onChange={(e) => setDraftCols(e.target.value)}
            onBlur={commit}
            onKeyDown={onKeyDown}
          />
        </label>
        <label className="field inline">
          <span className="field-label">行</span>
          <input
            type="number"
            min="3"
            max="300"
            value={draftRows}
            onChange={(e) => setDraftRows(e.target.value)}
            onBlur={commit}
            onKeyDown={onKeyDown}
          />
        </label>
        <button className="btn small" onClick={commit}>
          应用
        </button>
      </div>
      <label className="field">
        <span className="field-label">边界模式</span>
        <select value={wrap ? 'wrap' : 'finite'} onChange={(e) => onWrapChange(e.target.value === 'wrap')}>
          <option value="finite">有限边界（越界即死亡）</option>
          <option value="wrap">环绕边界（左右上下相连）</option>
        </select>
      </label>
    </div>
  )
}
