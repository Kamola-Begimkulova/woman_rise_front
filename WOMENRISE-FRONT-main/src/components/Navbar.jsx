import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { Avatar } from './ui'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const close = () => setOpen(false)

  function handleLogout() {
    logout()
    close()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark" />
          Women<span className="gradient-text">Rise</span>
        </Link>

        <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          ☰
        </button>

        <div className={`nav-links ${open ? '' : 'closed'}`}>
          <NavLink to="/courses" onClick={close}>Courses</NavLink>
          <NavLink to="/marketplace" onClick={close}>Marketplace</NavLink>
          <NavLink to="/community" onClick={close}>Community</NavLink>
          <NavLink to="/mentors" onClick={close}>Mentors</NavLink>
          <NavLink to="/cart" onClick={close} className="cart-dot" data-count={count || null}>
            Cart
          </NavLink>

          {user ? (
            <>
              <NavLink to="/dashboard" onClick={close} className="row" style={{ gap: 8 }}>
                <Avatar name={user.name} src={user.avatar_url} size={28} />
                Dashboard
              </NavLink>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={close}>Log in</NavLink>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={close}>
                Join free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
