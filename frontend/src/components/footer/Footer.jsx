const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-surface mt-auto py-6">
            <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
                © {currentYear} E-Learning. Tutti i diritti riservati.
            </div>
        </footer>
  )
}

export default Footer
