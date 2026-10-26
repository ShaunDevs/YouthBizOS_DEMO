import { useEffect, useState } from 'react';
import { Save, Check, Briefcase, Target, MapPin, Sparkles } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { Field } from '@/components/ui/Field';
import type { BusinessCategory, BusinessStage, PrimaryGoal } from '@/types';

const CATEGORIES: BusinessCategory[] = [
  'Technology',
  'Food & Beverage',
  'Retail',
  'Services',
  'Creative',
  'Agriculture',
  'Education',
  'Other',
];
const STAGES: BusinessStage[] = ['Idea', 'Early stage', 'Operating', 'Growing'];
const GOALS: PrimaryGoal[] = [
  'Get first customers',
  'Increase sales',
  'Improve finances',
  'Launch my product',
  'Find funding',
  'Grow my business',
];

export function BusinessPage() {
  const { state, updateBusiness } = useStore();
  const [form, setForm] = useState(state.business);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(state.business);
  }, [state.business]);

  const handleSave = () => {
    updateBusiness(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Readiness checklist — derived from actual business data + tasks/customers.
  const readiness = [
    {
      label: 'Clear customer problem',
      done: form.description.trim().length > 30,
      hint: 'Write a description that explains the problem you solve.',
    },
    {
      label: 'Defined target market',
      done: form.location.trim().length > 0 && form.category.length > 0,
      hint: 'Add your location and category.',
    },
    {
      label: 'Pricing model',
      done: state.tasks.some((t) => /price|pricing/i.test(t.title)),
      hint: 'Create a task called "Create a simple pricing model".',
    },
    {
      label: 'Sales process',
      done: state.customers.length > 0,
      hint: 'Add at least one customer or lead.',
    },
    {
      label: 'Growth goal',
      done: !!form.goal,
      hint: 'Pick a primary goal.',
    },
  ];

  const completedCount = readiness.filter((r) => r.done).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100 sm:text-3xl">My Business</h1>
        <p className="mt-1 text-sm text-slate-400">Your business profile and readiness.</p>
      </div>

      <div className="card p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent-500/15 text-accent-300">
            <Briefcase size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">Business profile</p>
            <p className="text-xs text-slate-500">Edit any field and save.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Business name">
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Owner">
            <input className="input" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
          </Field>
          <Field label="Category">
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as BusinessCategory })}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Location">
            <div className="relative">
              <MapPin size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input className="input pl-9" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </Field>
          <Field label="Stage">
            <select className="input" value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value as BusinessStage })}>
              {STAGES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Primary goal">
            <div className="relative">
              <Target size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <select className="input pl-9" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value as PrimaryGoal })}>
                {GOALS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Description">
              <textarea
                className="input min-h-[90px] resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-400 animate-fadeIn">
              <Check size={15} /> Saved
            </span>
          )}
          <button onClick={handleSave} className="btn-primary">
            <Save size={16} /> Save changes
          </button>
        </div>
      </div>

      {/* Readiness checklist */}
      <div className="card p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-500/15 text-cyan-300">
            <Sparkles size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-100">Business readiness checklist</p>
            <p className="text-xs text-slate-500">Updates as you add real data to your workspace.</p>
          </div>
          <span className="chip bg-accent-500/10 text-accent-300">{completedCount}/{readiness.length} done</span>
        </div>

        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-ink-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${(completedCount / readiness.length) * 100}%` }}
          />
        </div>

        <ul className="space-y-1">
          {readiness.map((r) => (
            <li
              key={r.label}
              className={`flex items-start gap-3 rounded-xl px-3 py-3 transition ${
                r.done ? 'bg-emerald-500/5' : 'bg-ink-850/60'
              }`}
            >
              <span
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                  r.done ? 'bg-emerald-500/20 text-emerald-300' : 'border border-ink-600 text-slate-600'
                }`}
              >
                {r.done && <Check size={12} />}
              </span>
              <div>
                <p className={`text-sm font-medium ${r.done ? 'text-slate-200' : 'text-slate-300'}`}>{r.label}</p>
                {!r.done && <p className="mt-0.5 text-xs text-slate-500">{r.hint}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
