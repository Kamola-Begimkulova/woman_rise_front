import { useEffect, useState } from 'react'
import { marketApi } from '../api/client'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import { Spinner, EmptyState, Alert } from '../components/ui'

const CATEGORIES = ['All', 'jewelry', 'textiles', 'art', 'beauty', 'home']

export default function Marketplace() {
  const { addItem } = useCart()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [active, setActive] = useState('All')
  const [toastId, setToastId] = useState(null)
  const [toastTitle, setToastTitle] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    marketApi
      .list(active === 'All' ? undefined : active)
      .then(setProducts)
      .catch((err) => setError(err.response?.data?.detail || 'Failed to load products.'))
      .finally(() => setLoading(false))
  }, [active])

  function handleAdd(product) {
    addItem(product)
    setToastId(product.id)
    setToastTitle(product.title)
    setTimeout(() => setToastId(null), 2500)
  }

  return (
    <div className="container page">
      {/* Page header */}
      <div className="center" style={{ maxWidth: 640, margin: '0 auto 40px' }}>
        <span className="eyebrow">Shop & Support</span>
        <h2>Women's Marketplace</h2>
        <p className="lead">
          Discover handcrafted products made by talented women entrepreneurs. Every purchase
          directly supports a woman-owned business.
        </p>
      </div>

      {/* Category chips */}
      <div className="row wrap" style={{ justifyContent: 'center', gap: 10, marginBottom: 36 }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`chip${active === cat ? ' active' : ''}`}
            onClick={() => setActive(cat)}
          >
            {cat === 'All' ? 'All Products' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Toast notification */}
      {toastId && (
        <div
          className="alert alert-success"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 100,
            boxShadow: 'var(--shadow)',
            maxWidth: 320,
          }}
        >
          🛍️ <strong>{toastTitle}</strong> added to cart!
        </div>
      )}

      <Alert type="error">{error}</Alert>

      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <EmptyState icon="🛍️" title="No products found">
          Try a different category or check back soon.
        </EmptyState>
      ) : (
        <div className="grid grid-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={handleAdd} />
          ))}
        </div>
      )}
    </div>
  )
}
