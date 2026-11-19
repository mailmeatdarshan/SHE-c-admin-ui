import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  X,
  Home,
  Store,
  ShoppingBag,
  Package,
  Users,
  BarChart2,
  Tag,
  Settings2,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { RiPaletteLine } from "@remixicon/react";
import { useAuthStore } from "@/store";

export interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
  dividerAfter?: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const getMenuItems = (role?: string): NavItem[] => {
  const isAdmin = role?.toLowerCase() === "admin";

  const items: NavItem[] = [
    { name: "Home", path: "/", icon: Home },
    { name: "Shop", path: "/shop", icon: Store },
    { name: "Orders", path: "/orders", icon: ShoppingBag },
    { name: "Products", path: "/products", icon: Package, dividerAfter: !isAdmin },
  ];

  if (isAdmin) {
    items.push({
      name: "Users",
      path: "/users",
      icon: Users,
      dividerAfter: true,
    });
  }

  items.push(
    { name: "Analytics", path: "/analytics", icon: BarChart2 },
    { name: "Promos", path: "/promos", icon: Tag },
    { name: "Settings", path: "/settings", icon: Settings2 }
  );

  return items;
};

// eslint-disable-next-line react-refresh/only-export-components
export const SIDEBAR_ITEMS: NavItem[] = getMenuItems("admin");

export const CustomSidebarIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="6" y1="5" x2="6" y2="19" />
    <line x1="12" y1="5" x2="12" y2="19" />
    <path d="M18 5v14l3-2.5V7.5z" />
  </svg>
);

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};

interface SidebarItemProps {
  item: NavItem;
  isActive: boolean;
  isHovered: boolean;
  setHoveredPath: (path: string | null) => void;
  navigate: ReturnType<typeof useNavigate>;
  isMobile: boolean;
  onClose: () => void;
}

