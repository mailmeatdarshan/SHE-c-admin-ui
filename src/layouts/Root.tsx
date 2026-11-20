import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { Outlet } from "react-router-dom"
import { self } from "@/http/api"
import { useAuthStore } from "@/store"
import { usePermission } from "@/hooks/usePermission"
import { FullScreenLoader } from "@/components/common/LoadingSpinner"

const getself = async () => {
  const { data } = await self()
  return data
}

const Root = () => {
    const { setUser } = useAuthStore()
    const { isAllowed } = usePermission()

    const { isLoading } = useQuery({
        queryKey: ['self'],
        queryFn: async () => {
            const userData = await getself()
            if (isAllowed(userData)) {
                setUser(userData)
            }
            return userData
        },
        retry: (failureCount: number, error) => {
            if (error instanceof AxiosError && error.response?.status === 401) {
                return false
            }
            return failureCount < 3
        },
    })

    if (isLoading) {
        return <FullScreenLoader />
    }

    return <Outlet />
}

export default Root