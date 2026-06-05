import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { statsApi } from '../api/client'
import { Badge } from '../components/ui'

const PILLARS = [
  {
    icon: '🎓',
    title: 'Education First',
    text: 'Accessible, high-quality courses in technology, wellness, and business skills — taught by expert women.',
    variant: '',
  },
  {
    icon: '🛍️',
    title: 'Marketplace Platform',
    text: 'A dedicated space for women entrepreneurs to showcase and sell handmade products.',
    variant: 'rose',
  },
  {
    icon: '🤝',
    title: 'Community Building',
    text: 'Fostering connections, mentorship, and collaboration among women entrepreneurs globally.',
    variant: 'teal',
  },
]

const FEATURES = [
  { n: '01', t: 'Course Enrollment System', d: 'Streamlined registration with progress tracking, certification, and flexible learning paths across technology and wellness.' },
  { n: '02', t: 'Integrated Marketplace Dashboard', d: 'Easy product listing, inventory management, secure payments, and analytics for women entrepreneurs.' },
  { n: '03', t: 'Community Engagement Tools', d: 'Discussion forums, mentorship matching, live workshops, and networking events connecting all members.' },
]

const DEFAULT_STATS = {
  women_served: 10000,
  businesses_launched: 500,
  economic_impact: 5000000,
  courses_count: 8,
}

function compact(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K+`
  return `${n}+`
}

export default function Landing() {
  const [stats, setStats] = useState(DEFAULT_STATS)

  useEffect(() => {
    statsApi.get().then(setStats).catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-blob" style={{ width: 380, height: 380, background: '#c084fc', top: -120, left: -80 }} />
        <div className="hero-blob" style={{ width: 320, height: 320, background: '#f9a8d4', top: 40, right: -60 }} />
        <div className="container section" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Badge variant="rose">Empowering Women Through Digital Innovation</Badge>
          <h1 style={{ maxWidth: 880, margin: '18px auto 16px' }}>
            From <span className="gradient-text">learning</span> to{' '}
            <span className="gradient-text">earning</span> — one ecosystem for women.
          </h1>
          <p className="lead" style={{ maxWidth: 640, margin: '0 auto 28px' }}>
            WomenRise connects education, entrepreneurship, and economic independence —
            bridging the gap between building skills and building a business.
          </p>
          <div className="row center wrap" style={{ justifyContent: 'center', gap: 12 }}>
            <Link to="/register" className="btn btn-primary btn-lg">Join the movement</Link>
            <Link to="/courses" className="btn btn-outline btn-lg">Explore courses</Link>
          </div>
          <div className="grid grid-4" style={{ maxWidth: 760, margin: '52px auto 0' }}>
            {[
              ['2.5B', 'Women entrepreneurs globally'],
              [compact(stats.women_served), 'Women served'],
              [compact(stats.businesses_launched), 'Businesses launched'],
              [compact(stats.economic_impact), 'Economic impact'],
            ].map(([num, label]) => (
              <div key={label}>
                <div className="stat-num gradient-text">{num}</div>
                <div className="soft" style={{ fontSize: '0.85rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section container" id="mission">
        <div className="center" style={{ maxWidth: 640, margin: '0 auto 48px' }}>
          <span className="eyebrow">Our Mission</span>
          <h2>An integrated ecosystem, not scattered tools</h2>
          <p className="muted">
            Current platforms focus on <em>either</em> education <em>or</em> commerce, forcing
            women to navigate multiple systems. We unify them.
          </p>
        </div>
        <div className="grid grid-3">
          {PILLARS.map((p) => (
            <div key={p.title} className="card card-body card-hover">
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>{p.icon}</div>
              <Badge variant={p.variant}>Pillar</Badge>
              <h3 style={{ margin: '10px 0 6px' }}>{p.title}</h3>
              <p className="muted" style={{ margin: 0 }}>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section style={{ background: 'var(--surface-2)' }}>
        <div className="section container grid grid-2" style={{ alignItems: 'center' }}>
          <div>
            <span className="eyebrow">The Challenge</span>
            <h2>The gap between learning and earning is real</h2>
            <p className="muted">
              Women represent over 40% of all entrepreneurs, yet face disproportionate barriers.
              Women-owned businesses generate only 30% of e-commerce revenue despite equal
              participation. The resources are fragmented — we make them cohesive.
            </p>
          </div>
          <div className="grid grid-2">
            <div className="card card-body center">
              <div className="stat-num gradient-text">40%</div>
              <p className="soft" style={{ margin: 0 }}>of entrepreneurs are women</p>
            </div>
            <div className="card card-body center">
              <div className="stat-num gradient-text">70%</div>
              <p className="soft" style={{ margin: 0 }}>marketplace revenue gap</p>
            </div>
            <div className="card card-body center">
              <div className="stat-num gradient-text">$15B</div>
              <p className="soft" style={{ margin: 0 }}>women's e-learning by 2027</p>
            </div>
            <div className="card card-body center">
              <div className="stat-num gradient-text">$80B</div>
              <p className="soft" style={{ margin: 0 }}>handmade goods market</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section container">
        <div className="center" style={{ maxWidth: 640, margin: '0 auto 48px' }}>
          <span className="eyebrow">Platform Features</span>
          <h2>Everything she needs, in one place</h2>
        </div>
        <div className="grid grid-3">
          {FEATURES.map((f) => (
            <div key={f.n} className="card card-body">
              <div className="stat-num gradient-text" style={{ fontSize: '2rem' }}>{f.n}</div>
              <h3 style={{ margin: '8px 0' }}>{f.t}</h3>
              <p className="muted" style={{ margin: 0 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact CTA */}
      <section className="section" id="impact" style={{ background: 'var(--gradient)', color: '#fff' }}>
        <div className="container center" style={{ maxWidth: 720 }}>
          <h2 style={{ color: '#fff' }}>Join us in building the future</h2>
          <p style={{ fontSize: '1.15rem', opacity: 0.95 }}>
            WomenRise is more than a platform — it's a movement toward economic empowerment
            and gender equality in entrepreneurship and technology.
          </p>
          <div className="row center wrap" style={{ justifyContent: 'center', gap: 12, marginTop: 24 }}>
            <Link to="/register" className="btn btn-lg" style={{ background: '#fff', color: 'var(--violet-dark)' }}>
              Get started free
            </Link>
            <Link to="/marketplace" className="btn btn-lg btn-outline" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.6)' }}>
              Visit marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
