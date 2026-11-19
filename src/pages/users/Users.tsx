import React, { useState, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users as UsersIcon,
  UserPlus,
  Search,
  RefreshCw,
  ShieldCheck,
  Briefcase,
  Store,
  Copy,
  Check,
  X,
  AlertCircle,
  Mail,
  User as UserIcon,
  Lock,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import { getUsers, createUser } from "@/http/api";
import type { User, CreateUserData } from "@/types";
import { useAuthStore } from "@/store";

// Fallback demo users for demonstration if backend is starting or offline
const DEMO_FALLBACK_USERS: User[] = [
  {
    id: 1,
    firstname: "Darshan",
    lastname: "Dubey",
    email: "darshan@shepaints.com",
    role: "admin",
    createdAt: "2026-01-15T09:30:00Z",
  },
  {
    id: 2,
    firstname: "Vikram",
    lastname: "Sharma",
    email: "vikram.sharma@delhibranch.she.space",
    role: "manager",
    createdAt: "2026-02-10T11:20:00Z",
  },
  {
    id: 3,
    firstname: "Rajesh",
    lastname: "Agarwal",
    email: "rajesh.paints@jaipurdealers.in",
    role: "customer",
    createdAt: "2026-02-18T14:45:00Z",
  },
  {
    id: 4,
    firstname: "Neha",
    lastname: "Verma",
    email: "neha.verma@mumbaibranch.she.space",
    role: "manager",
    createdAt: "2026-03-01T16:10:00Z",
  },
  {
    id: 5,
    firstname: "Amit",
    lastname: "Patel",
    email: "amit.coatings@gujaratdealers.in",
    role: "customer",
    createdAt: "2026-03-12T10:05:00Z",
  },
  {
    id: 6,
    firstname: "Pooja",
    lastname: "Iyer",
    email: "pooja.iyer@shepaints.com",
    role: "admin",
    createdAt: "2026-03-20T12:00:00Z",
  },
];

const Users = () => {
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();

  // Queries
  const {
    data: fetchedUsers,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await getUsers();
      return res.data;
    },
    enabled: currentUser?.role?.toLowerCase() === "admin",
    retry: 1,
  });

  // State
  const [useDemoFallback, setUseDemoFallback] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [copiedEmailId, setCopiedEmailId] = useState<number | string | null>(null);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateUserData>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "manager",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Create User Mutation
  const createMutation = useMutation({
    mutationFn: (newUserData: CreateUserData) => createUser(newUserData),
    onSuccess: () => {
      setFormSuccess("User created successfully!");
      setFormError(null);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setTimeout(() => {
        setIsAddModalOpen(false);
        setFormSuccess(null);
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          role: "manager",
        });
      }, 1200);
    },
    onError: (err: unknown) => {
      const axiosError = err as {
        response?: { data?: { errors?: Array<{ msg: string }>; message?: string } };
        message?: string;
      };
      const message =
        axiosError.response?.data?.errors?.[0]?.msg ||
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to create user";
      setFormError(message);
      setFormSuccess(null);
    },
  });

  // Normalize Users List
  const usersList: User[] = useMemo(() => {
    if (useDemoFallback) return DEMO_FALLBACK_USERS;

    if (Array.isArray(fetchedUsers)) {
      return fetchedUsers;
    }

    const maybeObj = fetchedUsers as Record<string, unknown> | undefined;
    if (maybeObj) {
      if (Array.isArray(maybeObj.users)) return maybeObj.users as User[];
      if (Array.isArray(maybeObj.data)) return maybeObj.data as User[];
    }

    return [];
  }, [fetchedUsers, useDemoFallback]);

  // Statistics
  const totalCount = usersList.length;
  const adminCount = usersList.filter(
    (u) => u.role?.toLowerCase() === "admin"
  ).length;
  const managerCount = usersList.filter(
    (u) => u.role?.toLowerCase() === "manager"
  ).length;
  const customerCount = usersList.filter(
    (u) =>
      u.role?.toLowerCase() === "customer" ||
      u.role?.toLowerCase() === "dealer"
  ).length;

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return usersList.filter((user) => {
      const matchesSearch =
        !searchQuery ||
        `${user.firstname} ${user.lastname}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(user.id).includes(searchQuery);

      const matchesRole =
        selectedRole === "all" ||
        user.role?.toLowerCase() === selectedRole.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [usersList, searchQuery, selectedRole]);

  // Copy email helper
  const handleCopyEmail = (email: string, id: number | string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmailId(id);
    setTimeout(() => setCopiedEmailId(null), 2000);
  };

  // Form submit helper
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.firstname.trim()) {
      setFormError("First name is required.");
      return;
    }
    if (!formData.lastname.trim()) {
      setFormError("Last name is required.");
      return;
    }
    if (!formData.email.trim()) {
      setFormError("Email is required.");
      return;
    }
    if (!formData.password || formData.password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }

    createMutation.mutate(formData);
  };

  // Route & Role Protection: Only admins can view the users page
  if (currentUser && currentUser.role?.toLowerCase() !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              User Management
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              {totalCount} Users
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage administrative credentials, regional branch managers, and paint dealer access.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/80 bg-white text-xs font-semibold text-foreground hover:bg-muted/50 transition-colors cursor-pointer disabled:opacity-60"
            title="Refresh Users"
          >
            <RefreshCw
              className={`size-3.5 text-muted-foreground ${
                isFetching ? "animate-spin text-primary" : ""
              }`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFormError(null);
              setFormSuccess(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <UserPlus className="size-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Backend Connection Warning Banner (if error or empty) */}
      {isError && !useDemoFallback && (
        <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/70 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-amber-950">
                Unable to load users from backend API
              </p>
              <p className="text-amber-800/90 mt-0.5">
                {(error as Error)?.message || "Network error on http://localhost:5001/users"}. Make sure the Auth Service is running.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => refetch()}
              className="px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-xs font-semibold text-amber-950 hover:bg-amber-100/50 cursor-pointer"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => setUseDemoFallback(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 cursor-pointer"
            >
              View Sample Demo Users
            </button>
          </div>
        </div>
      )}

      {/* Demo Mode Notice */}
      {useDemoFallback && (
        <div className="px-4 py-2.5 rounded-xl border border-primary/20 bg-primary/5 text-primary text-xs flex items-center justify-between">
          <span className="font-medium">
            Currently previewing sample demo team members.
          </span>
          <button
            type="button"
            onClick={() => {
              setUseDemoFallback(false);
              refetch();
            }}
            className="underline font-semibold hover:text-primary/80 cursor-pointer"
          >
            Switch to Live API
          </button>
        </div>
      )}

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Users */}
        <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-sm hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Total Staff &amp; Dealers
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UsersIcon className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {totalCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Registered SHE platform accounts
          </p>
        </div>

        {/* Administrators */}
        <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-sm hover:border-orange-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Administrators
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
              <ShieldCheck className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {adminCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Full root configuration privileges
          </p>
        </div>

        {/* Branch Managers */}
        <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-sm hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Branch Managers
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <Briefcase className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {managerCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Regional stock &amp; order managers
          </p>
        </div>

        {/* Dealers & Customers */}
        <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Dealers / Customers
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <Store className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {customerCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Verified distributors &amp; clients
          </p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl border border-border/80 bg-white shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-muted/10">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or user ID..."
              className="w-full h-9 pl-9 pr-8 rounded-xl bg-white border border-border/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                title="Clear Search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-[11px] font-semibold text-muted-foreground mr-1 hidden sm:inline flex items-center gap-1">
              <SlidersHorizontal className="size-3" />
              Role:
            </span>
            {[
              { id: "all", label: "All Roles", count: totalCount },
              { id: "admin", label: "Admins", count: adminCount },
              { id: "manager", label: "Managers", count: managerCount },
              { id: "customer", label: "Dealers", count: customerCount },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedRole(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedRole === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    selectedRole === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-border text-muted-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <div className="h-4 w-32 bg-muted/60 rounded animate-pulse" />
              <div className="h-4 w-20 bg-muted/60 rounded animate-pulse" />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border/50 gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-muted/60 animate-pulse shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-36 bg-muted/60 rounded animate-pulse" />
                    <div className="h-2.5 w-24 bg-muted/40 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-3 w-48 bg-muted/40 rounded animate-pulse hidden md:block" />
                <div className="h-6 w-20 bg-muted/60 rounded-full animate-pulse" />
                <div className="h-6 w-16 bg-muted/60 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* Table Content */}
        {!isLoading && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-muted/20 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">User</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Created</th>
                  <th className="py-3.5 px-4 text-right sm:pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <UsersIcon className="size-8 text-muted-foreground/40" />
                        <p className="font-semibold text-foreground text-sm">
                          No users found
                        </p>
                        <p className="text-xs text-muted-foreground max-w-sm">
                          {searchQuery
                            ? `No users match the search "${searchQuery}". Try modifying your query or role filter.`
                            : "No user accounts have been registered yet."}
                        </p>
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery("");
                              setSelectedRole("all");
                            }}
                            className="mt-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const initials =
                      `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`.toUpperCase() ||
                      user.email?.[0]?.toUpperCase() ||
                      "U";
                    const role = user.role?.toLowerCase() || "customer";

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        {/* User Identity Column */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-white font-bold text-xs shadow-sm ${
                                role === "admin"
                                  ? "bg-gradient-to-br from-orange-500 to-amber-600 shadow-orange-500/20"
                                  : role === "manager"
                                  ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/20"
                                  : "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20"
                              }`}
                            >
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground text-sm truncate">
                                  {user.firstname} {user.lastname}
                                </span>
                              </div>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                #USR-{user.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Email Column */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 group/email">
                            <span className="text-muted-foreground truncate max-w-[200px] lg:max-w-[260px]">
                              {user.email}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyEmail(user.email, user.id)}
                              className="size-6 inline-flex items-center justify-center rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/80 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              title="Copy email address"
                            >
                              {copiedEmailId === user.id ? (
                                <Check className="size-3 text-emerald-600" />
                              ) : (
                                <Copy className="size-3" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Role Badge Column */}
                        <td className="py-3.5 px-4">
                          {role === "admin" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-500/10 text-orange-600 border border-orange-500/20">
                              <ShieldCheck className="size-3" />
                              Admin
                            </span>
                          )}
                          {role === "manager" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                              <Briefcase className="size-3" />
                              Manager
                            </span>
                          )}
                          {role !== "admin" && role !== "manager" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              <Store className="size-3" />
                              Dealer
                            </span>
                          )}
                        </td>

                        {/* Status Column */}
                        <td className="py-3.5 px-4">
                          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Active</span>
                          </div>
                        </td>

                        {/* Created At Column */}
                        <td className="py-3.5 px-4 hidden lg:table-cell text-muted-foreground text-[11px]">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "Standard Account"}
                        </td>

                        {/* Actions Column */}
                        <td className="py-3.5 px-4 text-right sm:pr-6">
                          <button
                            type="button"
                            onClick={() => handleCopyEmail(user.email, user.id)}
                            className="px-2.5 py-1 rounded-lg border border-border/80 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                          >
                            {copiedEmailId === user.id ? "Copied" : "Copy Email"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        <div className="px-4 py-3 border-t border-border/80 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredUsers.length}</strong> of{" "}
            <strong className="text-foreground">{totalCount}</strong> users
          </span>
          <span className="text-[11px]">
            Connected to SHE Auth Microservice
          </span>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl bg-white border border-border shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserPlus className="size-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Create New User
                </h2>
                <p className="text-xs text-muted-foreground">
                  Provision login credentials on Auth Service.
                </p>
              </div>
            </div>

            {/* Form Error Banner */}
            {formError && (
              <div className="mt-4 p-3 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs flex items-start gap-2">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form Success Banner */}
            {formSuccess && (
              <div className="mt-4 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            {/* Form Inputs */}
            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <UserIcon className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh"
                      value={formData.firstname}
                      onChange={(e) =>
                        setFormData({ ...formData, firstname: e.target.value })
                      }
                      className="w-full h-9 pl-9 pr-3 rounded-xl border border-border/80 bg-white text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Patel"
                    value={formData.lastname}
                    onChange={(e) =>
                      setFormData({ ...formData, lastname: e.target.value })
                    }
                    className="w-full h-9 px-3 rounded-xl border border-border/80 bg-white text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. ramesh.patel@shepaints.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-border/80 bg-white text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Password (min 8 characters)
                </label>
                <div className="relative">
                  <Lock className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-border/80 bg-white text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Role Assignment
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full h-9 px-3 rounded-xl border border-border/80 bg-white text-xs text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 cursor-pointer"
                >
                  <option value="manager">Branch Manager (Regional Operations)</option>
                  <option value="admin">Administrator (Full Access)</option>
                  <option value="customer">Dealer / Customer (Orders &amp; Stock)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border/80 text-xs font-semibold text-muted-foreground hover:bg-muted/50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 cursor-pointer disabled:opacity-60"
                >
                  {createMutation.isPending ? "Creating..." : "Save User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
