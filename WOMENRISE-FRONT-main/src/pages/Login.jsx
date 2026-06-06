import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import { Alert } from '../components/ui'

export default function Login() {
  const { login, googleLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(location.state?.from || '/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    setError('')
    setLoading(true)
    try {
      await googleLogin(credentialResponse.credential)
      navigate(location.state?.from || '/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Google Login failed.')
    } finally {
      setLoading(false)
    }
  }

  function handleGoogleError() {
    setError('Google authentication failed.')
  }

  return (
    <div className="container page" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 60 }}>
      <div className="card" style={{ width: '100%', maxWidth: 420 }}>
        <div className="card-body" style={{ padding: 36 }}>
          {/* Header */}
          <div className="center" style={{ marginBottom: 28 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'var(--gradient)', margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem'
            }}>
              🌸
            </div>
            <h2 style={{ marginBottom: 4 }}>Welcome back</h2>
            <p className="muted" style={{ margin: 0, fontSize: '0.95rem' }}>
              Sign in to your WomenRise account
            </p>
          </div>

          <Alert type="error">{error}</Alert>

          {/* Google Login Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, width: '100%' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
              shape="rectangular"
              theme="outline"
              size="large"
              width="348"
            />
          </div>

          <div className="center soft" style={{ margin: '18px 0', fontSize: '0.85rem' }}>
            — Yoki Email orqali —
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="center muted" style={{ marginTop: 24, marginBottom: 0, fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 600 }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
