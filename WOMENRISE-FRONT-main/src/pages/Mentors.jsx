import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mentorApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { Spinner, Avatar, Badge, EmptyState, Alert } from '../components/ui'

export default function Mentors() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openId, setOpenId] = useState(null)
  const [form, setForm] = useState({ topic: '', message: '' })
  const [sentTo, setSentTo] = useState(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    mentorApi
      .list()
      .then(setMentors)
      .catch(() => setError('Could not load mentors.'))
      .finally(() => setLoading(false))
  }, [])

  function toggle(id) {
    if (!user) return navigate('/login', { state: { from: '/mentors' } })
    setSentTo(null)
    setForm({ topic: '', message: '' })
    setOpenId((cur) => (cur === id ? null : id))
  }

  async function submit(e, mentorId) {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      await mentorApi.request({ mentor_id: mentorId, topic: form.topic, message: form.message })
      setSentTo(mentorId)
      setOpenId(null)
    } catch (err) {
      setError(err.response?.data?.detail || 'Request failed.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="container page">
      <div className="center" style={{ maxWidth: 620, margin: '0 auto 40px' }}>
        <span className="eyebrow">Mentorship</span>
        <h1>Learn from women who've done it</h1>
        <p className="lead">
          Connect with experienced mentors for one-on-one guidance on tech, business, and growth.
        </p>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {loading ? (
        <Spinner />
      ) : mentors.length === 0 ? (
        <EmptyState icon="🤝" title="No mentors yet">
          Mentors will appear here as they join the platform.
        </EmptyState>
      ) : (
        <div className="grid grid-3">
          {mentors.map((m) => {
            const tags = (m.expertise || '')
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
            return (
              <div key={m.id} className="card card-body col" style={{ gap: 12 }}>
                <div className="row" style={{ gap: 14 }}>
                  <Avatar name={m.name} src={m.avatar_url} size={56} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{m.name}</h3>
                    <span className="soft" style={{ fontSize: '0.85rem' }}>Mentor</span>
                  </div>
                </div>

                {tags.length > 0 && (
                  <div className="row wrap" style={{ gap: 6 }}>
                    {tags.map((t) => (
                      <Badge key={t} variant="teal">{t}</Badge>
                    ))}
                  </div>
                )}

                <p className="muted" style={{ margin: 0, fontSize: '0.92rem', flex: 1 }}>{m.bio}</p>

                {sentTo === m.id ? (
                  <Alert type="success">Request sent! {m.name.split(' ')[0]} will reach out soon.</Alert>
                ) : openId === m.id ? (
                  <form className="col" style={{ gap: 8 }} onSubmit={(e) => submit(e, m.id)}>
                    <input
                      className="input"
                      placeholder="Topic (e.g. scaling my shop)"
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      required
                    />
                    <textarea
                      className="textarea"
                      style={{ minHeight: 70 }}
                      placeholder="A short message…"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                    <div className="row" style={{ gap: 8 }}>
                      <button className="btn btn-primary btn-sm" disabled={sending}>
                        {sending ? 'Sending…' : 'Send request'}
                      </button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpenId(null)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button className="btn btn-outline btn-sm" onClick={() => toggle(m.id)}>
                    Request mentorship
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
