import { useMemo, useState } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { calcBalance, calcTotalIncome, calcTotalExpenses, formatDate } from '@/lib/logic';
import { TransactionModal } from '@/pages/TransactionModal';

export function FinancePage() {
  const { state, addTransaction, deleteTransaction } = useStore();
  const [open, setOpen] = useState(false);

  const income = calcTotalIncome(state.transactions);
  const expenses = calcTotalExpenses(state.transactions);
  const balance = calcBalance(state.transactions);

  const sorted = useMemo(
    () => [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [state.transactions],
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100 sm:text-3xl">Finance</h1>
          <p className="mt-1 text-sm text-slate-400">A simple view of your business money. This is not a banking product.</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary self-start sm:self-auto">
          <Plus size={16} /> Add transaction
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="section-title">Total income</p>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-300">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-semibold text-emerald-300">R{income.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="section-title">Total expenses</p>
            <div className="rounded-lg bg-rose-500/10 p-2 text-rose-300">
              <TrendingDown size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-semibold text-rose-300">R{expenses.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="section-title">Current balance</p>
            <div className="rounded-lg bg-accent-500/10 p-2 text-accent-300">
              <Wallet size={16} />
            </div>
          </div>
          <p className={`mt-2 text-2xl font-semibold ${balance >= 0 ? 'text-slate-100' : 'text-rose-300'}`}>
            R{balance.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-xs text-slate-500">Income − expenses</p>
        </div>
      </div>

      {/* Transaction list */}
      <div className="card p-5">
        <p className="section-title mb-3">All transactions</p>
        {sorted.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">No transactions yet. Add your first income or expense.</p>
        ) : (
          <ul className="divide-y divide-ink-700/50">
            {sorted.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-3">
                <div
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                    t.type === 'Income' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'
                  }`}
                >
                  {t.type === 'Income' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-slate-200">{t.description}</p>
                  <p className="text-xs text-slate-500">{formatDate(t.date)} · {t.type}</p>
                </div>
                <span
                  className={`shrink-0 text-sm font-semibold ${
                    t.type === 'Income' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {t.type === 'Income' ? '+' : '−'} R{t.amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <button
                  onClick={() => deleteTransaction(t.id)}
                  className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400"
                  aria-label="Delete transaction"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <TransactionModal open={open} onClose={() => setOpen(false)} onSave={(t) => addTransaction(t)} />
    </div>
  );
}
