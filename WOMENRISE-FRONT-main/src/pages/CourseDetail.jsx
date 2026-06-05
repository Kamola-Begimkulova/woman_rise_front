import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { coursesApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { Spinner, Stars, Avatar, Badge, Alert, money } from '../components/ui'

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [enrolling, setEnrolling] = useState(false)
  const [enrolled, setEnrolled] = useState(false)
  const [enrollError, setEnrollError] = useState('')

  useEffect(() => {
    setLoading(true)
    coursesApi
      .get(id)
      .then(setCourse)
      .catch((err) => {
        const status = err.response?.status
        setError(
          status === 404
            ? 'Course not found.'
            : err.response?.data?.detail || 'Failed to load course.'
        )
      })
      .finally(() => setLoading(false))
  }, [id])

  async function handleEnroll() {
    if (!user) {
      navigate('/login')
      return
    }
    setEnrolling(true)
    setEnrollError('')
    try {
      await coursesApi.enroll(id)
      setEnrolled(true)
    } catch (err) {
      setEnrollError(err.response?.data?.detail || 'Enrollment failed. Please try again.')
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) return <div className="container page"><Spinner /></div>

  if (error) {
    return (
      <div className="container page" style={{ maxWidth: 600, margin: '0 auto' }}>
        <Alert type="error">{error}</Alert>
        <Link to="/courses" className="btn btn-outline">← Back to Courses</Link>
      </div>
    )
  }

  if (!course) return null

  const isFree = course.price === 0

  return (
    <div className="container page">
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24 }}>
        <Link to="/courses" className="muted" style={{ fontSize: '0.9rem' }}>
          ← All Courses
        </Link>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start', gap: 40 }}>
        {/* Left column */}
        <div className="col">
          {/* Hero image */}
          <img
            src={course.image_url}
            alt={course.title}
            style={{
              width: '100%',
              aspectRatio: '16/10',
              objectFit: 'cover',
              borderRadius: 'var(--radius)',
              background: 'var(--gradient-soft)',
            }}
          />

          {/* Category + level */}
          <div className="row" style={{ gap: 8 }}>
            <Badge>{course.category}</Badge>
            <span className="soft" style={{ fontSize: '0.85rem' }}>{course.level}</span>
          </div>

          {/* Title */}
          <h2 style={{ margin: 0 }}>{course.title}</h2>

          {/* Rating row */}
          <div className="row" style={{ gap: 10 }}>
            <Stars value={course.rating} />
            <span className="soft" style={{ fontSize: '0.85rem' }}>
              {course.rating.toFixed(1)} · {course.students_count.toLocaleString()} students
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 style={{ marginBottom: 10 }}>About this course</h3>
            <p className="muted" style={{ lineHeight: 1.75 }}>{course.description}</p>
          </div>

          {/* What you'll learn */}
          <div className="card card-body" style={{ background: 'var(--surface-2)' }}>
            <h3 style={{ marginBottom: 12 }}>What you'll learn</h3>
            <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--text-muted)', lineHeight: 2 }}>
              <li>Expert-led instruction in {course.category}</li>
              <li>Practical skills you can apply immediately</li>
              <li>{course.lessons_count} structured lessons over {course.duration_hours}h</li>
              <li>Access to course materials at your own pace</li>
              <li>Community discussion and peer support</li>
            </ul>
          </div>

          {/* Instructor */}
          <div className="card card-body">
            <h3 style={{ marginBottom: 14 }}>Your Instructor</h3>
            <div className="row" style={{ gap: 14, alignItems: 'center' }}>
              <Avatar name={course.instructor_name} size={52} />
              <div>
                <div style={{ fontWeight: 700 }}>{course.instructor_name}</div>
                <div className="soft" style={{ fontSize: '0.85rem' }}>
                  Course Instructor · {course.category.charAt(0).toUpperCase() + course.category.slice(1)} Expert
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — sticky enrollment card */}
        <div
          className="card card-body col"
          style={{ position: 'sticky', top: 'calc(var(--nav-h) + 24px)', gap: 20 }}
        >
          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span
              className="stat-num gradient-text"
              style={{ fontSize: '2.2rem' }}
            >
              {isFree ? 'Free' : money(course.price)}
            </span>
          </div>

          {/* Quick stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
              padding: '16px 0',
            }}
          >
            {[
              ['📚', `${course.lessons_count} lessons`],
              ['⏱️', `${course.duration_hours}h total`],
              ['📊', course.level],
              ['⭐', `${course.rating.toFixed(1)} / 5.0`],
            ].map(([icon, label]) => (
              <div key={label} className="row" style={{ gap: 8, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Enrollment feedback */}
          {enrollError && <Alert type="error">{enrollError}</Alert>}
          {enrolled && (
            <Alert type="success">
              You're enrolled! 🎉 Ready to start learning?
            </Alert>
          )}

          {/* CTA button */}
          {enrolled ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg btn-block">
              Go to Dashboard →
            </Link>
          ) : (
            <button
              className="btn btn-primary btn-lg btn-block"
              onClick={handleEnroll}
              disabled={enrolling}
            >
              {enrolling ? 'Enrolling…' : isFree ? 'Enroll for Free' : `Enroll — ${money(course.price)}`}
            </button>
          )}

          {!user && (
            <p className="soft center" style={{ fontSize: '0.85rem', margin: 0 }}>
              <Link to="/login">Sign in</Link> to track your progress.
            </p>
          )}

          {/* Guarantee note */}
          <p className="soft center" style={{ fontSize: '0.82rem', margin: 0 }}>
            🔒 Secure enrollment · Learn at your own pace
          </p>
        </div>
      </div>
    </div>
  )
}
