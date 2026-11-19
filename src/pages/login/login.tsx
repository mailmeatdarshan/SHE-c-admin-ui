import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  RiInformationLine,
  RiCloseLine,
  RiAlertFill,
  RiArrowRightUpLine,
} from "@remixicon/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { LoginCredentials } from "@/types"
import { login, self, logout } from "@/http/api"
import { useAuthStore } from "@/store"
import { usePermission } from "@/hooks/usePermission"

// Peacock Feather (Mor Pankh) Watermark SVG component
const PeacockFeatherWatermark = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 472 645"
    className={className}
    fill="none"
  >
    {/* feather barbs, shaft and quill */}
    <g fill="#000">
      <path d="M344.7 44.9C263.4 209.2 169.4 369.0 156.5 489.7C151.0 534.9 156.1 575.6 176.0 604.0C159.9 574.4 157.0 535.1 163.5 490.5C174.6 371.0 266.6 210.8 345.3 45.1Z" />
      <path d="M162.1 483.5Q104.3 452.3 88.0 335.0Q103.1 454.4 158.6 489.3ZM163.8 470.7Q106.1 439.3 89.8 321.4Q104.8 441.3 160.4 476.4ZM166.1 457.7Q108.6 426.2 92.4 308.0Q107.4 428.1 162.7 463.3ZM168.9 444.5Q111.9 412.9 95.8 294.7Q110.7 414.9 165.5 450.0ZM172.1 431.3Q115.8 399.6 100.0 281.5Q114.6 401.5 168.7 436.6ZM175.8 417.8Q120.4 386.3 104.8 268.6Q119.2 388.1 172.4 423.1ZM179.9 404.3Q125.5 372.9 110.2 255.9Q124.4 374.7 176.6 409.4ZM184.3 390.7Q131.2 359.5 116.3 243.4Q130.1 361.2 181.0 395.7ZM189.1 377.0Q137.4 346.1 122.9 231.2Q136.3 347.8 185.8 381.9ZM194.2 363.2Q144.1 332.7 130.0 219.3Q143.0 334.4 191.0 368.0ZM199.6 349.5Q151.2 319.3 137.6 207.6Q150.1 321.0 196.3 354.1ZM205.2 335.6Q158.7 306.0 145.6 196.3Q157.5 307.6 202.0 340.1ZM211.0 321.8Q166.5 292.8 154.0 185.2Q165.4 294.3 207.8 326.2ZM217.0 308.0Q174.6 279.6 162.8 174.6Q173.5 281.1 213.8 312.3ZM223.2 294.3Q183.0 266.6 171.8 164.2Q181.9 268.0 220.0 298.4ZM229.4 280.5Q191.6 253.7 181.1 154.2Q190.5 255.1 226.3 284.5ZM235.8 266.9Q200.5 240.9 190.7 144.6Q199.4 242.2 232.6 270.7ZM242.3 253.3Q209.5 228.2 200.4 135.4Q208.3 229.5 239.1 257.0ZM248.8 239.9Q218.6 215.8 210.3 126.6Q217.5 217.0 245.6 243.4ZM255.3 226.6Q227.8 203.5 220.3 118.2Q226.7 204.7 252.1 230.0ZM261.8 213.4Q237.1 191.4 230.3 110.1Q235.9 192.6 258.6 216.6ZM268.3 200.4Q246.3 179.6 240.4 102.5Q245.2 180.6 265.0 203.5ZM274.8 187.7Q255.6 168.0 250.5 95.3Q254.4 169.0 271.4 190.5ZM281.2 175.2Q264.8 156.7 260.6 88.5Q263.6 157.6 277.7 177.7ZM287.4 162.9Q274.0 145.6 270.6 82.2Q272.7 146.4 283.9 165.2ZM293.6 151.0Q282.9 134.9 280.4 76.2Q281.7 135.6 289.9 152.9ZM299.6 139.4Q291.8 124.5 290.1 70.7Q290.4 125.0 295.8 140.9ZM305.4 128.3Q300.4 114.6 299.5 65.7Q299.0 114.8 301.5 129.2ZM310.9 117.7Q308.7 105.0 308.6 61.0Q307.3 105.0 307.0 117.8ZM316.1 107.7Q316.7 95.9 317.4 56.8Q315.3 95.7 312.3 106.9ZM320.8 98.3Q324.2 87.5 325.7 53.0Q323.0 86.9 317.5 96.6ZM325.1 89.6Q331.1 79.7 333.3 49.7Q330.2 78.9 322.2 87.2ZM328.7 81.9Q337.3 72.9 340.1 46.9Q336.5 71.9 326.5 79.0ZM331.4 76.2Q341.7 68.0 345.0 45.0Q341.1 66.9 329.6 73.1ZM165.5 461.1Q209.3 447.0 227.5 419.2Q208.8 445.0 164.1 455.5ZM168.7 445.9Q221.2 431.8 242.9 404.0Q220.8 429.8 167.5 440.4ZM172.5 430.6Q232.8 416.4 257.6 388.4Q232.4 414.5 171.5 425.1ZM177.0 415.1Q243.9 400.8 271.5 372.6Q243.6 399.0 176.0 409.7ZM181.9 399.4Q254.7 385.1 284.6 356.5Q254.4 383.3 181.0 394.2ZM187.3 383.7Q265.0 369.3 297.0 340.4Q264.8 367.5 186.5 378.6ZM193.0 367.9Q274.9 353.4 308.5 324.1Q274.6 351.6 192.3 362.8ZM199.2 352.0Q284.2 337.4 319.0 307.8Q283.9 335.7 198.5 347.1ZM205.6 336.1Q292.9 321.5 328.7 291.5Q292.7 319.8 205.0 331.3ZM212.4 320.2Q301.1 305.5 337.4 275.3Q300.9 303.9 211.7 315.5ZM219.3 304.3Q308.6 289.6 345.2 259.1Q308.4 288.0 218.7 299.8ZM226.4 288.5Q315.5 273.8 352.0 243.2Q315.3 272.2 225.8 284.1ZM233.7 272.7Q321.7 258.1 357.8 227.4Q321.5 256.5 233.1 268.4ZM241.1 257.1Q327.3 242.5 362.6 211.8Q327.1 241.0 240.5 252.9ZM248.5 241.6Q332.2 227.1 366.5 196.5Q332.0 225.7 247.9 237.5ZM255.9 226.3Q336.4 211.9 369.3 181.6Q336.1 210.5 255.3 222.3ZM263.3 211.2Q339.9 197.0 371.2 167.0Q339.6 195.6 262.7 207.3ZM270.7 196.3Q342.7 182.4 372.2 152.7Q342.5 181.0 270.1 192.6ZM278.0 181.7Q344.8 168.0 372.3 139.0Q344.6 166.8 277.4 178.1ZM285.2 167.5Q346.3 154.1 371.5 125.6Q346.1 152.8 284.5 163.9ZM292.1 153.6Q347.2 140.5 369.8 112.8Q346.9 139.3 291.4 150.1ZM298.9 140.1Q347.5 127.5 367.5 100.6Q347.2 126.3 298.2 136.8ZM305.5 127.1Q347.2 114.9 364.4 89.0Q346.9 113.8 304.7 123.9ZM311.7 114.8Q346.4 103.0 360.8 78.1Q346.1 101.9 310.8 111.6ZM317.6 103.1Q345.3 91.8 356.8 67.9Q344.9 90.8 316.6 100.1ZM323.0 92.3Q343.8 81.6 352.5 58.7Q343.4 80.6 321.8 89.5ZM327.9 82.8Q342.2 72.6 348.3 50.7Q341.6 71.6 326.3 80.2ZM331.4 75.8Q340.8 66.0 345.0 45.0Q340.1 65.2 329.5 73.5Z" />
    </g>
    {/* eye */}
    <g transform="translate(258 216) rotate(18)">
      <path
        d="M0 -70C38 -70 58 -24 58 14C58 52 32 72 0 72C-32 72 -58 52 -58 14C-58 -24 -38 -70 0 -70Z"
        fill="#fff"
        transform="scale(1.06)"
      />
      <path
        d="M0 -70C38 -70 58 -24 58 14C58 52 32 72 0 72C-32 72 -58 52 -58 14C-58 -24 -38 -70 0 -70Z"
        fill="none"
        stroke="#000"
        strokeWidth="5"
      />
      <path
        d="M0 -70C38 -70 58 -24 58 14C58 52 32 72 0 72C-32 72 -58 52 -58 14C-58 -24 -38 -70 0 -70Z"
        fill="none"
        stroke="#000"
        strokeWidth="3.5"
        transform="scale(0.85)"
      />
      <path
        d="M0 -70C38 -70 58 -24 58 14C58 52 32 72 0 72C-32 72 -58 52 -58 14C-58 -24 -38 -70 0 -70Z"
        fill="#000"
        transform="scale(0.73)"
      />
      <ellipse cx="-2" cy="14" rx="26" ry="23" fill="#fff" />
      <path
        d="M-12 16a12 12 0 1 1 24 0a9 9 0 1 0-15 6.500a12 12 0 0 1-9-6.500Z"
        fill="#000"
      />
    </g>
  </svg>
)

