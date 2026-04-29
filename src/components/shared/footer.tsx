import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#1a237e] to-[#0d47a1] dark:from-[#b8c4f0] dark:to-[#a0b0e8]">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4 max-w-screen-2xl py-6 md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-white/70 dark:text-[#1a237e]/60 md:text-left">
            Built with{" "}
            <Link
              href="https://nextjs.org"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[#ffcc80] dark:text-[#4a148c] hover:text-[#ffd600] dark:hover:text-[#311b92] underline underline-offset-4"
            >
              Next.js 15
            </Link>
            {" "}for young learners.
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <Link href="#" className="text-white/60 dark:text-[#1a237e]/60 hover:text-[#ffcc80] dark:hover:text-[#4a148c] transition-colors">About Us</Link>
          <Link href="#" className="text-white/60 dark:text-[#1a237e]/60 hover:text-[#ffcc80] dark:hover:text-[#4a148c] transition-colors">Privacy Policy</Link>
          <Link href="#" className="text-white/60 dark:text-[#1a237e]/60 hover:text-[#ffcc80] dark:hover:text-[#4a148c] transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  )
}
