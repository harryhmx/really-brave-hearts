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
    setMounted(true)
  }, [])

  const session = sessionData?.data
  const status = sessionData?.status ?? "unauthenticated"
  const isLoggedIn = mounted && status === "authenticated"
  const isMobileMenuLoggedIn = mounted ? !!session?.user : false

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#4a148c] to-[#311b92] dark:from-[#e8daff] dark:to-[#d4b8ff]">
      <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2 transition-transform hover:scale-105">
          <span className="font-bold text-white dark:text-[#311b92] text-lg">
            RBH
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {isLoggedIn && (
            <Link href="/dashboard" className="text-white/80 dark:text-[#311b92]/70 transition-colors hover:text-white dark:hover:text-[#311b92]">
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden md:flex ml-auto items-center space-x-4">
          <ThemeToggle />
          {isLoggedIn ? (
            <LogoutButton className="text-white/80 hover:text-white hover:bg-white/10 dark:text-[#311b92]/70 dark:hover:text-[#311b92] dark:hover:bg-[#311b92]/10" />
          ) : (
            <nav className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 dark:text-[#311b92]/70 dark:hover:text-[#311b92] dark:hover:bg-[#311b92]/10">
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