const SidebarItem = React.memo(
  ({
    item,
    isActive,
    isHovered,
    setHoveredPath,
    navigate,
    isMobile,
    onClose,
  }: SidebarItemProps) => {
    const Icon = item.icon;
    return (
      <div
        style={{
          padding: isMobile ? "6px 12px" : "0",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          type="button"
          onClick={() => {
            navigate(item.path);
            onClose();
          }}
          onMouseEnter={() => setHoveredPath(item.path)}
          title={isMobile ? item.name : undefined}
          style={{
            position: "relative",
            width: isMobile ? "48px" : "calc(100% - 32px)",
            height: isMobile ? "48px" : "auto",
            padding: isMobile ? "0" : "12px 20px",
            borderRadius: 12,
            display: "flex",
            justifyContent: isMobile ? "center" : "flex-start",
            alignItems: "center",
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s ease",
            border: "none",
            outline: "none",
            backgroundColor: isActive
              ? "#FFF7ED"
              : isHovered
                ? "rgba(249, 115, 22, 0.08)"
                : "transparent",
            color: isActive ? "#EA580C" : isHovered ? "#0F172A" : "#64748B",
            margin: isMobile ? "0" : "2px 16px",
          }}
          className="group"
        >
          {isActive && (
            <motion.div
              layoutId={
                isMobile ? "mobile-active-indicator" : "active-indicator"
              }
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              style={{
                position: "absolute",
                left: isMobile ? "50%" : 0,
                bottom: isMobile ? -6 : 6,
                top: isMobile ? "auto" : 6,
                transform: isMobile ? "translateX(-50%)" : "none",
                width: isMobile ? 5 : 3.5,
                height: isMobile ? 5 : "auto",
                borderRadius: isMobile ? "50%" : "0 4px 4px 0",
                backgroundColor: "#F97316",
                boxShadow: "0 0 10px rgba(249, 115, 22, 0.55)",
                zIndex: 10,
              }}
            />
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              position: "relative",
              zIndex: 10,
            }}
          >
            <Icon
              size={isMobile ? 21 : 18}
              className={`transition-transform duration-300 ${
                isActive || isHovered ? "scale-110" : ""
              }`}
              style={{
                color: isActive ? "#EA580C" : undefined,
              }}
            />
            {!isMobile && <span>{item.name}</span>}
          </div>
        </button>
      </div>
    );
  }
);

SidebarItem.displayName = "SidebarItem";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
  isLoggingOut?: boolean;
  role?: string;
}

const Sidebar = ({
  isOpen,
  setIsOpen,
  onLogout,
  isLoggingOut,
  role: propRole,
}: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const { user } = useAuthStore();
  const role = propRole ?? user?.role;
  const menuItems = useMemo(() => getMenuItems(role), [role]);

  const activePath =
    menuItems.find((item) =>
      item.path === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(item.path)
    )?.path ?? "/";

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isMobile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, setIsOpen]);

  const sidebarWidth = isMobile ? 80 : 280;

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          backgroundColor: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(3px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Slide-out Sidebar Drawer (Parkin-son motion & Orange/White styling) */}
      <aside
        ref={sidebarRef}
        onMouseLeave={() => {
          setHoveredPath(null);
          if (!isMobile) setIsOpen(false);
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: sidebarWidth,
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E2E8F0",
          zIndex: 50,
          padding: isMobile ? "24px 0" : 24,
          display: "flex",
          flexDirection: "column",
          alignItems: isMobile ? "center" : "stretch",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          boxShadow: isOpen ? "4px 0 32px rgba(15, 23, 42, 0.08)" : "none",
          overflowY: "auto",
        }}
        aria-label="Main Navigation"
      >
        {/* Drawer Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "center" : "space-between",
            marginTop: 4,
            marginBottom: 28,
            width: "100%",
            padding: isMobile ? "0 12px" : 0,
          }}
        >
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 10px rgba(249, 115, 22, 0.35)",
                }}
              >
                <RiPaletteLine size={18} />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    color: "#0F172A",
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    lineHeight: 1.1,
                  }}
                >
                  SHRI HARI
                </span>
                <span
                  style={{
                    color: "#EA580C",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginTop: 2,
                  }}
                >
                  Admin Console
                </span>
              </div>
            </div>
          )}

          {isMobile ? (
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                padding: 8,
                color: "#64748B",
                cursor: "pointer",
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "50%",
              }}
              className="hover:text-slate-900 hover:bg-slate-100 transition-all"
              aria-label="Close Navigation"
            >
              <X size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                padding: 8,
                color: "#64748B",
                cursor: "pointer",
                background: "none",
                border: "none",
                borderRadius: 8,
              }}
              className="hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Close Navigation"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            position: "relative",
            margin: isMobile ? "0" : "0 -24px",
            alignItems: isMobile ? "center" : "stretch",
            gap: isMobile ? 6 : 0,
          }}
          onMouseLeave={() => setHoveredPath(null)}
        >
          {menuItems.map((item) => {
            const isActive = item.path === activePath;
            const isHovered =
              hoveredPath !== null ? item.path === hoveredPath : false;
            return (
              <React.Fragment key={item.name}>
                <SidebarItem
                  item={item}
                  isActive={isActive}
                  isHovered={isHovered}
                  setHoveredPath={setHoveredPath}
                  navigate={navigate}
                  isMobile={isMobile}
                  onClose={() => setIsOpen(false)}
                />
                {item.dividerAfter && (
                  <div
                    style={{
                      padding: isMobile ? "0" : "0 24px",
                      margin: "10px 0",
                      width: isMobile ? "32px" : "auto",
                    }}
                  >
                    <hr
                      style={{
                        border: "none",
                        borderTop: "1.5px solid #F1F5F9",
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Bottom Logout Action */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: 16,
            borderTop: "1px solid #F1F5F9",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            title={isMobile ? "Logout" : undefined}
            style={{
              width: isMobile ? "48px" : "100%",
              height: isMobile ? "48px" : "auto",
              padding: isMobile ? "0" : "11px 16px",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: isMobile ? "center" : "flex-start",
              gap: 12,
              fontSize: 14,
              fontWeight: 500,
              cursor: isLoggingOut ? "not-allowed" : "pointer",
              border: "none",
              backgroundColor: "transparent",
              color: "#DC2626",
              transition: "all 0.2s ease",
              opacity: isLoggingOut ? 0.6 : 1,
            }}
            className="hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={18} />
            {!isMobile && <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default React.memo(Sidebar);
