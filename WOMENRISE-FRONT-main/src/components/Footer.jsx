import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid grid-4" style={{ gap: 40 }}>
          <div>
            <div className="brand" style={{ color: '#fff', marginBottom: 12 }}>
              <span className="brand-mark" />
              WomenRise
            </div>
            <p style={{ color: '#9b90bb', fontSize: '0.92rem' }}>
              Empowering women through digital innovation — bridging education,
              entrepreneurship, and economic independence.
            </p>
          </div>
          <div>
            <h4>Learn</h4>
            <div className="col" style={{ gap: 8 }}>
              <Link to="/courses">Courses</Link>
              <Link to="/mentors">Find a Mentor</Link>
              <Link to="/community">Community</Link>
            </div>
          </div>
          <div>
            <h4>Sell</h4>
            <div className="col" style={{ gap: 8 }}>
              <Link to="/marketplace">Marketplace</Link>
              <Link to="/dashboard">Seller Dashboard</Link>
              <Link to="/register">Become a Seller</Link>
            </div>
          </div>
          <div>
            <h4>Company</h4>
            <div className="col" style={{ gap: 8 }}>
              <a href="#mission">Our Mission</a>
              <a href="#impact">Impact</a>
              <a href="#partners">Partnerships</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom row between wrap">
          <span>© 2026 WomenRise. A movement toward economic empowerment.</span>
          <span>Launching Q2 2026</span>
        </div>
      </div>
    </footer>
  )
}
