import { useAuthStore } from "@/store";
import { Navigate, Outlet } from "react-router-dom"

const NonAuth = () => {
    const {user} = useAuthStore();
    if(user !== null){
        return <Navigate to="/" replace={true} />
    }
    return (
    <div>
        <h1>NonAuth Component</h1>
        <Outlet />
    </div>
  )
}

export default NonAuth