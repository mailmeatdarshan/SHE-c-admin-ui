import { useState } from "react";
import {
  ShoppingBag,
  Store,
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  Eye,
  Filter,
  Download,
  Calendar,
} from "lucide-react";
import { useAuthStore } from "@/store";

interface OrderItem {
  id: string;
  dealer: string;
  city: string;
  products: string;
  liters: number;
  amount: number;
  status: "Completed" | "Processing" | "Dispatched" | "Pending";
  time: string;
}

const STATS = [
  {
    label: "Total Orders",
    value: "1,284",
    delta: "+12.4%",
    isPositive: true,
    subtext: "vs last month",
    icon: ShoppingBag,
  },
  {
    label: "Active Dealers",
    value: "86",
    delta: "+4 new",
    isPositive: true,
    subtext: "this week",
    icon: Store,
  },
  {
    label: "Shades in Stock",
    value: "1,240",
    delta: "98.2%",
    isPositive: true,
    subtext: "ready to dispatch",
    icon: Package,
  },
  {
    label: "Monthly Revenue",
    value: "₹18.42L",
    delta: "+9.1%",
    isPositive: true,
    subtext: "target ₹20L",
    icon: TrendingUp,
  },
];

const RECENT_ORDERS: OrderItem[] = [
  {
    id: "#SHE-2492",
    dealer: "Sharma Paints & Hardware",
    city: "Jaipur, RJ",
    products: "40L Opus Emerald Gloss + 20L Primer",
    liters: 60,
    amount: 18450,
    status: "Completed",
    time: "12m ago",
  },
  {
    id: "#SHE-2491",
    dealer: "Gupta Color Studio",
    city: "Kota, RJ",
    products: "100L WeatherShield Base White",
    liters: 100,
    amount: 42200,
    status: "Processing",
    time: "45m ago",
  },
  {
    id: "#SHE-2490",
    dealer: "Verma Home Decors",
    city: "Delhi, DL",
    products: "20L Primer + 15L Satin Glow",
    liters: 35,
    amount: 12800,
    status: "Dispatched",
    time: "2h ago",
  },
  {
    id: "#SHE-2489",
    dealer: "Rajesh Construction Hub",
    city: "Udaipur, RJ",
    products: "60L Base Coat White + Thinners",
    liters: 60,
    amount: 28900,
    status: "Completed",
    time: "4h ago",
  },
  {
    id: "#SHE-2488",
    dealer: "Modern Living Paints",
    city: "Ajmer, RJ",
    products: "15L Coral Bloom Matte Interior",
    liters: 15,
    amount: 8650,
    status: "Pending",
    time: "Yesterday",
  },
  {
    id: "#SHE-2487",
    dealer: "Balaji Builders & Paints",
    city: "Jodhpur, RJ",
    products: "80L Tuscan Ochre Exterior Acrylic",
    liters: 80,
    amount: 34100,
    status: "Completed",
    time: "Yesterday",
  },
];

const WEEKLY_SALES = [
  { day: "Mon", amount: 1.8, height: 45 },
  { day: "Tue", amount: 2.4, height: 60 },
  { day: "Wed", amount: 2.1, height: 52 },
  { day: "Thu", amount: 3.2, height: 80 },
  { day: "Fri", amount: 3.8, height: 95 },
  { day: "Sat", amount: 4.1, height: 100 },
  { day: "Sun", amount: 2.6, height: 65 },
];

const TOP_PRODUCTS = [
  {
    name: "Opus Emerald Gloss",
    code: "SHE-101",
    sales: "₹2.45L",
    volume: "480L",
    share: 82,
    color: "#EA580C",
  },
  {
    name: "Sun Amber WeatherShield",
    code: "SHE-204",
    sales: "₹1.88L",
    volume: "350L",
    share: 68,
    color: "#F59E0B",
  },
  {
    name: "WeatherShield Base White",
    code: "SHE-002",
    sales: "₹1.42L",
    volume: "310L",
    share: 55,
    color: "#0284C7",
  },
  {
    name: "Coral Bloom Matte Interior",
    code: "SHE-308",
    sales: "₹94.5K",
    volume: "185L",
    share: 38,
    color: "#E11D48",
  },
];

function getStatusBadge(status: OrderItem["status"]) {
  switch (status) {
    case "Completed":
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: CheckCircle2,
      };
    case "Processing":
      return {
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock,
      };
    case "Dispatched":
      return {
        bg: "bg-blue-50 text-blue-700 border-blue-200",
        icon: Truck,
      };
    case "Pending":
      return {
        bg: "bg-slate-100 text-slate-700 border-slate-200",
        icon: AlertCircle,
      };
  }
}

