import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store";
import { FullScreenLoader } from "@/components/common/LoadingSpinner";

const NonAuth = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (user !== null) {
    return <FullScreenLoader />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default NonAuth;