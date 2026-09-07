import { SearchedProfile } from "@/types"

const RECENT_SEARCHES_KEY = "recentSearches"

export const getRecentSearches = (): SearchedProfile[] => {
    try {
        const raw = localStorage.getItem(RECENT_SEARCHES_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

const setRecentSearches = (profiles: SearchedProfile[]) => {
    try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(profiles))
    } catch (error) {
        console.error(error)
    }
}

export const addRecentSearch = (profile: SearchedProfile) => {
    const existing = getRecentSearches().filter((p) => p.id !== profile.id)
    const updated = [profile, ...existing].slice(0, 5)
    setRecentSearches(updated)
    return updated
}

export const removeRecentSearch = (id: number) => {
    const updated = getRecentSearches().filter((p) => p.id !== id)
    setRecentSearches(updated)
    return updated
}

export const clearRecentSearches = () => {
    setRecentSearches([])
}
