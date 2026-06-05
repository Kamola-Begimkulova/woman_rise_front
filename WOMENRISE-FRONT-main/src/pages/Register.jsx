import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Alert } from '../components/ui'

const ROLES = [
  { value: 'learner', label: 'Learner — I want to grow my skills' },
  { value: 'seller', label: 'Seller — I want to sell my products' },
  { value: 'mentor', label: 'Mentor — I want to guide others' },
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'learner',
    bio: '',
    expertise: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const needsExtra = form.role === 'seller' || form.role === 'mentor'

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container page" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 48 }}>
      <div className="card" style={{ width: '100%', maxWidth: 460 }}>
        <div className="card-body" style={{ padding: 36 }}>
          {/* Header */}
          <div className="center" style={{ marginBottom: 28 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'var(--gradient)', margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem'
            }}>
              ✨
            </div>
            <h2 style={{ marginBottom: 4 }}>Join WomenRise</h2>
            <p className="muted" style={{ margin: 0, fontSize: '0.95rem' }}>
              Your journey to empowerment starts here
            </p>
          </div>

          <Alert type="error">{error}</Alert>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label" htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                className="input"
                value={form.name}
                onChange={set('name')}
                placeholder="Jane Doe"
                required
                autoComplete="name"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="reg-email">Email address</label>
              <input
                id="reg-email"
                type="email"
                className="input"
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                className="input"
                value={form.password}
                onChange={set('password')}
                placeholder="At least 6 characters"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="role">I am a…</label>
              <select
                id="role"
                className="select"
                value={form.role}
                onChange={set('role')}
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {needsExtra && (
              <>
                <div className="field">
                  <label className="label" htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    className="textarea"
                    value={form.bio}
                    onChange={set('bio')}
                    placeholder="Tell the community a bit about yourself…"
                    rows={3}
                  />
                </div>

                <div className="field">
                  <label className="label" htmlFor="expertise">
                    {form.role === 'mentor' ? 'Areas of expertise' : 'Products / skills'}
                  </label>
                  <textarea
                    id="expertise"
                    className="textarea"
                    value={form.expertise}
                    onChange={set('expertise')}
                    placeholder={
                      form.role === 'mentor'
                        ? 'e.g. Product design, Marketing, Finance…'
                        : 'e.g. Handmade jewelry, Skincare products…'
                    }
                    rows={2}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading ? 'Creating account…' : 'Create my account'}
            </button>
          </form>

          <p className="center muted" style={{ marginTop: 24, marginBottom: 0, fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
