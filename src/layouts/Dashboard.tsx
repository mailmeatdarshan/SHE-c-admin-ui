import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import { logout } from "@/http/api";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { FullScreenLoader } from "@/components/common/LoadingSpinner";

const Dashboard = () => {
  const { user, logout: logoutFromStore } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { mutate: logoutMutate, isPending: isLoggingOut } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: () => {
      logoutFromStore();
      queryClient.removeQueries({ queryKey: ["self"] });
    },
    onError: () => {
      logoutFromStore();
      queryClient.removeQueries({ queryKey: ["self"] });
    },
  });

  useEffect(() => {
    if (user === null && !isLoggingOut) {
      navigate("/auth/login", { replace: true });
    }
  }, [user, isLoggingOut, navigate]);

  if (isLoggingOut || user === null) {
    return <FullScreenLoader />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground font-sans antialiased">
      {/* Slide-out Sidebar (shared across all dashboard screens) */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onLogout={() => logoutMutate()}
        isLoggingOut={isLoggingOut}
        role={user.role}
      />

      {/* Sticky Topbar (shared across all dashboard screens) */}
      <Topbar
        user={user}
        isSidebarOpen={isSidebarOpen}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onLogout={() => logoutMutate()}
        isLoggingOut={isLoggingOut}
      />

      {/* Main Content Area — changes per route via React Router Outlet */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
