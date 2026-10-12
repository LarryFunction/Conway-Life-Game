import { useState } from 'react'

export default function PatternPanel({
  patterns,
  selectedIndex,
  onSelect,
  density,
  onDensityChange,
  onRandom,
  onImport,
  onExport,
}) {
  const [text, setText] = useState('')
  const [message, setMessage] = useState('')

  const flash = (msg) => {
    setMessage(msg)
    window.setTimeout(() => setMessage(''), 2200)
  }

  const handleImport = () => {
    const ok = onImport(text)
    flash(ok ? '导入成功' : '导入失败：无法解析内容')
  }

  const handleExport = (format) => {
    setText(onExport(format))
    flash('已生成导出内容，可复制使用')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      flash('已复制到剪贴板')
    } catch {
      flash('复制失败，请手动选择复制')
    }
  }

  return (
    <div className="panel">
      <h2 className="panel-title">初始状态</h2>

      <div className="subsection">
        <span className="field-label">随机填充</span>
        <div className="row-inline">
          <input
            type="range"
            min="5"
            max="90"
            step="1"
            value={density}
            onChange={(e) => onDensityChange(Number(e.target.value))}
          />
          <span className="density-value">{density}%</span>
          <button className="btn small" onClick={onRandom}>
            随机
          </button>
        </div>
      </div>

      <div className="subsection">
        <span className="field-label">
          预设图案{selectedIndex != null ? '（点击网格放置）' : '（先选一个）'}
        </span>
        <div className="pattern-grid">
          {patterns.map((p, i) => (
            <button
              key={p.name}
              className={'pattern-btn' + (selectedIndex === i ? ' active' : '')}
              onClick={() => onSelect(selectedIndex === i ? null : i)}
              title={`${p.width} × ${p.height}`}
            >
              {p.name}
            </button>
          ))}
        </div>
        {selectedIndex != null && (
          <button className="btn small" onClick={() => onSelect(null)}>
            取消选择
          </button>
        )}
      </div>

      <div className="subsection">
        <span className="field-label">导入 / 导出（RLE 或文本）</span>
        <textarea
          className="io-textarea"
          rows="6"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={'粘贴 RLE 或文本格式（O 表示活细胞，. 表示死细胞）后点击导入'}
        />
        <div className="button-row">
          <button className="btn small" onClick={handleImport}>
            导入
          </button>
          <button className="btn small" onClick={() => handleExport('rle')}>
            导出 RLE
          </button>
          <button className="btn small" onClick={() => handleExport('text')}>
            导出文本
          </button>
          <button className="btn small" onClick={handleCopy} disabled={!text}>
            复制
          </button>
        </div>
        {message && <div className="io-message">{message}</div>}
      </div>
    </div>
  )
}
