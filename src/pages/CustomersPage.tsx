import { useMemo, useState } from 'react';
import { Plus, Trash2, Users, Mail, ChevronDown } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { customerCounts, potentialValue } from '@/lib/logic';
import { CustomerModal } from '@/pages/CustomerModal';
import type { CustomerStatus } from '@/types';

const STATUS_STYLES: Record<CustomerStatus, string> = {
  Lead: 'bg-slate-500/15 text-slate-300',
  Prospect: 'bg-amber-500/15 text-amber-300',
  Customer: 'bg-emerald-500/15 text-emerald-300',
};
const NEXT_STATUS: Record<CustomerStatus, CustomerStatus | null> = {
  Lead: 'Prospect',
  Prospect: 'Customer',
  Customer: null,
};

export function CustomersPage() {
  const { state, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const [open, setOpen] = useState(false);

  const counts = customerCounts(state.customers);
  const pipelineValue = potentialValue(state.customers);

  const sorted = useMemo(
    () => [...state.customers].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [state.customers],
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100 sm:text-3xl">Customers</h1>
          <p className="mt-1 text-sm text-slate-400">Track leads, prospects and paying customers.</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary self-start sm:self-auto">
          <Plus size={16} /> Add customer
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard label="Leads" value={counts.leads} tone="slate" />
        <SummaryCard label="Prospects" value={counts.prospects} tone="amber" />
        <SummaryCard label="Customers" value={counts.paying} tone="emerald" />
        <SummaryCard label="Pipeline value" value={`R${pipelineValue.toLocaleString('en-ZA')}`} tone="accent" />
      </div>

      {/* List */}
      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="section-title">All customers & leads</p>
          <span className="text-xs text-slate-500">{state.customers.length} total</span>
        </div>
        {sorted.length === 0 ? (
          <div className="py-10 text-center">
            <Users size={28} className="mx-auto text-slate-600" />
            <p className="mt-3 text-sm text-slate-400">No customers yet. Add your first lead to start your pipeline.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {sorted.map((c) => {
              const next = NEXT_STATUS[c.status];
              return (
                <li key={c.id} className="rounded-xl border border-ink-700/60 bg-ink-850/60 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-100">{c.name}</p>
                        <span className={`chip ${STATUS_STYLES[c.status]}`}>{c.status}</span>
                      </div>
                      {c.contact && (
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                          <Mail size={12} /> {c.contact}
                        </p>
                      )}
                      {c.notes && <p className="mt-1 text-xs text-slate-500">{c.notes}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Potential value</p>
                      <p className="text-sm font-semibold text-slate-200">R{c.potentialValue.toLocaleString('en-ZA')}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <select
                      value={c.status}
                      onChange={(e) => updateCustomer(c.id, { status: e.target.value as CustomerStatus })}
                      className="input max-w-[150px] py-1.5 text-xs"
                    >
                      <option value="Lead">Lead</option>
                      <option value="Prospect">Prospect</option>
                      <option value="Customer">Customer</option>
                    </select>
                    {next && (
                      <button
                        onClick={() => updateCustomer(c.id, { status: next })}
                        className="btn-outline px-3 py-1.5 text-xs"
                      >
                        Move to {next} <ChevronDown size={13} className="-mr-1 rotate-[-90deg]" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteCustomer(c.id)}
                      className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400"
                      aria-label="Delete customer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <CustomerModal open={open} onClose={() => setOpen(false)} onSave={(c) => addCustomer(c)} />
    </div>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: string | number; tone: string }) {
  const tones: Record<string, string> = {
    slate: 'text-slate-200',
    amber: 'text-amber-300',
    emerald: 'text-emerald-300',
    accent: 'text-accent-300',
  };
  return (
    <div className="card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1.5 text-xl font-semibold ${tones[tone]}`}>{value}</p>
    </div>
  );
}
