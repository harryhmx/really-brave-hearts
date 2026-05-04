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
        className="text-white/80 hover:text-white hover:bg-white/10 dark:text-[#311b92]/70 dark:hover:text-[#311b92] dark:hover:bg-[#311b92]/10"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#4a148c]/10 dark:border-[#311b92]/15 bg-[#f5f0ff] dark:bg-[#ede4ff] absolute top-14 left-0 right-0">
          <nav className="container flex flex-col items-center space-y-3 px-4 py-4 max-w-screen-2xl mx-auto">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-foreground dark:text-[#311b92] transition-colors hover:text-foreground/80"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <div className="border-t border-[#4a148c]/10 dark:border-[#311b92]/15 w-full pt-3">
              {session ? (
                <LogoutButton className="w-full justify-center text-foreground dark:text-[#311b92]/70" />
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full text-foreground dark:text-[#311b92]">
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
