import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Settings,
  User as UserIcon,
  CheckCheck,
  Sparkles,
} from "lucide-react";
import { RiPaletteLine } from "@remixicon/react";
import type { User } from "@/types";
import { CustomSidebarIcon, SIDEBAR_ITEMS } from "./Sidebar";

interface NotificationItem {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  unread: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: "New dealer order #SHE-1048",
    subtitle: "Sharma Paints ordered 40L Opus Emerald",
    time: "4m ago",
    unread: true,
  },
  {
    id: 2,
    title: "Low inventory alert",
    subtitle: "Sun Amber (SHE-204) is below threshold",
    time: "32m ago",
    unread: true,
  },
  {
    id: 3,
    title: "Invoice settled",
    subtitle: "Patel Hardware paid ₹48,500",
    time: "2h ago",
    unread: false,
  },
];

interface TopbarProps {
  user: User;
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
  onLogout: () => void;
  isLoggingOut?: boolean;
}

const Topbar = ({
  user,
  isSidebarOpen,
  onOpenSidebar,
  onLogout,
  isLoggingOut,
}: TopbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const getBreadcrumbs = () => {
    const crumbs = [
      {
        label: "Dashboard",
        path: "/",
        isClickable: location.pathname !== "/",
      },
    ];

    if (location.pathname === "/") {
      crumbs.push({
        label: "Home",
        path: "/",
        isClickable: false,
      });
      return crumbs;
    }

    const segments = location.pathname.split("/").filter(Boolean);
    let accumulatedPath = "";

    segments.forEach((seg, index) => {
      accumulatedPath += `/${seg}`;
      const matchedItem = SIDEBAR_ITEMS.find(
        (item) => item.path === accumulatedPath
      );
      const label =
        matchedItem?.name ??
        seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
      const isLast = index === segments.length - 1;

      crumbs.push({
        label,
        path: accumulatedPath,
        isClickable: !isLast,
      });
    });

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const initials =
    `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`.toUpperCase() ||
    user.email?.[0]?.toUpperCase() ||
    "U";

  const fullName =
    [user.firstname, user.lastname].filter(Boolean).join(" ") || user.email;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-white/90 backdrop-blur-md border-b border-border/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Parkin-son Sidebar Trigger + Company Logo & Name */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onMouseEnter={onOpenSidebar}
          onClick={onOpenSidebar}
          aria-label="Open Navigation"
          style={{
            opacity: isSidebarOpen ? 0 : 1,
            pointerEvents: isSidebarOpen ? "none" : "auto",
          }}
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted/60 hover:bg-primary/10 hover:text-primary border border-border/80 text-muted-foreground transition-all duration-200 hover:scale-105 cursor-pointer"
        >
          <CustomSidebarIcon />
        </button>

        {/* Company Logo & Name */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 text-left cursor-pointer group min-w-0"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20 group-hover:scale-105 transition-transform">
            <RiPaletteLine className="size-5" />
          </div>
          <div className="hidden sm:block truncate">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm lg:text-base tracking-tight text-foreground leading-none">
                SHRI HARI ENTERPRISES
              </span>
              <span className="hidden xl:inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                Paints &amp; Colors
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium leading-tight mt-0.5">
              Admin Dashboard
            </p>
          </div>
        </button>

        {/* Breadcrumb Navigation: Dashboard / <Section> */}
        <nav
          aria-label="Breadcrumb"
          className="hidden sm:flex items-center gap-1.5 pl-3 ml-1 border-l border-border/80 text-xs"
        >
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <div key={crumb.path + idx} className="flex items-center gap-1.5">
                {idx > 0 && (
                  <span className="text-muted-foreground/40 font-normal select-none">
                    /
                  </span>
                )}
                {crumb.isClickable ? (
                  <button
                    type="button"
                    onClick={() => navigate(crumb.path)}
                    className="font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span
                    className={
                      isLast
                        ? "font-semibold text-foreground"
                        : "font-medium text-muted-foreground"
                    }
                  >
                    {crumb.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Right: Quick Search + Notification Bell + User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Bar */}
        <div className="relative hidden md:flex items-center">
          <Search className="size-4 text-muted-foreground absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders, shades, dealers..."
            className="h-9 w-52 lg:w-64 pl-9 pr-3 rounded-xl bg-muted/50 border border-border/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-white focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition-all"
          />
        </div>

        {/* Role Status Pill
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold capitalize">
          <Sparkles className="size-3" />
          <span>{user.role}</span>
        </div> */}

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setNotifOpen((prev) => !prev);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
            className="relative flex size-9 items-center justify-center rounded-xl border border-border/80 bg-white hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-border shadow-xl shadow-black/10 overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/80 bg-muted/20">
                <span className="text-xs font-bold text-foreground">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 cursor-pointer"
                  >
                    <CheckCheck className="size-3.5" />
                    Mark all read
                  </button>
                )}
              </div>
              <div className="divide-y divide-border/60 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`px-4 py-3 hover:bg-muted/40 transition-colors flex items-start gap-3 ${
                      item.unread ? "bg-primary/[0.03]" : ""
                    }`}
                  >
                    <span
                      className={`mt-1.5 size-2 rounded-full shrink-0 ${
                        item.unread ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {item.subtitle}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setProfileOpen((prev) => !prev);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-xl border border-border/80 bg-white hover:bg-muted/50 transition-colors cursor-pointer"
            aria-label="User menu"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white text-xs font-bold shadow-sm shadow-orange-500/20">
              {initials}
            </div>
            <div className="hidden md:block text-left leading-tight">
              <p className="text-xs font-semibold text-foreground max-w-32 truncate">
                {fullName}
              </p>
              <p className="text-[10px] text-muted-foreground max-w-32 truncate">
                {user.email}
              </p>
            </div>
            <ChevronDown
              className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-border shadow-xl shadow-black/10 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-border/80 bg-muted/20">
                <p className="text-xs font-bold text-foreground truncate">
                  {fullName}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
              <div className="p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/users");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                >
                  <UserIcon className="size-3.5 text-muted-foreground" />
                  Profile &amp; Team
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/settings");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                >
                  <Settings className="size-3.5 text-muted-foreground" />
                  Settings
                </button>
                <div className="my-1 border-t border-border/70" />
                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors cursor-pointer disabled:opacity-60"
                >
                  <LogOut className="size-3.5" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
