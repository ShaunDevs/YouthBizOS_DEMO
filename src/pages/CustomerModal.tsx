import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Field } from '@/components/ui/Field';
import type { Customer, CustomerStatus } from '@/types';

const STATUSES: CustomerStatus[] = ['Lead', 'Prospect', 'Customer'];

interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (c: Omit<Customer, 'id' | 'createdAt'>) => void;
}

export function CustomerModal({ open, onClose, onSave }: CustomerModalProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState<CustomerStatus>('Lead');
  const [potentialValue, setPotentialValue] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      setName('');
      setContact('');
      setStatus('Lead');
      setPotentialValue('');
      setNotes('');
    }
  }, [open]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      contact: contact.trim() || undefined,
      status,
      potentialValue: parseFloat(potentialValue) || 0,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add customer or lead"
      description="Track everyone who could become a paying customer."
      footer={
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={handleSave} disabled={!name.trim()} className="btn-primary">
            Add
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Customer / business name">
          <input
            autoFocus
            className="input"
            placeholder="e.g. Braam Cafe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label="Contact (optional)">
          <input
            className="input"
            placeholder="phone or email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Status">
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value as CustomerStatus)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Potential value (R)">
            <input
              type="number"
              min="0"
              className="input"
              placeholder="0"
              value={potentialValue}
              onChange={(e) => setPotentialValue(e.target.value)}
            />
          </Field>
        </div>
        <Field label="Notes (optional)">
          <textarea
            className="input min-h-[70px] resize-none"
            placeholder="How did you meet them? What do they need?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Field>
      </div>
    </Modal>
  );
}
