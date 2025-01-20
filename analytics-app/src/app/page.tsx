"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { BarChart3, Globe, Zap, Shield, ArrowRight } from "lucide-react"
import { signIn , signOut } from "next-auth/react"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import Link from "next/link"

export default function AnalyticsLandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: session, status } = useSession();
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header
        className={`px-4 lg:px-6 h-16 flex items-center fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <Link className="flex items-center justify-center" href="#">
          <BarChart3 className={`h-6 w-6 text-blue-600`} />
          <span className="ml-2 text-2xl font-bold text-gray-900">InsightTrack</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
        {session ? (
              <>
                <Popover>
                  <PopoverTrigger>
                    <div className='flex space-x-2 items-center'>
                      <p className='truncate'>{session.user?.name}</p>
                      <img src={session.user?.image || ""} className="w-8 h-8 rounded-full" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Button  onClick={() => signOut()} className="w-full hidden md:inline-flex bg-red-500 text-white hover:bg-gray-800">
                      Log Out
                    </Button>
                  </PopoverContent>
                </Popover>
              </>
            ) : (
              <>
                <Button
              variant="outline"
              onClick={() => signIn("google")}
              className="hidden border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 md:inline-flex"
            >
              Log In
            </Button>
            <Button
              onClick={() => signIn("google")}
              className="hidden md:inline-flex bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
            >
              Sign Up
            </Button>
              </>
            )}
        </nav>
      </header>
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-blue-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl/none text-white">
                  Unlock the Power of Real-Time Website Analytics
                </h1>
                <p className="mx-auto max-w-[700px] text-blue-100 md:text-xl">
                  Discover user behavior, optimize performance, and grow your audience — all with one simple, powerful
                  platform.
                </p>
              </div>
              <div className="w-full mt-4 max-w-sm space-y-2">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50" type="submit">
                    Start Tracking Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
              </div>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <Globe className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle className="text-xl font-bold">Real-Time Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Get up-to-the-minute data on visitor behavior, traffic sources, and site performance.
                  </p>
                </CardContent>
              </Card>
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <Zap className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle className="text-xl font-bold">Effortless Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Add our lightweight script to your website in seconds and start tracking instantly.
                  </p>
                </CardContent>
              </Card>
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <Shield className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle className="text-xl font-bold">Actionable Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Simplified dashboards that help you turn data into decisions without the guesswork.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        {/* Call to Action Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <Card className="w-full max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                      Ready to Take Your Website to the Next Level?
                    </h2>
                    <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl">
                      Start tracking your website's performance and user behavior today. It's fast, easy, and free to
                      try.
                    </p>
                  </div>
                  <div className="w-full max-w-sm space-y-2">
                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                      Start Tracking Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2023 InsightTrack. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

