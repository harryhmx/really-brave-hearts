"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { LogoutButton } from "./logout-button"

export function MobileMenu({ session }: { session: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex md:hidden ml-auto items-center space-x-2">
      <ThemeToggle />
      <Button
        variant="ghost"
        size="icon"
        className="text-rbh-header-text/75 hover:text-rbh-header-text hover:bg-white/10"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-rbh-header-text/15 bg-rbh-header absolute top-14 left-0 right-0">
          <nav className="container flex flex-col items-center space-y-3 px-4 py-4 max-w-screen-2xl mx-auto">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-rbh-header-text transition-colors hover:text-rbh-header-text/80"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/project/adventure-academy"
              className="text-sm font-medium text-rbh-header-text transition-colors hover:text-rbh-header-text/80"
              onClick={() => setMobileMenuOpen(false)}
            >
              Adventure Academy
            </Link>
            <Link
              href="/project/explore-ai"
              className="text-sm font-medium text-rbh-header-text transition-colors hover:text-rbh-header-text/80"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore AI
            </Link>
            <div className="border-t border-rbh-header-text/15 w-full pt-3">
              {session ? (
                <LogoutButton className="w-full justify-center text-rbh-header-text/75" />
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full text-rbh-header-text">
                      Log In
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
