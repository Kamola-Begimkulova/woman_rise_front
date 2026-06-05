import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { marketApi } from '../api/client'
import { useCart } from '../context/CartContext'
import { Spinner, Stars, Avatar, Badge, Alert, money } from '../components/ui'

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setLoading(true)
    marketApi
      .get(id)
      .then(setProduct)
      .catch((err) => {
        const status = err.response?.status
        setError(
          status === 404
            ? 'Product not found.'
            : err.response?.data?.detail || 'Failed to load product.'
        )
      })
      .finally(() => setLoading(false))
  }, [id])

  function handleAddToCart() {
    if (!product || product.stock <= 0) return
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  if (loading) return <div className="container page"><Spinner /></div>

  if (error) {
    return (
      <div className="container page" style={{ maxWidth: 600, margin: '0 auto' }}>
        <Alert type="error">{error}</Alert>
        <Link to="/marketplace" className="btn btn-outline">← Back to Marketplace</Link>
      </div>
    )
  }

  if (!product) return null

  const soldOut = product.stock <= 0
  const effectiveQty = Math.min(qty, product.stock)

  return (
    <div className="container page">
      {/* Breadcrumb */}
      <div style={{ marginBottom: 28 }}>
        <Link to="/marketplace" className="muted" style={{ fontSize: '0.9rem' }}>
          ← Back to Marketplace
        </Link>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start', gap: 48 }}>
        {/* Left — image */}
        <div>
          <img
            src={product.image_url}
            alt={product.title}
            style={{
              width: '100%',
              aspectRatio: '1 / 1',
              objectFit: 'cover',
              borderRadius: 'var(--radius)',
              background: 'var(--gradient-soft)',
              boxShadow: 'var(--shadow)',
            }}
          />
        </div>

        {/* Right — details */}
        <div className="col" style={{ gap: 20 }}>
          {/* Category */}
          <div>
            <Badge>{product.category}</Badge>
          </div>

          {/* Title */}
          <h2 style={{ margin: 0 }}>{product.title}</h2>

          {/* Seller */}
          <div className="row" style={{ gap: 12 }}>
            <Avatar name={product.seller?.name} src={product.seller?.avatar_url} size={36} />
            <span className="muted" style={{ fontSize: '0.92rem' }}>
              by <strong>{product.seller?.name}</strong>
            </span>
          </div>

          {/* Rating */}
          <div className="row" style={{ gap: 8 }}>
            <Stars value={product.rating} />
            <span className="soft" style={{ fontSize: '0.85rem' }}>
              {product.rating.toFixed(1)} out of 5
            </span>
          </div>

          {/* Price */}
          <div>
            <span className="stat-num gradient-text" style={{ fontSize: '2rem' }}>
              {money(product.price)}
            </span>
          </div>

          {/* Description */}
          <p className="muted" style={{ lineHeight: 1.75, margin: 0 }}>
            {product.description}
          </p>

          <hr className="divider" style={{ margin: '4px 0' }} />

          {/* Stock status */}
          <div className="row" style={{ gap: 8 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: soldOut ? 'var(--danger)' : 'var(--success)',
                flexShrink: 0,
              }}
            />
            <span className="soft" style={{ fontSize: '0.9rem' }}>
              {soldOut ? 'Out of stock' : `${product.stock} in stock`}
            </span>
          </div>

          {/* Quantity selector */}
          {!soldOut && (
            <div className="field" style={{ margin: 0 }}>
              <label className="label">Quantity</label>
              <div className="row" style={{ gap: 0, width: 'fit-content' }}>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)', padding: '7px 14px' }}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                >
                  −
                </button>
                <span
                  style={{
                    padding: '7px 20px',
                    border: '1px solid var(--border)',
                    borderLeft: 0,
                    borderRight: 0,
                    fontWeight: 700,
                    minWidth: 48,
                    textAlign: 'center',
                  }}
                >
                  {effectiveQty}
                </span>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', padding: '7px 14px' }}
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  disabled={qty >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to cart feedback */}
          {added && (
            <Alert type="success">
              Added {effectiveQty}× <strong>{product.title}</strong> to your cart!
            </Alert>
          )}

          {/* Add to cart button */}
          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={handleAddToCart}
            disabled={soldOut}
          >
            {soldOut ? 'Out of Stock' : `Add to Cart — ${money(product.price * effectiveQty)}`}
          </button>

          <Link to="/cart" className="btn btn-outline btn-block" style={{ textAlign: 'center' }}>
            🛒 View Cart
          </Link>
        </div>
      </div>
    </div>
  )
}
