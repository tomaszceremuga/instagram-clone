import { api } from "@/lib/api";
import { useEffect, useState } from "react";

type User = {
    id: number;
    username: string;
    email: string;
};

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get("/me");
                setUser(res.data);
            } catch (err) {
                console.error({ error: "couldn't authorise" });
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    return { user, isLoading };
};
