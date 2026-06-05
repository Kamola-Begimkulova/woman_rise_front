import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { coursesApi, marketApi, statsApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { Spinner, Avatar, Badge, EmptyState, Alert, Progress, money } from '../components/ui'

const EMPTY_PRODUCT = { title: '', description: '', category: 'jewelry', price: '', image_url: '', stock: 10 }
const PRODUCT_CATS = ['jewelry', 'textiles', 'art', 'beauty', 'home']

export default function Dashboard() {
  const { user } = useAuth()
  const isSeller = user?.role === 'seller'

  const [stats, setStats] = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [orders, setOrders] = useState([])
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const calls = [statsApi.get(), coursesApi.myEnrollments(), marketApi.myOrders()]
      if (isSeller) calls.push(marketApi.mine())
      const [s, e, o, l] = await Promise.all(calls)
      setStats(s)
      setEnrollments(e)
      setOrders(o)
      if (isSeller) setListings(l)
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not load your dashboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function bumpProgress(enr) {
    const next = Math.min(100, enr.progress + 25)
    try {
      const updated = await coursesApi.setProgress(enr.id, next)
      setEnrollments((list) => list.map((x) => (x.id === enr.id ? updated : x)))
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not update progress.')
    }
  }

  async function createProduct(e) {
    e.preventDefault()
    setCreating(true)
    setError('')
    setCreated(false)
    try {
      await marketApi.create({
        ...form,
        price: parseFloat(form.price) || 0,
        stock: parseInt(form.stock, 10) || 0,
      })
      setForm(EMPTY_PRODUCT)
      setCreated(true)
      const l = await marketApi.mine()
      setListings(l)
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not create listing.')
    } finally {
      setCreating(false)
    }
  }

  if (loading) return <div className="container page"><Spinner /></div>

  return (
    <div className="container page col" style={{ gap: 40 }}>
      {/* Welcome */}
      <div className="row between wrap" style={{ gap: 16 }}>
        <div className="row" style={{ gap: 16 }}>
          <Avatar name={user.name} src={user.avatar_url} size={64} />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.9rem' }}>Welcome, {user.name.split(' ')[0]} 👋</h1>
            <Badge variant={isSeller ? 'rose' : 'teal'}>{user.role}</Badge>
          </div>
        </div>
        <div className="row" style={{ gap: 10 }}>
          <Link to="/courses" className="btn btn-outline btn-sm">Browse courses</Link>
          <Link to="/marketplace" className="btn btn-primary btn-sm">Marketplace</Link>
        </div>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {/* Platform stats */}
      {stats && (
        <div className="grid grid-4">
          {[
            [stats.total_enrollments, 'Total enrollments'],
            [stats.courses_count, 'Courses'],
            [stats.products_count, 'Products'],
            [money(stats.economic_impact), 'Economic impact'],
          ].map(([n, label]) => (
            <div key={label} className="card card-body center">
              <div className="stat-num gradient-text">{n}</div>
              <div className="soft" style={{ fontSize: '0.85rem' }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* My learning */}
      <section>
        <h2 style={{ fontSize: '1.5rem' }}>My Learning</h2>
        {enrollments.length === 0 ? (
          <EmptyState icon="🎓" title="No courses yet">
            <Link to="/courses">Find a course</Link> to start learning.
          </EmptyState>
        ) : (
          <div className="col" style={{ gap: 14 }}>
            {enrollments.map((enr) => (
              <div key={enr.id} className="card card-body">
                <div className="row between wrap" style={{ gap: 12, marginBottom: 10 }}>
                  <div className="row" style={{ gap: 12 }}>
                    {enr.course.image_url && (
                      <img src={enr.course.image_url} alt="" style={{ width: 64, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                    )}
                    <div>
                      <strong>{enr.course.title}</strong>
                      <div className="soft" style={{ fontSize: '0.85rem' }}>{enr.course.category} · {enr.course.level}</div>
                    </div>
                  </div>
                  {enr.completed ? (
                    <Badge variant="teal">✓ Completed</Badge>
                  ) : (
                    <button className="btn btn-outline btn-sm" onClick={() => bumpProgress(enr)}>+25% progress</button>
                  )}
                </div>
                <Progress value={enr.progress} />
                <div className="soft" style={{ fontSize: '0.8rem', marginTop: 6 }}>{enr.progress}% complete</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* My orders */}
      <section>
        <h2 style={{ fontSize: '1.5rem' }}>My Orders</h2>
        {orders.length === 0 ? (
          <EmptyState icon="🛍️" title="No orders yet">
            Support women entrepreneurs in the <Link to="/marketplace">marketplace</Link>.
          </EmptyState>
        ) : (
          <div className="col" style={{ gap: 12 }}>
            {orders.map((o) => (
              <div key={o.id} className="card card-body row between wrap" style={{ gap: 12 }}>
                <div>
                  <strong>Order #{o.id}</strong>
                  <div className="soft" style={{ fontSize: '0.85rem' }}>
                    {(o.items?.length || 0)} item{(o.items?.length || 0) === 1 ? '' : 's'}
                    {o.items?.length ? ` · ${o.items.map((i) => i.title).join(', ')}` : ''}
                  </div>
                </div>
                <div className="row" style={{ gap: 12 }}>
                  <Badge variant="amber">{o.status}</Badge>
                  <span className="price">{money(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Seller listings */}
      {isSeller && (
        <section className="grid grid-2" style={{ alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem' }}>My Listings</h2>
            {listings.length === 0 ? (
              <EmptyState icon="📦" title="No listings yet">List your first product →</EmptyState>
            ) : (
              <div className="col" style={{ gap: 12 }}>
                {listings.map((p) => (
                  <div key={p.id} className="card card-body row between" style={{ gap: 12 }}>
                    <div className="row" style={{ gap: 12 }}>
                      {p.image_url && <img src={p.image_url} alt="" style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover' }} />}
                      <div>
                        <strong>{p.title}</strong>
                        <div className="soft" style={{ fontSize: '0.85rem' }}>{p.category} · {p.stock} in stock</div>
                      </div>
                    </div>
                    <span className="price">{money(p.price)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card card-body">
            <h3>List a product</h3>
            {created && <Alert type="success">Product listed!</Alert>}
            <form className="col" style={{ gap: 0 }} onSubmit={createProduct}>
              <div className="field">
                <label className="label">Title</label>
                <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="field">
                <label className="label">Description</label>
                <textarea className="textarea" style={{ minHeight: 70 }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="row" style={{ gap: 12 }}>
                <div className="field" style={{ flex: 1 }}>
                  <label className="label">Category</label>
                  <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {PRODUCT_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <label className="label">Price ($)</label>
                  <input className="input" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
              </div>
              <div className="row" style={{ gap: 12 }}>
                <div className="field" style={{ flex: 2 }}>
                  <label className="label">Image URL</label>
                  <input className="input" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://…" />
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <label className="label">Stock</label>
                  <input className="input" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                </div>
              </div>
              <button className="btn btn-primary btn-block" disabled={creating}>
                {creating ? 'Listing…' : 'List product'}
              </button>
            </form>
          </div>
        </section>
      )}
    </div>
  )
}
