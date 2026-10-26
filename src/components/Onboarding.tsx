import { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Check, Zap } from 'lucide-react';
import type { Business, BusinessCategory, BusinessStage, PrimaryGoal, User } from '@/types';
import { Field } from '@/components/ui/Field';
import { useStore } from '@/store/StoreContext';

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

const STAGES: { value: BusinessStage; label: string; hint: string }[] = [
  { value: 'Idea', label: 'Idea', hint: 'You have a concept but nothing built yet.' },
  { value: 'Early stage', label: 'Early stage', hint: 'You are testing with your first users.' },
  { value: 'Operating', label: 'Operating', hint: 'You have active customers and revenue.' },
  { value: 'Growing', label: 'Growing', hint: 'You are scaling what works.' },
];

const GOALS: PrimaryGoal[] = [
  'Get first customers',
  'Increase sales',
  'Improve finances',
  'Launch my product',
  'Find funding',
  'Grow my business',
];

export function Onboarding({ onDone }: { onDone: () => void }) {
  const { completeOnboarding, resetDemo } = useStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [business, setBusiness] = useState<Omit<Business, 'owner'>>({
    name: '',
    category: 'Technology',
    description: '',
    location: '',
    stage: 'Idea',
    goal: 'Get first customers',
  });

  const totalSteps = 4;
  const canNext =
    step === 0
      ? name.trim().length > 0
      : step === 1
        ? business.name.trim().length > 0
        : step === 2
          ? business.description.trim().length > 0
          : true;

  const handleFinish = () => {
    completeOnboarding({ ...business, owner: name.trim() }, { name: name.trim() });
    onDone();
  };

  return (
    <div className="min-h-screen bg-ink-950 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-xl">
          <div className="mb-8 flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent-600/20 text-accent-400">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">YouthBiz OS</p>
              <p className="text-xs text-slate-500">Let's set up your business workspace</p>
            </div>
          </div>

          <div className="mb-8 flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? 'bg-accent-500' : 'bg-ink-700'
                }`}
              />
            ))}
          </div>

          <div className="card p-6 sm:p-8 animate-fadeIn">
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-100">Welcome to YouthBiz OS</h1>
                  <p className="mt-2 text-sm text-slate-400">
                    A simple workspace for young South African entrepreneurs. Let's get to know you and your business.
                  </p>
                </div>
                <Field label="What is your name?">
                  <input
                    autoFocus
                    className="input"
                    placeholder="e.g. Shaun"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>

                <div className="rounded-xl border border-accent-500/25 bg-accent-500/5 p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-500/15 text-accent-300">
                      <Zap size={17} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-100">Explore with a demo account</p>
                      <p className="mt-1 text-xs text-slate-400">
                        Skip setup and jump into a pre-built workspace for <span className="font-medium text-slate-300">FlowPrint</span>, a young Johannesburg tech startup — with sample tasks, money and customers already loaded.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          resetDemo();
                          onDone();
                        }}
                        className="btn-primary mt-3 w-full sm:w-auto"
                      >
                        <Zap size={15} /> Use demo account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">Tell us about your business</h2>
                  <p className="mt-1 text-sm text-slate-400">You can change any of this later.</p>
                </div>
                <Field label="Business name">
                  <input
                    className="input"
                    placeholder="e.g. FlowPrint"
                    value={business.name}
                    onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                  />
                </Field>
                <Field label="Category">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setBusiness({ ...business, category: c })}
                        className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition ${
                          business.category === c
                            ? 'border-accent-500 bg-accent-500/10 text-accent-300'
                            : 'border-ink-700 text-slate-300 hover:border-ink-600'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Location">
                  <input
                    className="input"
                    placeholder="e.g. Johannesburg, Gauteng"
                    value={business.location}
                    onChange={(e) => setBusiness({ ...business, location: e.target.value })}
                  />
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">What are you building?</h2>
                  <p className="mt-1 text-sm text-slate-400">A short description helps YouthBiz give you better advice.</p>
                </div>
                <Field label="Describe your business in 1-2 sentences">
                  <textarea
                    className="input min-h-[100px] resize-none"
                    placeholder="e.g. FlowPrint helps small businesses turn happy customers into a marketing channel with simple referral links."
                    value={business.description}
                    onChange={(e) => setBusiness({ ...business, description: e.target.value })}
                  />
                </Field>
                <Field label="What stage is your business at?">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {STAGES.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setBusiness({ ...business, stage: s.value })}
                        className={`rounded-xl border p-3 text-left transition ${
                          business.stage === s.value
                            ? 'border-accent-500 bg-accent-500/10'
                            : 'border-ink-700 hover:border-ink-600'
                        }`}
                      >
                        <p className={`text-sm font-medium ${business.stage === s.value ? 'text-accent-300' : 'text-slate-200'}`}>
                          {s.label}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">{s.hint}</p>
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">Pick your main goal</h2>
                  <p className="mt-1 text-sm text-slate-400">This becomes the focus for your Next Best Action.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {GOALS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setBusiness({ ...business, goal: g })}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition ${
                        business.goal === g
                          ? 'border-accent-500 bg-accent-500/10 text-accent-300'
                          : 'border-ink-700 text-slate-200 hover:border-ink-600'
                      }`}
                    >
                      {g}
                      {business.goal === g && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            {step > 0 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="btn-ghost"
              >
                <ArrowLeft size={16} /> Back
              </button>
            ) : (
              <span />
            )}
            {step < totalSteps - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext}
                className="btn-primary"
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={handleFinish} className="btn-primary">
                Open my workspace <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
