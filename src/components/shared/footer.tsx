import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-rbh-header">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4 max-w-screen-2xl py-6 md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-rbh-header-text/65 md:text-left">
            Really Brave Hearts · Learn bravely, live curiously.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
          <Link href="/#why-rbh" className="text-rbh-header-text/60 hover:text-rbh-gold transition-colors">About RBH</Link>
          <Link href="/project/adventure-academy" className="text-rbh-header-text/60 hover:text-rbh-gold transition-colors">Adventure Academy</Link>
          <Link href="/project/explore-ai" className="text-rbh-header-text/60 hover:text-rbh-gold transition-colors">Explore AI</Link>
        </div>
      </div>
    </footer>
  )
}
