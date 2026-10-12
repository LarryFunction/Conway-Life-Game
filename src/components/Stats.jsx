export default function Stats({ generation, alive, rows, cols }) {
  const total = rows * cols
  const pct = total ? (alive / total) * 100 : 0
  return (
    <div className="stats">
      <div className="stat">
        <span className="stat-label">代数</span>
        <span className="stat-value">{generation}</span>
      </div>
      <div className="stat">
        <span className="stat-label">存活细胞</span>
        <span className="stat-value">{alive}</span>
      </div>
      <div className="stat">
        <span className="stat-label">网格</span>
        <span className="stat-value">
          {cols} × {rows}
        </span>
      </div>
      <div className="stat">
        <span className="stat-label">密度</span>
        <span className="stat-value">{pct.toFixed(1)}%</span>
      </div>
    </div>
  )
}
