import { useEffect } from "react"

const usePageTitle = (title) => {
    useEffect(() => {
        const previousTitle = document.title
        document.title = title ? `${title} | E-Learning` : 'E-Learning'

        return () => {
            document.title = previousTitle
        }
    }, [title])
}

export default usePageTitle
