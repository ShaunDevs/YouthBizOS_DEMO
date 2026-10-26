import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Field } from '@/components/ui/Field';
import type { Task, TaskCategory, TaskPriority } from '@/types';

const CATEGORIES: TaskCategory[] = ['Strategy', 'Sales', 'Finance', 'Marketing', 'Operations'];
const PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High'];

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (t: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  initial?: Task;
}

export function TaskModal({ open, onClose, onSave, initial }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Strategy');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? '');
      setNotes(initial?.notes ?? '');
      setCategory(initial?.category ?? 'Strategy');
      setPriority(initial?.priority ?? 'Medium');
      setDueDate(initial?.dueDate ?? '');
    }
  }, [open, initial]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      notes: notes.trim() || undefined,
      category,
      priority,
      dueDate: dueDate || undefined,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit task' : 'New task'}
      description="Add the next step that moves your business forward."
      footer={
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={handleSave} disabled={!title.trim()} className="btn-primary">
            {initial ? 'Save changes' : 'Add task'}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Task title">
          <input
            autoFocus
            className="input"
            placeholder="e.g. Interview 5 potential customers"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
        <Field label="Notes (optional)">
          <textarea
            className="input min-h-[70px] resize-none"
            placeholder="Any details, links or context..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Category">
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Priority">
            <select className="input" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Due date (optional)">
          <input
            type="date"
            className="input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </Field>
      </div>
    </Modal>
  );
}
