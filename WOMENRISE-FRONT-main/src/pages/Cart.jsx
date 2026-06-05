import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { marketApi } from '../api/client'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { EmptyState, Alert, money } from '../components/ui'

export default function Cart() {
  const { items, removeItem, setQty, clear, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [checking, setChecking] = useState(false)
  const [checkError, setCheckError] = useState('')
  const [order, setOrder] = useState(null)

  async function handleCheckout() {
    if (!user) {
      navigate('/login')
      return
    }
    setChecking(true)
    setCheckError('')
    try {
      const result = await marketApi.checkout(
        items.map((i) => ({ product_id: i.id, quantity: i.quantity }))
      )
      clear()
      setOrder(result)
    } catch (err) {
      setCheckError(err.response?.data?.detail || 'Checkout failed. Please try again.')
    } finally {
      setChecking(false)
    }
  }

  // Order success state
  if (order) {
    return (
      <div className="container page" style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎉</div>
        <h2>Order Placed!</h2>
        <p className="lead" style={{ marginBottom: 8 }}>
          Thank you for supporting women entrepreneurs.
        </p>
        <p className="muted" style={{ marginBottom: 24 }}>
          Order <strong>#{order.id}</strong> · Total: <strong>{money(order.total)}</strong>
          <br />
          Status: <strong style={{ textTransform: 'capitalize' }}>{order.status}</strong>
        </p>
        <div className="row" style={{ justifyContent: 'center', gap: 12 }}>
          <Link to="/dashboard" className="btn btn-primary">
            View My Orders
          </Link>
          <Link to="/marketplace" className="btn btn-outline">
            Keep Shopping
          </Link>
        </div>
      </div>
    )
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="container page">
        <EmptyState icon="🛒" title="Your cart is empty">
          Discover beautiful handcrafted products made by talented women.
        </EmptyState>
        <div className="center" style={{ marginTop: 8 }}>
          <Link to="/marketplace" className="btn btn-primary">
            Browse Marketplace
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container page">
      {/* Page header */}
      <div style={{ marginBottom: 36 }}>
        <span className="eyebrow">Your Bag</span>
        <h2 style={{ marginTop: 6 }}>Shopping Cart</h2>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start', gap: 40 }}>
        {/* Cart items */}
        <div className="col" style={{ gap: 16 }}>
          {items.map((item) => (
            <div
              key={item.id}
              className="card card-body"
              style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}
            >
              {/* Product image */}
              <img
                src={item.image_url}
                alt={item.title}
                style={{
                  width: 88,
                  height: 88,
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--gradient-soft)',
                  flexShrink: 0,
                }}
              />

              {/* Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link
                  to={`/marketplace/${item.id}`}
                  style={{ fontWeight: 700, color: 'var(--text)', fontSize: '1rem', display: 'block', marginBottom: 4 }}
                >
                  {item.title}
                </Link>
                <div className="soft" style={{ fontSize: '0.85rem', marginBottom: 12 }}>
                  {money(item.price)} each
                </div>

                {/* Quantity stepper */}
                <div className="row between">
                  <div className="row" style={{ gap: 0 }}>
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)', padding: '5px 10px' }}
                      onClick={() => setQty(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span
                      style={{
                        padding: '5px 14px',
                        border: '1px solid var(--border)',
                        borderLeft: 0,
                        borderRight: 0,
                        fontWeight: 700,
                        minWidth: 40,
                        textAlign: 'center',
                        fontSize: '0.9rem',
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', padding: '5px 10px' }}
                      onClick={() => setQty(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="row" style={{ gap: 12 }}>
                    <span className="price">{money(item.price * item.quantity)}</span>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--danger)', padding: '5px 8px' }}
                      onClick={() => removeItem(item.id)}
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="card card-body col" style={{ position: 'sticky', top: 'calc(var(--nav-h) + 24px)', gap: 20 }}>
          <h3 style={{ margin: 0 }}>Order Summary</h3>

          {/* Line items summary */}
          <div className="col" style={{ gap: 10 }}>
            {items.map((item) => (
              <div key={item.id} className="row between" style={{ fontSize: '0.9rem' }}>
                <span className="muted" style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.title} ×{item.quantity}
                </span>
                <span style={{ fontWeight: 600, flexShrink: 0, marginLeft: 12 }}>
                  {money(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: 0 }} />

          {/* Total */}
          <div className="row between">
            <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Total</span>
            <span className="stat-num gradient-text" style={{ fontSize: '1.6rem' }}>
              {money(total)}
            </span>
          </div>

          {checkError && <Alert type="error">{checkError}</Alert>}

          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={handleCheckout}
            disabled={checking}
          >
            {checking ? 'Processing…' : user ? 'Checkout Securely' : 'Sign in to Checkout'}
          </button>

          <Link to="/marketplace" className="btn btn-outline btn-block" style={{ textAlign: 'center' }}>
            Continue Shopping
          </Link>

          <p className="soft center" style={{ fontSize: '0.82rem', margin: 0 }}>
            🔒 Secure checkout · Every purchase supports a woman entrepreneur
          </p>
        </div>
      </div>
    </div>
  )
}
