/** Small reusable presentational helpers shared across pages. */

export function Spinner() {
  return <div className="spinner" aria-label="Loading" />
}

export function Stars({ value = 5 }) {
  const full = Math.round(value)
  return (
    <span className="stars" title={`${value} / 5`}>
      {'★'.repeat(full)}
      <span style={{ color: 'var(--border)' }}>{'★'.repeat(5 - full)}</span>
    </span>
  )
}

export function Avatar({ name = '', src = '', size = 40 }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : initials}
    </span>
  )
}

export function Badge({ children, variant = '' }) {
  return <span className={`badge ${variant ? `badge-${variant}` : ''}`}>{children}</span>
}

export function EmptyState({ icon = '✨', title, children }) {
  return (
    <div className="empty">
      <div style={{ fontSize: '2.6rem', marginBottom: 12 }}>{icon}</div>
      <h3>{title}</h3>
      {children && <p className="muted">{children}</p>}
    </div>
  )
}

export function Alert({ type = 'error', children }) {
  if (!children) return null
  return <div className={`alert alert-${type}`}>{children}</div>
}

export function Progress({ value = 0 }) {
  return (
    <div className="progress">
      <span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}

export function money(n) {
  return `$${Number(n || 0).toFixed(2)}`
}