const loginUser = async (userData: LoginCredentials) => {
  const { data } = await login(userData)
  return data
}

const getself = async () => {
  const { data } = await self()
  return data
}

const LoginPage = () => {
  const { isAllowed } = usePermission()
  const { setUser, logout: logoutFromStore } = useAuthStore()

  const { refetch } = useQuery({
    queryKey: ["self"],
    queryFn: getself,
    enabled: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [permissionError, setPermissionError] = useState<string | null>(null)
  const [showAnnouncement, setShowAnnouncement] = useState(true)

  const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: () => {
      logoutFromStore()
    },
  })

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: async () => {
      const selfDataPromise = await refetch()

      if (selfDataPromise.isError) {
        console.error("Failed to fetch /auth/self:", selfDataPromise.error)
        return
      }

      if (!isAllowed(selfDataPromise.data)) {
        setPermissionError(
          "Access denied. Only admin or manager accounts can log in to the dashboard."
        )
        logoutMutate()
        return
      }

      if (selfDataPromise.data) {
        setUser(selfDataPromise.data)
      }
      console.log("Login Successful, User:", selfDataPromise.data)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || isPending) return
    setPermissionError(null)
    mutate({ email, password, rememberMe })
  }

  const errorMessage =
    permissionError ||
    (isError
      ? error?.message || "Invalid credentials. Please verify your details."
      : null)

  return (
    <div className="min-h-screen w-full bg-[#fbfbfb] text-[#16191f] font-sans flex flex-col justify-between relative selection:bg-[#ec7211] selection:text-white">
      {/* Background Subtle Watermark Shapes: Peacock Feather (Mor Pankh) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.038] sm:opacity-[0.045] overflow-hidden"
        aria-hidden="true"
      >
        <PeacockFeatherWatermark className="absolute -left-20 sm:-left-12 -top-16 sm:-top-8 w-[380px] sm:w-[500px] h-auto rotate-[12deg]" />
        <PeacockFeatherWatermark className="absolute -right-20 sm:-right-12 -bottom-24 sm:-bottom-16 w-[420px] sm:w-[540px] h-auto -rotate-[22deg] scale-x-[-1]" />
      </div>

      <header className="relative z-10 w-full px-6 py-4 flex items-start justify-between">
        <div className="w-32 hidden md:block" />

        <div className="flex flex-col items-center mx-auto md:mx-0 pt-8 sm:pt-10">
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              Shri Hari Enterprises
            </span>
            <span className="text-xs font-bold text-[#ec7211] tracking-wider uppercase ml-1">
              admin
            </span>
          </div>
        </div>

        {/* Top Right Utilities */}
        <div className="flex items-center gap-4 text-xs text-slate-600 font-medium pt-1">
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-block text-slate-500 hover:text-slate-900 transition-colors"
          >
            Store Front
          </a>
          <span className="hidden sm:inline-block text-slate-300">|</span>
          <span className="hover:text-slate-900 cursor-pointer">
            English ▼
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-5xl mx-auto w-full">
        {/* Announcement / Notice Box (Like AWS Sign-in is getting an update) */}
        {showAnnouncement && (
          <div className="w-full max-w-[890px] mb-6 bg-white border border-[#0073bb]/30 rounded-xl p-3 sm:p-4 flex items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start sm:items-center gap-2.5 min-w-0">
              <RiInformationLine className="size-5 text-[#0073bb] shrink-0 mt-0.5 sm:mt-0" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900 mr-1.5">
                  Shri Hari Enterprises 2026 Update
                </span>
                Shri Hari Enterprises is introducing simplified dealer inventory,
                order dispatch pipelines, and role controls.{" "}
                <a
                  href="#learn-more"
                  className="text-[#0073bb] hover:underline inline-flex items-center gap-0.5 font-medium ml-1"
                >
                  Learn more <RiArrowRightUpLine className="size-3" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowAnnouncement(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                aria-label="Dismiss notice"
              >
                <RiCloseLine className="size-4" />
              </button>
            </div>
          </div>
        )}

        {/* Split Section: Left Promotional Banner + Right Sign-in Card */}
        <div className="w-full max-w-[890px] grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* LEFT: Classic Promotional Banner (AWS Lightsail style) */}
          {/* USER NOTE: Replace this image/banner anytime! */}
          <div className="md:col-span-7 rounded-xl overflow-hidden relative min-h-[360px] flex flex-col justify-between p-6 sm:p-8 bg-[#0a0705] border border-slate-800 text-white shadow-xs">
            {/* Speed Streak / Light Wave Background */}
            <div
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 80% 20%, rgba(249, 115, 22, 0.45) 0%, rgba(180, 83, 9, 0.15) 45%, rgba(10, 7, 5, 0.95) 75%)",
              }}
            />

            {/* Top Content */}
            <div className="relative z-10 max-w-sm">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Shri Hari Express
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                The easiest way to manage dealer inventory, retail orders, and
                color shade formulations on SHE.
              </p>
              <button
                type="button"
                className="mt-4 px-3.5 py-1.5 rounded-md border border-white/50 text-xs font-medium text-white hover:bg-white/10 transition-colors"
              >
                Learn more &raquo;
              </button>
            </div>

            {/* Bottom Line-Art Mascot / Illustration (AWS Lightsail style robot) */}
            <div className="relative z-10 flex justify-end items-end mt-8">
              <svg
                className="w-28 h-28 sm:w-36 sm:h-36 text-white/90"
                viewBox="0 0 160 160"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Robot Head */}
                <rect x="50" y="45" width="60" height="48" rx="10" />
                {/* Antenna */}
                <line x1="80" y1="45" x2="80" y2="30" />
                <circle cx="80" cy="27" r="4" fill="currentColor" />
                {/* Eyes */}
                <circle cx="68" cy="64" r="5" fill="currentColor" />
                <circle cx="92" cy="64" r="5" fill="currentColor" />
                {/* Smile */}
                <path d="M68 78 Q80 88 92 78" />
                {/* Neck */}
                <rect x="74" y="93" width="12" height="6" />
                {/* Body */}
                <rect x="58" y="99" width="44" height="34" rx="6" />
                {/* Chest badge */}
                <line x1="72" y1="112" x2="88" y2="112" />
                {/* Legs */}
                <line x1="68" y1="133" x2="68" y2="148" />
                <line x1="92" y1="133" x2="92" y2="148" />
                {/* Thumbs Up Hand */}
                <path d="M102 108 L116 102 L118 90 L124 90 L124 102 L128 106 L124 116 L102 118" />
                {/* Ground dashed line */}
                <line x1="20" y1="150" x2="140" y2="150" strokeDasharray="6 4" />
              </svg>
            </div>
          </div>

          {/* RIGHT: Classic AWS-style Sign-In Box */}
          <div className="md:col-span-5 bg-white border border-slate-300/80 rounded-xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center gap-1.5 mb-5">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  Sign in
                </h1>
                <RiInformationLine className="size-4 text-slate-400 cursor-help" />
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-300 text-red-800 text-xs rounded-lg p-3 mb-4 flex items-start gap-2 shadow-xs">
                  <RiAlertFill className="size-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username / Email Field */}
                <div className="space-y-1">
                  <Label
                    htmlFor="username"
                    className="text-xs font-semibold text-slate-800"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="admin@she.space"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-9 rounded-md border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#ec7211] focus-visible:ring-1 focus-visible:ring-[#ec7211]"
                  />
                </div>

                {/* Remember Me Checkbox (Required by tests) */}
                <div className="flex items-center space-x-2 pt-0.5">
                  <Checkbox
                    id="remember"
                    aria-label="Remember me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                    className="size-4 rounded border-slate-300 data-[state=checked]:bg-[#ec7211] data-[state=checked]:border-[#ec7211]"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-xs text-slate-700 cursor-pointer select-none"
                  >
                    Remember me
                  </Label>
                </div>

                {/* Password Field */}
                <div className="space-y-1 pt-1">
                  <Label
                    htmlFor="password"
                    className="text-xs font-semibold text-slate-800"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-9 rounded-md border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#ec7211] focus-visible:ring-1 focus-visible:ring-[#ec7211]"
                  />
                </div>

                {/* Show Password + Having trouble / Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-1.5 text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                      className="size-3.5 rounded border-slate-300 accent-[#ec7211] cursor-pointer"
                    />
                    <span>Show Password</span>
                  </label>

                  <a
                    href="/forgot-password"
                    className="text-[#0073bb] hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>

                {/* Classic Amazon Orange Sign In Button (Required by tests) */}
                <Button
                  type="submit"
                  size="default"
                  disabled={isPending}
                  className="w-full mt-2 h-9 rounded-md bg-[#ec7211] hover:bg-[#eb5f07] active:bg-[#d95604] text-white font-medium text-sm shadow-xs border border-[#d9650b] cursor-pointer transition-colors"
                >
                  {isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </div>

            {/* Bottom Actions inside Card */}
            <div className="mt-5 pt-4 border-t border-slate-200/80 space-y-2">
              <div className="text-center pt-1">
                <a
                  href="#contact-support"
                  className="text-xs text-[#0073bb] hover:underline"
                >
                  Create a new SHE account
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer: Classic AWS Style Notice & Copyright */}
      <footer className="relative z-10 w-full py-6 px-4 text-center text-xs text-slate-500">
        <p className="max-w-xl mx-auto leading-relaxed">
          By continuing, you agree to Shri Hari Enterprises{" "}
          <a href="#terms" className="text-[#0073bb] hover:underline">
            Conditions of Use
          </a>{" "}
          and{" "}
          <a href="#privacy" className="text-[#0073bb] hover:underline">
            Privacy Notice
          </a>
          .
        </p>
        <div className="mt-3 flex items-center justify-center gap-4 text-slate-400">
          <a href="#terms" className="hover:text-slate-600 transition-colors">
            Conditions of Use
          </a>
          <span>·</span>
          <a href="#privacy" className="hover:text-slate-600 transition-colors">
            Privacy Notice
          </a>
          <span>·</span>
          <a href="#help" className="hover:text-slate-600 transition-colors">
            Help
          </a>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          &copy; 1996&ndash;{new Date().getFullYear()}, Shri Hari Enterprises, Inc.
          or its affiliates. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default LoginPage
