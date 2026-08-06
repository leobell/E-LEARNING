import { Star } from 'lucide-react'

const StarRating = ({ rating, onChange, readOnly = false }) => {
    const stars = [1, 2, 3, 4, 5]
    return (
        <div className='flex gap-1'>
            {stars.map((star) => (
                <button
                    key={star}
                    type='button'
                    disabled={readOnly}
                    onClick={() => onChange && onChange(star)}
                    className={readOnly ? 'cursor-default' : 'cursor-pointer'}
                >
                    <Star
                        className={`w-5 h-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                </button>
            ))}
        </div>
    )
}

export default StarRating
