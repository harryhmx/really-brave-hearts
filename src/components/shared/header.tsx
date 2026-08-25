"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { ThemeToggle } from "./theme-toggle"
import { LogoutButton } from "./logout-button"
import { MobileMenu } from "./mobile-menu"
import { Button } from "@/components/ui/button"

export function Header() {
  const sessionData = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    queueMicrotask(() => setMounted(true))
  }, [])

  const session = sessionData?.data
  const status = sessionData?.status ?? "unauthenticated"
  const isLoggedIn = mounted && status === "authenticated"
  const isMobileMenuLoggedIn = mounted ? !!session?.user : false

  return (
    <header className="sticky top-0 z-50 w-full bg-rbh-header">
      <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2 transition-transform hover:scale-105">
          <span className="font-bold text-rbh-header-text text-lg">
            RBH
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/project/adventure-academy" className="text-rbh-header-text/75 transition-colors hover:text-rbh-header-text">
            Adventure Academy
          </Link>
          <Link href="/project/explore-ai" className="text-rbh-header-text/75 transition-colors hover:text-rbh-header-text">
            Explore AI
          </Link>
          {isLoggedIn && (
            <Link href="/dashboard" className="text-rbh-header-text/75 transition-colors hover:text-rbh-header-text">
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden md:flex ml-auto items-center space-x-4">
          <ThemeToggle />
          {isLoggedIn ? (
            <LogoutButton className="text-rbh-header-text/75 hover:text-rbh-header-text hover:bg-white/10" />
          ) : (
            <nav className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-rbh-header-text/75 hover:text-rbh-header-text hover:bg-white/10">
                  Log In
                </Button>
              </Link>
            </nav>
          )}
        </div>

        {/* Mobile Menu */}
        <MobileMenu session={isMobileMenuLoggedIn} />
      </div>
    </header>
  )
}
