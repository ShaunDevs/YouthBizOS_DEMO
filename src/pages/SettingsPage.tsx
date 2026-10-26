import { useState } from 'react';
import { Save, Check, RotateCcw, Database, User as UserIcon, Briefcase } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { Field } from '@/components/ui/Field';

export function SettingsPage() {
  const { state, updateUser, resetDemo, clearAll } = useStore();
  const [name, setName] = useState(state.user.name);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSaveName = () => {
    updateUser({ name: name.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100 sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">Manage your name and demo data.</p>
      </div>

      <div className="card p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent-500/15 text-accent-300">
            <UserIcon size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">Your name</p>
            <p className="text-xs text-slate-500">Shown on the dashboard greeting.</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Field label="Name">
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                <Check size={15} /> Saved
              </span>
            )}
            <button onClick={handleSaveName} className="btn-primary">
              <Save size={16} /> Save
            </button>
          </div>
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-500/15 text-cyan-300">
            <Briefcase size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">Business information</p>
            <p className="text-xs text-slate-500">Edit this on the My Business page.</p>
          </div>
        </div>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <Row label="Business" value={state.business.name} />
          <Row label="Owner" value={state.business.owner} />
          <Row label="Category" value={state.business.category} />
          <Row label="Stage" value={state.business.stage} />
          <Row label="Location" value={state.business.location} />
          <Row label="Goal" value={state.business.goal} />
        </dl>
      </div>

      <div className="card p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-300">
            <Database size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">Data storage</p>
            <p className="text-xs text-slate-500">Where your demo data lives right now.</p>
          </div>
        </div>
        <div className="rounded-xl border border-ink-700/60 bg-ink-850/60 p-4 text-sm">
          <p className="text-slate-300">
            <span className="font-medium text-emerald-300">Local demo storage active.</span> Your data is saved in this
            browser only (localStorage), so it stays after a refresh. Nothing is sent to a server in this prototype.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            The data layer is structured so a real backend (e.g. Supabase) can be connected later without changing the
            app's UI.
          </p>
        </div>
      </div>

      <div className="card border-rose-500/20 p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-rose-500/15 text-rose-300">
            <RotateCcw size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">Reset demo data</p>
            <p className="text-xs text-slate-500">Restore the original FlowPrint sample data.</p>
          </div>
        </div>
        {!confirmReset ? (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setConfirmReset(true)} className="btn-outline">
              <RotateCcw size={16} /> Reset to demo data
            </button>
            <button
              onClick={() => {
                clearAll();
                setConfirmReset(false);
              }}
              className="btn-outline text-rose-300 hover:bg-rose-500/10"
            >
              Clear all data
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-300">Replace your current data with the FlowPrint sample?</span>
            <button
              onClick={() => {
                resetDemo();
                setConfirmReset(false);
              }}
              className="btn-primary"
            >
              Yes, reset
            </button>
            <button onClick={() => setConfirmReset(false)} className="btn-ghost">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-slate-200">{value || '—'}</dd>
    </div>
  );
}
