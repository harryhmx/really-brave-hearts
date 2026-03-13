"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
          <span className="font-bold">
            RBH
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground">
            Home
          </Link>
          <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Features
          </Link>
          <Link href="#levels" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Levels
          </Link>
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden md:flex ml-auto items-center space-x-4">
          <ThemeToggle />
          <nav className="flex items-center space-x-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden ml-auto items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container flex flex-col space-y-3 px-4 py-4 max-w-screen-2xl mx-auto">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#levels"
              className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              onClick={() => setMobileMenuOpen(false)}
            >
              Levels
            </Link>
            <div className="flex flex-col space-y-2 pt-2 border-t">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Log In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
