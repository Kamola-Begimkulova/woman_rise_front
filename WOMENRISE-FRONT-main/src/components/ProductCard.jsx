import { Link } from 'react-router-dom'
import { Stars, money } from './ui'

/** Marketplace product card for grid listings. */
export default function ProductCard({ product, onAdd }) {
  return (
    <div className="card card-hover">
      <Link to={`/marketplace/${product.id}`}>
        <img className="card-img" src={product.image_url} alt={product.title} loading="lazy" />
      </Link>
      <div className="card-body">
        <span className="soft" style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>
          {product.category}
        </span>
        <h3 style={{ fontSize: '1.05rem', margin: '4px 0 6px' }}>
          <Link to={`/marketplace/${product.id}`} style={{ color: 'inherit' }}>
            {product.title}
          </Link>
        </h3>
        <p className="soft" style={{ fontSize: '0.82rem', marginBottom: 8 }}>
          by {product.seller?.name}
        </p>
        <div className="row between">
          <span className="price">{money(product.price)}</span>
          <Stars value={product.rating} />
        </div>
        {onAdd && (
          <button
            className="btn btn-primary btn-sm btn-block"
            style={{ marginTop: 12 }}
            onClick={() => onAdd(product)}
            disabled={product.stock <= 0}
          >
            {product.stock <= 0 ? 'Sold out' : 'Add to cart'}
          </button>
        )}
      </div>
    </div>
  )
}
