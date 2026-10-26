import { useMemo, useState } from 'react';
import {
  Activity,
  Wallet,
  CheckSquare,
  Users,
  Plus,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Target,
} from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import {
  healthScore,
  calcBalance,
  openTasks,
  customerCounts,
  momentum,
  nextBestAction,
  formatDate,
} from '@/lib/logic';
import { StatCard } from '@/components/ui/StatCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import type { Page } from '@/components/Layout';
import { TaskModal } from '@/pages/TaskModal';
import { TransactionModal } from '@/pages/TransactionModal';
import { CustomerModal } from '@/pages/CustomerModal';

export function Dashboard({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const { state, addTask, addTransaction, addCustomer } = useStore();
  const [taskOpen, setTaskOpen] = useState(false);
  const [txOpen, setTxOpen] = useState(false);
  const [custOpen, setCustOpen] = useState(false);

  const score = healthScore(state);
  const balance = calcBalance(state.transactions);
  const open = openTasks(state.tasks);
  const { total: customers } = customerCounts(state.customers);
  const momentumData = momentum(state);
  const nba = useMemo(() => nextBestAction(state), [state]);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const recentTx = [...state.transactions]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-100 sm:text-3xl">
          {greeting}, {state.user.name}.
        </h1>
        <p className="text-sm text-slate-400">
          {state.business.name} · {state.business.category} · {state.business.stage}
        </p>
      </div>

      {/* Top row: health + next best action */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card flex flex-col items-center gap-3 p-5 sm:flex-row sm:items-center sm:gap-6">
          <ProgressRing value={score} label={String(score)} sublabel="Health" />
          <div className="text-center sm:text-left">
            <p className="section-title">Business Health Score</p>
            <p className="mt-1 text-sm text-slate-300">
              {score >= 70
                ? 'Strong. Keep the momentum going.'
                : score >= 40
                  ? 'Moving. A few areas need attention.'
                  : 'Early days. Complete your next action to climb.'}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="chip bg-emerald-500/10 text-emerald-300">{open.length} open tasks</span>
              <span className="chip bg-accent-500/10 text-accent-300">{customers} customers</span>
            </div>
          </div>
        </div>

        {/* Next best action */}
        <div className="card relative overflow-hidden p-5 lg:col-span-2">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-500/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent-500/15 text-accent-300">
                <Target size={16} />
              </div>
              <div>
                <p className="section-title">YouthBiz Intelligence · Next Best Action</p>
              </div>
            </div>
            {nba ? (
              <>
                <h3 className="mt-3 text-lg font-semibold text-slate-100">{nba.title}</h3>
                <p className="mt-1.5 text-sm text-slate-400">{nba.detail}</p>
                {nba.action && (
                  <button
                    onClick={() => onNavigate(nba.action!.page as Page)}
                    className="btn-primary mt-4"
                  >
                    {nba.action.label} <ArrowRight size={15} />
                  </button>
                )}
              </>
            ) : (
              <p className="mt-3 text-sm text-slate-400">No actions pending.</p>
            )}
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Business health" value={`${score}/100`} icon={Activity} accent="blue" />
        <StatCard
          label="Cash position"
          value={`R${balance.toLocaleString('en-ZA')}`}
          icon={Wallet}
          accent={balance >= 0 ? 'green' : 'rose'}
        />
        <StatCard label="Open tasks" value={String(open.length)} icon={CheckSquare} accent="cyan" />
        <StatCard label="Potential customers" value={String(customers)} icon={Users} accent="amber" />
      </div>

      {/* Quick actions */}
      <div className="card p-5">
        <p className="section-title mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <QuickButton icon={Plus} label="Add task" onClick={() => setTaskOpen(true)} />
          <QuickButton icon={Wallet} label="Add transaction" onClick={() => setTxOpen(true)} />
          <QuickButton icon={Users} label="Add customer" onClick={() => setCustOpen(true)} />
          <QuickButton icon={Sparkles} label="Ask Advisor" onClick={() => onNavigate('advisor')} />
        </div>
      </div>

      {/* Momentum + Recent finance */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="section-title">Business Momentum</p>
            <TrendingUp size={16} className="text-slate-500" />
          </div>
          <div className="space-y-4">
            {momentumData.map((m) => (
              <div key={m.key}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-slate-300">{m.label}</span>
                  <span className="font-semibold text-slate-100">{m.score}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-ink-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${m.score}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">{m.hint}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="section-title">Recent Finance Activity</p>
            <button
              onClick={() => onNavigate('finance')}
              className="text-xs font-medium text-accent-300 hover:text-accent-400"
            >
              View all
            </button>
          </div>
          {recentTx.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No transactions yet.</p>
          ) : (
            <ul className="space-y-1">
              {recentTx.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between rounded-lg px-2 py-2.5 hover:bg-ink-700/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-200">{t.description}</p>
                    <p className="text-xs text-slate-500">{formatDate(t.date)}</p>
                  </div>
                  <span
                    className={`ml-3 shrink-0 text-sm font-semibold ${
                      t.type === 'Income' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {t.type === 'Income' ? '+' : '−'} R{t.amount.toLocaleString('en-ZA')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <TaskModal open={taskOpen} onClose={() => setTaskOpen(false)} onSave={(t) => addTask(t)} />
      <TransactionModal open={txOpen} onClose={() => setTxOpen(false)} onSave={(t) => addTransaction(t)} />
      <CustomerModal open={custOpen} onClose={() => setCustOpen(false)} onSave={(c) => addCustomer(c)} />
    </div>
  );
}

function QuickButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Plus;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-xl border border-ink-700 bg-ink-850/60 px-3.5 py-3 text-sm font-medium text-slate-200 transition hover:border-accent-500/50 hover:bg-accent-500/5 hover:text-accent-200"
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-500/10 text-accent-300">
        <Icon size={16} />
      </span>
      {label}
    </button>
  );
}
