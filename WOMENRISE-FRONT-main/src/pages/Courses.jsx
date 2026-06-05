import { useEffect, useState } from 'react'
import { coursesApi } from '../api/client'
import CourseCard from '../components/CourseCard'
import { Spinner, EmptyState, Alert } from '../components/ui'

const CATEGORIES = ['All', 'coding', 'yoga', 'fitness', 'business']

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [active, setActive] = useState('All')

  useEffect(() => {
    setLoading(true)
    setError('')
    coursesApi
      .list(active === 'All' ? undefined : active)
      .then(setCourses)
      .catch((err) => setError(err.response?.data?.detail || 'Failed to load courses.'))
      .finally(() => setLoading(false))
  }, [active])

  return (
    <div className="container page">
      {/* Page header */}
      <div className="center" style={{ maxWidth: 640, margin: '0 auto 40px' }}>
        <span className="eyebrow">Skill Up</span>
        <h2>Browse All Courses</h2>
        <p className="lead">
          Expert-led courses in coding, wellness, fitness, and business — designed to help
          you grow personally and professionally.
        </p>
      </div>

      {/* Category chips */}
      <div className="row wrap" style={{ justifyContent: 'center', gap: 10, marginBottom: 36 }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`chip${active === cat ? ' active' : ''}`}
            onClick={() => setActive(cat)}
            style={{ textTransform: cat === 'All' ? undefined : 'capitalize' }}
          >
            {cat === 'All' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <Alert type="error">{error}</Alert>

      {loading ? (
        <Spinner />
      ) : courses.length === 0 ? (
        <EmptyState icon="🎓" title="No courses found">
          Try a different category or check back soon.
        </EmptyState>
      ) : (
        <div className="grid grid-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
