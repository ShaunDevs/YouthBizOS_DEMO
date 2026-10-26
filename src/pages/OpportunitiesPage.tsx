import { useState } from 'react';
import { Bookmark, BookmarkCheck, Compass, Calendar, Sparkles } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { formatDate } from '@/lib/logic';

export function OpportunitiesPage() {
  const { state, toggleSaveOpportunity } = useStore();
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const list = showSavedOnly ? state.opportunities.filter((o) => o.saved) : state.opportunities;
  const sorted = [...list].sort((a, b) => b.matchPercent - a.matchPercent);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100 sm:text-3xl">Opportunities</h1>
          <p className="mt-1 text-sm text-slate-400">
            Programmes, grants and competitions for young South African founders.
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-ink-700 bg-ink-850/60 p-1 self-start sm:self-auto">
          <button
            onClick={() => setShowSavedOnly(false)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              !showSavedOnly ? 'bg-accent-500/15 text-accent-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setShowSavedOnly(true)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              showSavedOnly ? 'bg-accent-500/15 text-accent-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Saved
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs text-amber-200/80">
        <Sparkles size={15} className="mt-0.5 shrink-0" />
        <p>
          These are demonstration opportunities for the hackathon prototype — not live, verified listings. In a real
          deployment, this list would come from a verified data source or API.
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="card p-10 text-center">
          <Compass size={28} className="mx-auto text-slate-600" />
          <p className="mt-3 text-sm text-slate-400">No saved opportunities yet. Tap the bookmark on any card to save it.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sorted.map((o) => (
            <div key={o.id} className="card flex flex-col p-5 card-hover">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="chip bg-accent-500/15 text-accent-300">{o.type}</span>
                  <h3 className="mt-2.5 text-base font-semibold text-slate-100">{o.title}</h3>
                </div>
                <button
                  onClick={() => toggleSaveOpportunity(o.id)}
                  className={`rounded-lg p-2 transition ${
                    o.saved
                      ? 'text-accent-300 hover:bg-accent-500/10'
                      : 'text-slate-500 hover:bg-ink-700/60 hover:text-slate-300'
                  }`}
                  aria-label={o.saved ? 'Remove from saved' : 'Save opportunity'}
                >
                  {o.saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                </button>
              </div>

              <p className="mt-2 flex-1 text-sm text-slate-400">{o.description}</p>

              {o.deadline && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar size={13} /> Closes {formatDate(o.deadline)}
                </p>
              )}

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Match for your business</span>
                  <span className="font-semibold text-accent-300">{o.matchPercent}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-500 to-cyan-400"
                    style={{ width: `${o.matchPercent}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => toggleSaveOpportunity(o.id)}
                className={`mt-4 ${o.saved ? 'btn-outline' : 'btn-primary'}`}
              >
                {o.saved ? 'Saved to workspace' : 'Save to workspace'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
