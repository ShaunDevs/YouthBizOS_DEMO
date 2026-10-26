import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Field } from '@/components/ui/Field';
import type { Transaction, TransactionType } from '@/types';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

export function TransactionModal({ open, onClose, onSave }: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>('Income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (open) {
      setType('Income');
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [open]);

  const handleSave = () => {
    const amt = parseFloat(amount);
    if (!description.trim() || isNaN(amt) || amt <= 0) return;
    onSave({
      type,
      amount: amt,
      description: description.trim(),
      date: date || new Date().toISOString().slice(0, 10),
    });
    onClose();
  };

  const valid = description.trim() && parseFloat(amount) > 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add transaction"
      description="Record income or an expense for your business."
      footer={
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={handleSave} disabled={!valid} className="btn-primary">
            Add transaction
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Type">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('Income')}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                type === 'Income'
                  ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300'
                  : 'border-ink-700 text-slate-300 hover:border-ink-600'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setType('Expense')}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                type === 'Expense'
                  ? 'border-rose-500/60 bg-rose-500/10 text-rose-300'
                  : 'border-ink-700 text-slate-300 hover:border-ink-600'
              }`}
            >
              Expense
            </button>
          </div>
        </Field>
        <Field label="Amount (R)">
          <input
            type="number"
            min="0"
            step="0.01"
            className="input"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Field>
        <Field label="Description">
          <input
            className="input"
            placeholder="e.g. First paying customer — Pro plan"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <Field label="Date">
          <input
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
      </div>
    </Modal>
  );
}
