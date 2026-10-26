import { useEffect, useState, type ReactNode } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  Wallet,
  Users,
  Compass,
  Sparkles,
  Settings as SettingsIcon,
  Menu,
  X,
  Sparkle,
} from 'lucide-react';

export type Page =
  | 'dashboard'
  | 'business'
  | 'tasks'
  | 'finance'
  | 'customers'
  | 'opportunities'
  | 'advisor'
  | 'settings';

export const NAV: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'business', label: 'My Business', icon: Briefcase },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'finance', label: 'Finance', icon: Wallet },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'opportunities', label: 'Opportunities', icon: Compass },
  { id: 'advisor', label: 'AI Advisor', icon: Sparkles },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

interface LayoutProps {
  page: Page;
  onNavigate: (p: Page) => void;
  businessName: string;
  ownerName: string;
  children: ReactNode;
}

export function Layout({ page, onNavigate, businessName, ownerName, children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [page]);

  return (
    <div className="min-h-screen bg-ink-950 text-slate-200">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-ink-700/60 bg-ink-900/80 backdrop-blur-sm lg:flex">
        <SidebarContent
          page={page}
          onNavigate={onNavigate}
          businessName={businessName}
          ownerName={ownerName}
        />
      </aside>

      {/* Sidebar — mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 max-w-[80%] border-r border-ink-700/60 bg-ink-900 flex flex-col animate-fadeIn">
            <SidebarContent
              page={page}
              onNavigate={onNavigate}
              businessName={businessName}
              ownerName={ownerName}
              onClose={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Top bar — mobile */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink-700/60 bg-ink-900/80 px-4 py-3 backdrop-blur-sm lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-slate-300 hover:bg-ink-700/60"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-accent-600/20 text-accent-400">
            <Sparkle size={15} />
          </div>
          <span className="font-semibold text-slate-100">YouthBiz OS</span>
        </div>
        <div className="w-9" />
      </header>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      </main>
    </div>
  );
}

function SidebarContent({
  page,
  onNavigate,
  businessName,
  ownerName,
  onClose,
}: {
  page: Page;
  onNavigate: (p: Page) => void;
  businessName: string;
  ownerName: string;
  onClose?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent-600/20 text-accent-400">
            <Sparkle size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">YouthBiz OS</p>
            <p className="text-[11px] text-slate-500">Entrepreneur workspace</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-ink-700/60 lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? 'bg-accent-500/10 text-accent-300 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.25)]'
                  : 'text-slate-300 hover:bg-ink-700/50 hover:text-slate-100'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-ink-700/60 p-4">
        <div className="rounded-xl bg-ink-850/80 p-3">
          <p className="text-xs font-medium text-slate-400">Signed in as</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-slate-100">{ownerName || 'Entrepreneur'}</p>
          <p className="truncate text-xs text-slate-500">{businessName || 'No business yet'}</p>
        </div>
      </div>
    </div>
  );
}
