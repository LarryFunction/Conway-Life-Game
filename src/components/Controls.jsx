export default function Controls({
  running,
  onToggle,
  onStep,
  onReset,
  speed,
  onSpeedChange,
}) {
  return (
    <div className="panel">
      <h2 className="panel-title">运行控制</h2>
      <div className="button-row">
        <button className="btn btn-primary" onClick={onToggle}>
          {running ? '⏸ 暂停' : '▶ 开始'}
        </button>
        <button className="btn" onClick={onStep} disabled={running}>
          ⏭ 单步
        </button>
        <button className="btn" onClick={onReset}>
          ↺ 重置
        </button>
      </div>
      <label className="field">
        <span className="field-label">
          速度 <strong>{speed}</strong> 代/秒
        </span>
        <input
          type="range"
          min="1"
          max="60"
          step="1"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
        />
      </label>
    </div>
  )
}