function HomePage() {
  const { user } = useAuthStore();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const filteredOrders =
    selectedFilter === "All"
      ? RECENT_ORDERS
      : RECENT_ORDERS.filter((o) => o.status === selectedFilter);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-border/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Welcome back{user?.firstname ? `, ${user.firstname}` : ""}
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
              {user?.role || "Admin"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Here is your daily orders, revenue, and dealer dispatch summary.
          </p>
        </div>

        {/* Quick Action Badges */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border/70 text-xs text-muted-foreground font-medium">
            <Calendar className="size-3.5 text-primary" />
            <span>Today, {new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-border/80 p-5 shadow-xs hover:border-primary/40 transition-all hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground mt-3 tracking-tight">
                {stat.value}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                <span
                  className={`inline-flex items-center font-semibold ${
                    stat.isPositive ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {stat.isPositive ? (
                    <ArrowUpRight className="size-3.5 mr-0.5" />
                  ) : (
                    <ArrowDownRight className="size-3.5 mr-0.5" />
                  )}
                  {stat.delta}
                </span>
                <span className="text-muted-foreground">{stat.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Orders (8 cols) + Sales Overview & Top Products (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Recent Orders Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-border/80 shadow-xs overflow-hidden">
          {/* Card Header & Filter Tabs */}
          <div className="p-5 sm:p-6 border-b border-border/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                Recent Orders
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {filteredOrders.length}
                </span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time transactions from dealer networks and regional store hubs.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {["All", "Completed", "Processing", "Dispatched", "Pending"].map(
                (filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      selectedFilter === filter
                        ? "bg-primary text-white shadow-xs"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {filter}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/30 text-muted-foreground font-semibold border-b border-border/70">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Order ID</th>
                  <th className="py-3 px-4">Dealer / Client</th>
                  <th className="py-3 px-4">Products &amp; Volume</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredOrders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  const StatusIcon = badge.icon;
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-muted/20 transition-colors group"
                    >
                      {/* Order ID & Time */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="font-bold text-foreground font-mono">
                          {order.id}
                        </span>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {order.time}
                        </p>
                      </td>

                      {/* Dealer & City */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-foreground max-w-[180px] truncate">
                          {order.dealer}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {order.city}
                        </p>
                      </td>

                      {/* Products */}
                      <td className="py-3.5 px-4">
                        <p className="text-foreground max-w-[200px] truncate font-medium">
                          {order.products}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Total Volume: {order.liters} Liters
                        </p>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-foreground text-sm">
                          ₹{order.amount.toLocaleString("en-IN")}
                        </span>
                        <p className="text-[10px] text-emerald-600 font-medium">
                          GST Paid
                        </p>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.bg}`}
                        >
                          <StatusIcon className="size-3" />
                          {order.status}
                        </span>
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          title="View order details"
                          className="p-1.5 rounded-lg border border-border/80 bg-white hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          <Eye className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 border-t border-border/70 flex items-center justify-between text-xs text-muted-foreground bg-muted/10">
            <span>
              Showing {filteredOrders.length} of {RECENT_ORDERS.length} recent orders
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-1 font-semibold text-primary hover:underline cursor-pointer"
              >
                <span>View Full Order Ledger</span>
                <ArrowUpRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sales Overview & Top Products (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Sales Trends Chart Card */}
          <div className="bg-white rounded-2xl border border-border/80 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground tracking-tight">
                  Weekly Sales
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Revenue trend for current week
                </p>
              </div>
              <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ArrowUpRight className="size-3" />
                +14.8%
              </span>
            </div>

            {/* Total Revenue Highlight */}
            <div className="mb-6">
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                ₹20.0L
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Total weekly invoiced orders
              </p>
            </div>

            {/* Custom SVG / HTML Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-36 pt-4 px-2 border-b border-border/60">
              {WEEKLY_SALES.map((item) => (
                <div
                  key={item.day}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-default"
                >
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded -mb-1">
                    ₹{item.amount}L
                  </div>
                  {/* Bar */}
                  <div
                    className="w-full max-w-[28px] rounded-t-lg bg-primary/20 group-hover:bg-primary transition-all duration-200 relative"
                    style={{ height: `${item.height}%` }}
                  >
                    {/* Active highlight on peak day */}
                    {item.height === 100 && (
                      <div className="absolute inset-0 bg-primary rounded-t-lg" />
                    )}
                  </div>
                  {/* Day Label */}
                  <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary Highlights below chart */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-2">
              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60">
                <p className="text-[11px] text-muted-foreground">Avg. Order Value</p>
                <p className="text-sm font-bold text-foreground mt-0.5">₹21,800</p>
              </div>
              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60">
                <p className="text-[11px] text-muted-foreground">Dispatched Today</p>
                <p className="text-sm font-bold text-foreground mt-0.5">340 Liters</p>
              </div>
            </div>
          </div>

          {/* Top Selling Products / Shades */}
          <div className="bg-white rounded-2xl border border-border/80 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground tracking-tight">
                  Top Selling Shades
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  High-velocity architectural products
                </p>
              </div>
              <button
                type="button"
                title="Filter products"
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Filter className="size-3.5" />
              </button>
            </div>

            {/* Products List with Progress Bars */}
            <div className="space-y-4">
              {TOP_PRODUCTS.map((prod) => (
                <div key={prod.code} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-3 rounded-full shrink-0 ring-1 ring-black/10"
                        style={{ backgroundColor: prod.color }}
                      />
                      <div>
                        <p className="font-semibold text-foreground">
                          {prod.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          {prod.code} · {prod.volume}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-foreground">
                      {prod.sales}
                    </span>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${prod.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Action link */}
            <div className="mt-5 pt-4 border-t border-border/70 flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Inventory sync active</span>
              <button
                type="button"
                className="font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Stock Report</span>
                <Download className="size-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
