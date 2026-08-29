import { api } from "@/lib/api"
import { MiniProfile } from "@/types"

const cache = new Map<string, MiniProfile>()

export const getMiniProfile = async (username: string): Promise<MiniProfile> => {
    const cached = cache.get(username)
    if (cached) {
        return cached
    }

    const res = await api.get(`/mini-profile/${username}`)
    cache.set(username, res.data)
    return res.data
}
