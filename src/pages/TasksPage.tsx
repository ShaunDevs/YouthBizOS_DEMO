import { useMemo, useState } from 'react';
import { Plus, Check, Pencil, Trash2, CheckCircle2, Circle, Filter } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { taskCompletionPct, openTasks, completedTasks, relativeDue, formatDate } from '@/lib/logic';
import { TaskModal } from '@/pages/TaskModal';
import type { Task, TaskCategory } from '@/types';

const CATEGORIES: TaskCategory[] = ['Strategy', 'Sales', 'Finance', 'Marketing', 'Operations'];
const PRIORITY_STYLES: Record<string, string> = {
  High: 'bg-rose-500/15 text-rose-300',
  Medium: 'bg-amber-500/15 text-amber-300',
  Low: 'bg-slate-500/15 text-slate-300',
};
const CAT_STYLES: Record<string, string> = {
  Strategy: 'bg-accent-500/15 text-accent-300',
  Sales: 'bg-emerald-500/15 text-emerald-300',
  Finance: 'bg-cyan-500/15 text-cyan-300',
  Marketing: 'bg-amber-500/15 text-amber-300',
  Operations: 'bg-violet-500/15 text-violet-300',
};

type Filter = 'all' | 'open' | 'completed';
type CatFilter = 'All' | TaskCategory;

export function TasksPage() {
  const { state, addTask, updateTask, toggleTask, deleteTask } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Task | undefined>(undefined);
  const [filter, setFilter] = useState<Filter>('open');
  const [catFilter, setCatFilter] = useState<CatFilter>('All');

  const pct = taskCompletionPct(state.tasks);
  const open = openTasks(state.tasks);
  const done = completedTasks(state.tasks);

  const visible = useMemo(() => {
    let list = state.tasks;
    if (filter === 'open') list = list.filter((t) => !t.completed);
    if (filter === 'completed') list = list.filter((t) => t.completed);
    if (catFilter !== 'All') list = list.filter((t) => t.category === catFilter);
    return [...list].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const pri = { High: 0, Medium: 1, Low: 2 };
      if (pri[a.priority] !== pri[b.priority]) return pri[a.priority] - pri[b.priority];
      if (a.dueDate && b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
      return 0;
    });
  }, [state.tasks, filter, catFilter]);

  const openEdit = (t: Task) => {
    setEditTarget(t);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100 sm:text-3xl">Tasks</h1>
          <p className="mt-1 text-sm text-slate-400">Plan and track what needs to happen next.</p>
        </div>
        <button
          onClick={() => {
            setEditTarget(undefined);
            setModalOpen(true);
          }}
          className="btn-primary self-start sm:self-auto"
        >
          <Plus size={16} /> Add task
        </button>
      </div>

      {/* Summary */}
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="section-title">Completion</p>
            <p className="mt-1 text-2xl font-semibold text-slate-100">{pct}%</p>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="chip bg-ink-700/60 text-slate-300">{open.length} open</span>
            <span className="chip bg-emerald-500/15 text-emerald-300">{done.length} done</span>
          </div>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-ink-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-xl border border-ink-700 bg-ink-850/60 p-1">
          {(['all', 'open', 'completed'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
                filter === f ? 'bg-accent-500/15 text-accent-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-ink-700 bg-ink-850/60 p-1">
          <Filter size={14} className="ml-1 text-slate-500" />
          {(['All', ...CATEGORIES] as CatFilter[]).map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                catFilter === c ? 'bg-accent-500/15 text-accent-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Task list */}
      {visible.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-sm text-slate-400">No tasks here yet. Add your first task to get started.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {visible.map((t) => {
            const due = t.dueDate ? relativeDue(t.dueDate) : null;
            return (
              <li
                key={t.id}
                className={`card flex items-start gap-3 p-4 transition ${
                  t.completed ? 'opacity-60' : ''
                }`}
              >
                <button
                  onClick={() => toggleTask(t.id)}
                  className={`mt-0.5 shrink-0 ${t.completed ? 'text-emerald-400' : 'text-slate-500 hover:text-accent-400'}`}
                  aria-label={t.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {t.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={`text-sm font-medium ${t.completed ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
                      {t.title}
                    </p>
                    <span className={`chip ${CAT_STYLES[t.category]}`}>{t.category}</span>
                    <span className={`chip ${PRIORITY_STYLES[t.priority]}`}>{t.priority}</span>
                  </div>
                  {t.notes && <p className="mt-1 text-xs text-slate-500">{t.notes}</p>}
                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    {due && (
                      <span className={due.overdue && !t.completed ? 'text-rose-400' : due.soon && !t.completed ? 'text-amber-400' : ''}>
                        {due.label}
                      </span>
                    )}
                    {t.completed && t.completedAt && (
                      <span className="text-emerald-400/80">Completed {formatDate(t.completedAt)}</span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => openEdit(t)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-ink-700/60 hover:text-slate-200"
                    aria-label="Edit task"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
                    aria-label="Delete task"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(t) => {
          if (editTarget) updateTask(editTarget.id, t);
          else addTask(t);
        }}
        initial={editTarget}
      />
    </div>
  );
}
