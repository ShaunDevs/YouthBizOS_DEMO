import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  trendValue?: string;
  accent?: 'blue' | 'cyan' | 'amber' | 'green' | 'rose';
}

const accents: Record<string, string> = {
  blue: 'text-accent-400 bg-accent-500/10',
  cyan: 'text-cyan-300 bg-cyan-500/10',
  amber: 'text-amber-300 bg-amber-500/10',
  green: 'text-emerald-300 bg-emerald-500/10',
  rose: 'text-rose-300 bg-rose-500/10',
};

export function StatCard({ label, value, icon: Icon, trend, trendValue, accent = 'blue' }: StatCardProps) {
  return (
    <div className="card card-hover p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">{value}</p>
        </div>
        <div className={`rounded-xl p-2.5 ${accents[accent]}`}>
          <Icon size={18} />
        </div>
      </div>
      {trend && trendValue && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          {trend === 'up' ? (
            <ArrowUpRight size={14} className="text-emerald-400" />
          ) : (
            <ArrowDownRight size={14} className="text-rose-400" />
          )}
          <span className={trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}>{trendValue}</span>
          <span className="text-slate-500">this period</span>
        </div>
      )}
    </div>
  );
}
