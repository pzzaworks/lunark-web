import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#080A0C] text-white">
      {/* Simple Navbar */}
      <header className="w-full px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/icons/icon-light.svg"
            alt="Lunark AI"
            width={32}
            height={32}
          />
          <span className="font-semibold">Lunark AI</span>
        </Link>
      </header>

      {/* 404 Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-white/50 mb-8">Page not found</p>
        <Link
          href="/"
          className="border border-[#888]/30 text-[#FCFCFC] px-4 py-2 rounded-lg text-sm font-medium
            bg-[radial-gradient(70%_70%_at_center,rgba(8,10,12,0.98)_0%,rgba(160,165,180,0.25)_100%)]
            hover:border-[#aaa]/50 hover:bg-[radial-gradient(70%_70%_at_center,rgba(8,10,12,0.98)_0%,rgba(160,165,180,0.35)_100%)]
            transition-all duration-200"
        >
          Go back home
        </Link>
      </div>

      {/* Simple Footer */}
      <footer className="w-full px-6 py-4 text-center text-white/30 text-sm">
        © {new Date().getFullYear()} Lunark AI
      </footer>
    </div>
  )
}
