import { Clock, GraduationCap, ShieldCheck } from 'lucide-react'

const features = [
    {
        icon: Clock,
        title:'Impara a tuo ritmo',
        description:'Segui i corsi quando vuoi, riprendi da dove hai lasciato grazie al tracciamento dei tuoi progressi.'
    },
    {
        icon: GraduationCap,
        title:'Docenti qualificati',
        description:'Corsi strutturati in moduli e lezioni chiare, pensati per un apprendimento graduale ed efficace.'
    },
    {
        icon: ShieldCheck,
        title:'Accesso sicuro',
        description:'Il tuo account e i tuoi dati sono protetti con i più moderni standard di sicurezza.'
    }
]

const Features = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => {
            const Icon = feature.icon
            return (
                <div 
                    key={index}
                    className="bg-surface rounded-lg shadow p-6 border-t-4 border-primary"
                >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-primary-dark mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
            )
        })}
      </div>
    </div>
  )
}

export default Features
