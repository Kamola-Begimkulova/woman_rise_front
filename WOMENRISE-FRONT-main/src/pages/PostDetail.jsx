import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { communityApi } from '../api/client'
import { Spinner, Avatar, Badge, Alert } from '../components/ui'
import { useAuth } from '../context/AuthContext'

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

export default function PostDetail() {
  const { id } = useParams()
  const { user } = useAuth()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Comment composer
  const [commentBody, setCommentBody] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const [commentError, setCommentError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    communityApi
      .getPost(id)
      .then(setPost)
      .catch(() => setError('Could not load this post.'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleLike() {
    if (!post) return
    setPost((prev) => ({ ...prev, likes: prev.likes + 1 }))
    try {
      await communityApi.like(id)
    } catch {
      setPost((prev) => ({ ...prev, likes: prev.likes - 1 }))
    }
  }

  async function handleComment(e) {
    e.preventDefault()
    setCommentError('')
    setCommentLoading(true)
    try {
      const newComment = await communityApi.comment(id, commentBody)
      setPost((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
        comment_count: (prev.comment_count || 0) + 1,
      }))
      setCommentBody('')
    } catch (err) {
      setCommentError(err.response?.data?.detail || 'Failed to post comment.')
    } finally {
      setCommentLoading(false)
    }
  }

  if (loading) return <div className="container page"><Spinner /></div>
  if (error) return <div className="container page"><Alert type="error">{error}</Alert></div>
  if (!post) return null

  return (
    <div className="container page">
      {/* Back link */}
      <Link
        to="/community"
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: 24, paddingLeft: 0 }}
      >
        ← Back to Community
      </Link>

      {/* Post card */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-body" style={{ padding: '28px 32px' }}>
          {/* Author + meta row */}
          <div className="row between wrap" style={{ marginBottom: 18, alignItems: 'flex-start' }}>
            <div className="row" style={{ gap: 12 }}>
              <Avatar name={post.author.name} src={post.author.avatar_url} size={44} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{post.author.name}</div>
                <div className="row" style={{ gap: 6, marginTop: 3 }}>
                  <RoleBadge role={post.author.role} />
                  <span className="soft" style={{ fontSize: '0.82rem' }}>{relativeDate(post.created_at)}</span>
                </div>
              </div>
            </div>
            <Badge variant={BADGE_MAP[post.category] || ''}>{post.category}</Badge>
          </div>

          {/* Title + body */}
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 14 }}>{post.title}</h1>
          {post.body && (
            <p style={{ margin: '0 0 20px', lineHeight: 1.75, color: 'var(--text-muted)' }}>
              {post.body}
            </p>
          )}

          {/* Like button */}
          <div style={{ paddingTop: 8, borderTop: '1px solid var(--border)' }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={handleLike}
              style={{ gap: 8 }}
            >
              <span>❤️</span>
              <span>{post.likes} {post.likes === 1 ? 'like' : 'likes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments section */}
      <div>
        <h3 style={{ marginBottom: 20 }}>
          {(post.comments || []).length} {(post.comments || []).length === 1 ? 'Comment' : 'Comments'}
        </h3>

        {(post.comments || []).length === 0 && (
          <p className="muted" style={{ marginBottom: 24 }}>No comments yet. Be the first!</p>
        )}

        <div className="col" style={{ gap: 12, marginBottom: 28 }}>
          {(post.comments || []).map((comment) => (
            <div key={comment.id} className="card">
              <div className="card-body" style={{ padding: '16px 20px' }}>
                <div className="row" style={{ gap: 10, marginBottom: 8 }}>
                  <Avatar name={comment.author.name} src={comment.author.avatar_url} size={32} />
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{comment.author.name}</span>
                    <span className="soft" style={{ fontSize: '0.8rem', marginLeft: 8 }}>
                      {relativeDate(comment.created_at)}
                    </span>
                  </div>
                </div>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.6 }}>
                  {comment.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Comment composer */}
        {user ? (
          <div className="card">
            <div className="card-body">
              <div className="row" style={{ gap: 10, marginBottom: 12 }}>
                <Avatar name={user.name} src={user.avatar_url} size={36} />
                <span style={{ fontWeight: 600 }}>Add a comment</span>
              </div>
              <Alert type="error">{commentError}</Alert>
              <form onSubmit={handleComment}>
                <div className="field">
                  <textarea
                    className="textarea"
                    placeholder="Write your comment…"
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    rows={3}
                    required
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={commentLoading}
                  >
                    {commentLoading ? 'Posting…' : 'Post comment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-body center">
              <p className="muted" style={{ margin: '0 0 12px' }}>
                Sign in to join the conversation.
              </p>
              <Link to="/login" className="btn btn-primary btn-sm">Sign in</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
