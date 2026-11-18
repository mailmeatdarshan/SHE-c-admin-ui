
import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  RiEyeLine,
  RiEyeOffLine,
  RiLockPasswordLine,
  RiMailLine,
  RiArrowRightLine,
  RiPaletteLine,
  RiPaintBrushLine,
  RiDropLine,
  RiGoogleFill,
  RiGithubFill,
} from "@remixicon/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { LoginCredentials } from "@/types"
import { login, self, logout } from "@/http/api"
import { Alert } from "@/components/ui/alert"
import { useAuthStore } from "@/store"
import { usePermission } from "@/hooks/usePermission"


const loginUser = async (userData: LoginCredentials) => {
  const { data } = await login(userData)
  return data
}

const getself = async () => {
  const { data } = await self()
  return data
}

const LoginPage = () => {

  const {isAllowed} = usePermission();
  const {setUser, logout:logoutFromStore} = useAuthStore();

  const { refetch } = useQuery({
    queryKey: ['self'],
    queryFn: getself,
    enabled: false,
  })

  const { mutate: logoutMutate } = useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
    onSuccess: () => {
      logoutFromStore();
    }
  })

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ['login'],
    mutationFn: loginUser,
    onSuccess: async () => {
      //get self
      const selfDataPromise = await refetch()

      if (selfDataPromise.isError) {
        console.error("Failed to fetch /auth/self:", selfDataPromise.error)
        return
      }

      //logout or redirect to client ui
      //window.location.href = "http://cleint/url"
      //"admin","manager","customer"

      if (!isAllowed(selfDataPromise.data)) {
        logoutMutate();
        return
      }

      if (selfDataPromise.data) {
        setUser(selfDataPromise.data)
      }
      console.log("userData", selfDataPromise.data)
      //store in the state
      console.log("Login Successfull")
    }
  })



  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || isPending) return
    mutate({ email, password, rememberMe })
  }

  // Paint swatches inspired by Birla Opus color studio
  // const colorSwatches = [
  //   { name: "Opus Emerald", hex: "#01A373", code: "SHE-101" },
  //   { name: "Sun Amber", hex: "#F59E0B", code: "SHE-204" },
  //   { name: "Coral Bloom", hex: "#E11D48", code: "SHE-308" },
  //   { name: "Sapphire Deep", hex: "#2563EB", code: "SHE-412" },
  //   { name: "Tuscan Ochre", hex: "#D97706", code: "SHE-516" },
  // ]

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#F8F9FA] text-[#1E1E1E] font-sans antialiased">
      {/* Top Navigation Bar - Minimal & Clean like birlaopus.com */}
      <header className="w-full bg-white border-b border-border/80 px-6 sm:px-10 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo Mark: Clean geometric paint droplet + color palette */}
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <RiPaletteLine className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-foreground leading-none">
                {/* SHRI HARI ENTERPRISES */}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                Paints &amp; Colors
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground tracking-wide font-medium">
              Architectural &amp; Decorative Coatings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="hidden md:flex items-center gap-1.5 text-muted-foreground font-medium">
            <span className="size-2 rounded-full bg-primary" />
            Partner &amp; Dealer Network
          </span>
          <a
            href=""
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors font-medium hidden sm:inline-block"
          >
            Explore Shades
          </a>
        </div>
      </header>

      {/* Main Body - Split or Centered Hero */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-5xl grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero / Brand Showcase - Color Business Inspiration */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 lg:pr-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border/80 text-xs font-semibold text-primary w-fit shadow-xs">
              <RiPaintBrushLine className="size-3.5" />
              <span>Premium Color Solutions</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-foreground leading-[1.15]">
                Colors that inspire. <br />
                <span className="text-primary">Quality that lasts.</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
                {/* Welcome to the Shri Hari Enterprises portal. Access your color mixing formulations, dealer inventory, swatch catalogues, and dealer accounts in one place. */}
              </p>
            </div>

            {/* Interactive Color Spectrum Swatches - Paint Brand Touch */}
            <div className="space-y-2.5 pt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Trending Palette · Color Spectrum 2026
              </p>
              {/* <div className="flex items-center gap-2.5 flex-wrap">
                {colorSwatches.map((swatch) => (
                  <div
                    key={swatch.code}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-border/80 shadow-xs hover:border-primary/50 transition-all cursor-default"
                  >
                    <span
                      className="size-3.5 rounded-full shrink-0 shadow-xs ring-1 ring-black/10"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <div className="text-left">
                      <p className="text-xs font-medium text-foreground leading-none">
                        {swatch.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {swatch.code}
                      </p>
                    </div>
                  </div>
                ))}
              </div> */}
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/70 max-w-md">
              <div>
                <p className="text-lg font-bold text-foreground">1,200+</p>
                <p className="text-xs text-muted-foreground">Color Shades</p>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground">Lead-Free Paint</p>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">24/7</p>
                <p className="text-xs text-muted-foreground">Dealer Support</p>
              </div>
            </div>
          </div>

          {/* Right Column - Clean Minimal Birla Opus-style Login Card */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white rounded-2xl border border-border/90 shadow-xl shadow-black/[0.04] p-6 sm:p-8 relative overflow-hidden">
              {/* Colorful Paint Ribbon Accent at Top of Card */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#01A373] via-[#F59E0B] via-[#E11D48] to-[#2563EB]" />

              {/* Card Header */}
              <div className="text-center pb-6">
                <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
                  <RiDropLine className="size-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Login
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {/* Welcome to Shri Hari Enterprises Portal */}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {isError && (
                  <Alert title="Error" description={error?.message || "An error occurred during login"} />
                )}
                {/* Username or Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-xs font-semibold text-foreground">
                    Username or Email
                  </Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      <RiMailLine className="size-4" />
                    </div>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Username or email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 h-10 rounded-xl bg-muted/30 border-border focus-visible:bg-white focus-visible:ring-primary/20 text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-semibold text-foreground">
                      Password
                    </Label>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      <RiLockPasswordLine className="size-4" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-9 h-10 rounded-xl bg-muted/30 border-border focus-visible:bg-white focus-visible:ring-primary/20 text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <RiEyeOffLine className="size-4" />
                      ) : (
                        <RiEyeLine className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me & Forgot Password */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      aria-label="Remember me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(!!checked)}
                    />
                    <Label
                      htmlFor="remember"
                      className="text-xs font-normal text-muted-foreground cursor-pointer select-none"
                    >
                      Remember me
                    </Label>
                  </div>

                  <a
                    href="/forgot-password"
                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>

                {/* Sign In Button in Signature Birla Opus Emerald Green */}
                <Button
                  type="submit"
                  size="default"
                  disabled={isPending}
                  className="w-full h-10.5 rounded-xl bg-primary text-white hover:bg-primary/90 font-semibold shadow-sm transition-all cursor-pointer mt-2 disabled:opacity-50"
                >
                  {isPending ? "Signing In..." : "Sign In"}
                  <RiArrowRightLine className="ml-1.5 size-4" />
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                  <span className="bg-white px-3 text-muted-foreground font-medium">
                    Or partner login
                  </span>
                </div>
              </div>

              {/* Social / Partner login */}
              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 rounded-xl border-border text-xs font-medium hover:bg-muted/40 cursor-pointer"
                >
                  <RiGoogleFill className="mr-1.5 size-3.5 text-rose-500" />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 rounded-xl border-border text-xs font-medium hover:bg-muted/40 cursor-pointer"
                >
                  <RiGithubFill className="mr-1.5 size-3.5 text-foreground" />
                  GitHub
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Minimal like birlaopus */}
      {/* <footer className="w-full py-4 px-6 text-center text-xs text-muted-foreground border-t border-border/80 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Shri Hari Enterprises. All Rights Reserved.</span>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
            <span>·</span>
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <span>·</span>
            <span>Customer Care: +91 92235-67406</span>
          </div>
        </div>
      </footer> */}
    </div>
  )
}

export default LoginPage