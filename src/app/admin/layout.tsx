import Link from "next/link";

export const metadata = { title: "Admin | Portal pily" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-stone-800">Portal pily — Admin</span>
            <nav className="flex gap-4 text-sm">
              <Link href="/admin" className="text-amber-700 hover:underline">Poptavky</Link>
              <Link href="/admin/orders" className="text-amber-700 hover:underline">Objednavky</Link>
            </nav>
          </div>
          <Link href="/" className="text-xs text-stone-400 hover:text-stone-600">
            zpet na web
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
