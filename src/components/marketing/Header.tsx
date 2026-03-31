import Link from "next/link";

export function Header() {
    return (
        <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 md:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-orange-400">
                    <span className="text-sm font-semibold text-slate-950">LL</span>
                </div>
                <span className="text-lg font-semibold tracking-tight text-slate-50">LocalLift</span>
            </Link>
            <nav className="hidden items-center gap-8 text-sm text-slate-200/80 md:flex">
                <Link href="/#features" className="hover:text-white">
                    Features
                </Link>
                <Link href="/pricing" className="hover:text-white">
                    Pricing
                </Link>
                <Link href="/#testimonials" className="hover:text-white">
                    Customers
                </Link>
                <Link href="/#faq" className="hover:text-white">
                    FAQ
                </Link>
            </nav>
            <div className="flex items-center gap-3">
                <Link
                    href="/login"
                    className="hidden text-sm font-medium text-slate-100/80 hover:text-white md:inline-flex"
                >
                    Log in
                </Link>
                <Link
                    href="/demo"
                    className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm hover:bg-white"
                >
                    Try the demo
                </Link>
            </div>
        </header>
    );
}
