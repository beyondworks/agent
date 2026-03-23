import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight text-zinc-50">
            VideoForge
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors"
            >
              로그인
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-white text-zinc-900 px-4 py-2 text-sm font-medium hover:bg-zinc-100 transition-all hover:scale-105"
            >
              무료 시작
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 pt-16">{children}</main>
      <footer className="border-t border-zinc-800/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            © 2026 VideoForge. AI 기반 영상 제작 자동화.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              시작하기
            </Link>
            <Link href="/login" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              로그인
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
