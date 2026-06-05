import { Link } from 'react-router-dom'
import { Badge, Stars, money } from './ui'

const CAT_VARIANT = { coding: '', yoga: 'teal', fitness: 'rose', business: 'amber' }

/** Course summary card for grid listings. */
export default function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course.id}`} className="card card-hover" style={{ color: 'inherit' }}>
      <img className="card-img" src={course.image_url} alt={course.title} loading="lazy" />
      <div className="card-body">
        <div className="row between" style={{ marginBottom: 10 }}>
          <Badge variant={CAT_VARIANT[course.category] ?? ''}>{course.category}</Badge>
          <span className="soft" style={{ fontSize: '0.82rem' }}>{course.level}</span>
        </div>
        <h3 style={{ fontSize: '1.15rem', marginBottom: 6 }}>{course.title}</h3>
        <p className="muted" style={{ fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {course.description}
        </p>
        <p className="soft" style={{ fontSize: '0.85rem', margin: '8px 0' }}>
          by {course.instructor_name} · {course.lessons_count} lessons · {course.duration_hours}h
        </p>
        <div className="row between">
          <Stars value={course.rating} />
          <span className="price">{course.price === 0 ? 'Free' : money(course.price)}</span>
        </div>
      </div>
    </Link>
  )
}
