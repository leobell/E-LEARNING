import { Link } from "react-router-dom"


const CourseCard = ({ course }) => {
  return (
    <Link
        to={`/courses/${course._id}`}
        className="bg-surface rounded-lg shadow hover:shadow-lg transition overflow-hidden block"
    >
        <img 
            src={course.urlImg} 
            alt={course.name}
            className="w-full h-40 object-cover" 
        />
        <div className="p-4">
            <p className="font-semibold text-primary-dark mb-1">{course.name}</p>
            <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
            {course.teacher && (
                <p className="text-xs text-gray-400 mt-2">
                    {course.teacher.firstName} {course.teacher.lastName}
                </p>
            )}
        </div>
    </Link>
  )
}

export default CourseCard
