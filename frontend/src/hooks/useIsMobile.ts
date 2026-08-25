import { useEffect, useState } from "react"

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const mql = window.matchMedia("(max-width: 768px)")

        setIsMobile(mql.matches)

        const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
        mql.addEventListener("change", handleChange)

        return () => mql.removeEventListener("change", handleChange)
    }, [])

    return isMobile
}

export default useIsMobile
