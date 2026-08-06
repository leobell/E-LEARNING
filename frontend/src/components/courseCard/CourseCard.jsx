import { Link } from "react-router-dom"
import StarRating from "../starRating/StarRating"


const CourseCard = ({ course }) => {
    return (
        <Link
            to={`/courses/${course._id}`}
            className="bg-surface rounded-lg shadow hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
        >
            <img 
                src={course.urlImg} 
                alt={course.name}
                className="w-full h-40 object-cover" 
            />
            <div className="p-4 flex flex-col flex-1">
                <p className="font-semibold text-primary-dark mb-1">{course.name}</p>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{course.description}</p>

                <div className="mt-auto pt-2">
                    {course.averageRating ? (
                        <div className="flex items-center gap-2 my-2">
                            <StarRating rating={Math.round(course.averageRating)} readOnly/>
                            <span className="text-xs text-gray-500">
                                {course.averageRating} ({course.reviewCount})
                            </span>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400 my-2">Nessuna recensione</p>
                    )}

                    {course.teacher && (
                        <p className="text-xs text-gray-400 mt-auto">
                            {course.teacher.firstName} {course.teacher.lastName}
                        </p>
                    )}
                </div>
                
            </div>
        </Link>
    )
}

export default CourseCard
