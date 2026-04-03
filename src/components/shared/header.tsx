import Link from "next/link"
import { auth } from "@/lib/auth"
import { ThemeToggle } from "./theme-toggle"
import { LogoutButton } from "./logout-button"
import { MobileMenu } from "./mobile-menu"
import { Button } from "@/components/ui/button"

export async function Header() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">
            RBH
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
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
          {!!session?.user ? (
            <LogoutButton />
          ) : (
            <nav className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </nav>
          )}
        </div>

        {/* Mobile Menu */}
        <MobileMenu session={!!session?.user} />
      </div>
    </header>
  )
}
