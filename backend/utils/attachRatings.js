const Review = require('../modules/review/review.schema')

const attachRatings = async (courses) => {
    const courseIds = courses.map((c) => c._id)

    const ratings = await Review.aggregate([
        { $match: { course: { $in: courseIds } } },
        { $group: { _id: '$course', averageRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ])

    const ratingsMap = new Map(
        ratings.map((r) => [r._id.toString(), { averageRating: r.averageRating, count: r.count }])
    )

    return courses.map((course) => {
        const courseObj = course.toObject ? course.toObject() : course
        const rating = ratingsMap.get(course._id.toString())

        return {
            ...courseObj,
            averageRating: rating ? Number(rating.averageRating.toFixed(1)) : null,
            reviewCount: rating ? rating.count : 0
        }
    })
}

module.exports = attachRatings