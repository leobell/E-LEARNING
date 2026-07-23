import { useNavigate } from "react-router-dom"
import heroImage from "../../assets/hero-workplace.png"

const Hero = () => {
    const navigate = useNavigate()

    return (
    <div
        className="relative bg-cover bg-center py-24 px-4"
        style={{ backgroundImage: `url(${heroImage})` }}
    >
        <div className="max-w-6xl mx-auto">
            <div className="max-w-md">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    Impara nuove competenze, quando vuoi.
                </h1>
                <p className="text-gray-200 text-lg mb-6">
                    Scopri nuovi corsi e inizia il tuo percorso di apprendimento oggi stesso.
                </p>
                <button
                    onClick={() => navigate('/search')}
                    className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors"
                >
                    Esplora corsi
                </button>
            </div>
        </div>
    </div>
  )
}

export default Hero
