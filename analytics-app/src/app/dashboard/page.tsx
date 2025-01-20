"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { BarChart3, Globe, Plus, ArrowRight } from "lucide-react"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function DashboardPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header
        className={`px-4 lg:px-6 h-16 flex items-center fixed top-0 left-0 right-0 z-50 bg-white shadow-md`}
      >
        <Link className="flex items-center justify-center" href="/dashboard">
          <BarChart3 className={`h-6 w-6 text-blue-600`} />
          <span className="ml-2 text-2xl font-bold text-gray-900">InsightTrack</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {session && (
            <Popover>
              <PopoverTrigger>
                <div className="flex space-x-2 items-center">
                  <p className="truncate">{session.user?.name}</p>
                  <img
                    src={session.user?.image || ""}
                    className="w-8 h-8 rounded-full"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <Button
                  onClick={() => signOut()}
                  className="w-full hidden md:inline-flex bg-red-500 text-white hover:bg-gray-800"
                >
                  Log Out
                </Button>
              </PopoverContent>
            </Popover>
          )}
        </nav>
      </header>

      <main className="flex-1 pt-2">
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                <Plus className="mr-2 h-5 w-5" /> Add Website
              </Button>
            </div>

            {/* Websites List */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Example Card for Website */}
              <Card className="hover:shadow-lg">
                <CardHeader>
                  <Globe className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle className="text-lg font-bold">example.com</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Visitors: <span className="font-bold">2,345</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Bounce Rate: <span className="font-bold">45%</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Avg. Session Duration: <span className="font-bold">2m 30s</span>
                  </p>
                  <Button
                    className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => console.log("View Details")}
                  >
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Add more cards for other websites dynamically */}
            </div>

            {/* Empty State */}
            <div className="mt-12 text-center" hidden>
              <p className="text-gray-500 text-lg">You haven’t added any websites yet.</p>
              <Button className="mt-4 bg-blue-600 text-white hover:bg-blue-700">
                Add Your First Website
              </Button>
            </div>
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
