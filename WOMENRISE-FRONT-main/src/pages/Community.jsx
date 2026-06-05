import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { communityApi } from '../api/client'
import { Spinner, Avatar, Badge, EmptyState, Alert } from '../components/ui'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'general', label: 'General' },
  { value: 'wins', label: 'Wins 🎉' },
  { value: 'questions', label: 'Questions' },
  { value: 'collab', label: 'Collab' },
]

const BADGE_MAP = {
  general: '',
  wins: 'teal',
  questions: 'amber',
  collab: 'rose',
}

function relativeDate(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

function RoleBadge({ role }) {
  const variantMap = { mentor: 'teal', seller: 'rose', learner: 'amber' }
  return <Badge variant={variantMap[role] || ''}>{role}</Badge>
}

export default function Community() {
  const { user } = useAuth()
  const [category, setCategory] = useState('')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Composer state
  const [composerTitle, setComposerTitle] = useState('')
  const [composerBody, setComposerBody] = useState('')
  const [composerCat, setComposerCat] = useState('general')
  const [composerError, setComposerError] = useState('')
  const [composerLoading, setComposerLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError('')
    communityApi
      .posts(category)
      .then(setPosts)
      .catch(() => setError('Failed to load posts.'))
      .finally(() => setLoading(false))
  }, [category])

  async function handleLike(postId) {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    )
    try {
      await communityApi.like(postId)
    } catch {
      // revert on failure
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes: p.likes - 1 } : p))
      )
    }
  }

  async function handleCompose(e) {
    e.preventDefault()
    setComposerError('')
    setComposerLoading(true)
    try {
      const newPost = await communityApi.createPost({
        title: composerTitle,
        body: composerBody,
        category: composerCat,
      })
      setPosts((prev) => [newPost, ...prev])
      setComposerTitle('')
      setComposerBody('')
      setComposerCat('general')
    } catch (err) {
      setComposerError(err.response?.data?.detail || 'Failed to post. Try again.')
    } finally {
      setComposerLoading(false)
    }
  }

  return (
    <div className="container page">
      {/* Page header */}
      <div style={{ marginBottom: 36 }}>
        <span className="eyebrow">Community</span>
        <h1 style={{ marginBottom: 8 }}>The WomenRise Community</h1>
        <p className="lead" style={{ margin: 0 }}>
          Share wins, ask questions, find collaborators — build together.
        </p>
      </div>

      {/* Category chips */}
      <div className="row wrap" style={{ marginBottom: 28, gap: 10 }}>
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            className={`chip${category === c.value ? ' active' : ''}`}
            onClick={() => setCategory(c.value)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Composer card — only for logged-in users */}
      {user && (
        <div className="card" style={{ marginBottom: 28 }}>
          <div className="card-body">
            <div className="row" style={{ marginBottom: 12, alignItems: 'center', gap: 10 }}>
              <Avatar name={user.name} src={user.avatar_url} size={36} />
              <span style={{ fontWeight: 600 }}>Share something with the community</span>
            </div>
            <Alert type="error">{composerError}</Alert>
            <form onSubmit={handleCompose}>
              <div className="field">
                <input
                  className="input"
                  placeholder="Post title…"
                  value={composerTitle}
                  onChange={(e) => setComposerTitle(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <textarea
                  className="textarea"
                  placeholder="What's on your mind? Share a win, ask a question, or find collaborators…"
                  value={composerBody}
                  onChange={(e) => setComposerBody(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="row between">
                <select
                  className="select"
                  style={{ maxWidth: 180 }}
                  value={composerCat}
                  onChange={(e) => setComposerCat(e.target.value)}
                >
                  {CATEGORIES.filter((c) => c.value).map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={composerLoading}
                >
                  {composerLoading ? 'Posting…' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Error */}
      {error && <Alert type="error">{error}</Alert>}

      {/* Feed */}
      {loading ? (
        <Spinner />
      ) : posts.length === 0 ? (
        <EmptyState icon="💬" title="No posts yet">
          Be the first to share something with the community!
        </EmptyState>
      ) : (
        <div className="col" style={{ gap: 16 }}>
          {posts.map((post) => (
            <div key={post.id} className="card card-hover">
              <div className="card-body">
                {/* Author row */}
                <div className="row between wrap" style={{ marginBottom: 10, alignItems: 'flex-start' }}>
                  <div className="row" style={{ gap: 10 }}>
                    <Avatar name={post.author.name} src={post.author.avatar_url} size={38} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', lineHeight: 1.3 }}>
                        {post.author.name}
                      </div>
                      <RoleBadge role={post.author.role} />
                    </div>
                  </div>
                  <div className="row" style={{ gap: 8 }}>
                    <Badge variant={BADGE_MAP[post.category] || ''}>{post.category}</Badge>
                    <span className="soft" style={{ fontSize: '0.82rem' }}>{relativeDate(post.created_at)}</span>
                  </div>
                </div>

                {/* Content */}
                <Link to={`/community/${post.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  <h3 style={{ marginBottom: 6, fontSize: '1.1rem' }}>{post.title}</h3>
                  {post.body && (
                    <p className="muted" style={{ margin: '0 0 12px', fontSize: '0.93rem', lineHeight: 1.6 }}>
                      {post.body.length > 200 ? post.body.slice(0, 200) + '…' : post.body}
                    </p>
                  )}
                </Link>

                {/* Actions */}
                <div className="row" style={{ gap: 16, marginTop: 4 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleLike(post.id)}
                    style={{ padding: '4px 10px', gap: 6 }}
                  >
                    <span>❤️</span>
                    <span>{post.likes}</span>
                  </button>
                  <Link
                    to={`/community/${post.id}`}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '4px 10px', gap: 6, color: 'var(--text-muted)' }}
                  >
                    <span>💬</span>
                    <span>{post.comment_count} {post.comment_count === 1 ? 'comment' : 'comments'}</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
