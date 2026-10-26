import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type {
  AppState,
  Business,
  Customer,
  Opportunity,
  Task,
  Transaction,
  User,
} from '@/types';
import { loadState, saveState, clearState } from '@/lib/storage';
import { createSampleState, SAMPLE_OPPORTUNITIES } from '@/lib/sampleData';

const uid = () => Math.random().toString(36).slice(2, 10);

interface StoreValue {
  state: AppState;
  // business/user
  updateUser: (patch: Partial<User>) => void;
  updateBusiness: (patch: Partial<Business>) => void;
  completeOnboarding: (business: Business, user: User) => void;
  resetDemo: () => void;
  clearAll: () => void;
  // tasks
  addTask: (t: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  // transactions
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  // customers
  addCustomer: (c: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  // opportunities
  toggleSaveOpportunity: (id: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function ensureOpportunities(state: AppState): AppState {
  // Make sure the seed opportunities always exist (so freshly onboarded users see them too).
  const existing = new Set(state.opportunities.map((o) => o.id));
  const merged = [...state.opportunities];
  for (const o of SAMPLE_OPPORTUNITIES) {
    if (!existing.has(o.id)) merged.push({ ...o });
  }
  return { ...state, opportunities: merged };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const loaded = loadState();
    if (loaded) return ensureOpportunities(loaded);
    return createSampleState();
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  const updateUser = useCallback((patch: Partial<User>) => {
    setState((s) => ({ ...s, user: { ...s.user, ...patch } }));
  }, []);

  const updateBusiness = useCallback((patch: Partial<Business>) => {
    setState((s) => ({ ...s, business: { ...s.business, ...patch } }));
  }, []);

  const completeOnboarding = useCallback((business: Business, user: User) => {
    setState((s) => ({ ...s, business, user, onboarded: true }));
  }, []);

  const resetDemo = useCallback(() => {
    setState(createSampleState());
  }, []);

  const clearAll = useCallback(() => {
    clearState();
    setState(createSampleState());
  }, []);

  const addTask = useCallback((t: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    setState((s) => ({
      ...s,
      tasks: [
        { ...t, id: uid(), completed: false, createdAt: new Date().toISOString() },
        ...s.tasks,
      ],
    }));
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : undefined,
            }
          : t,
      ),
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
  }, []);

  const addTransaction = useCallback((t: Omit<Transaction, 'id' | 'createdAt'>) => {
    setState((s) => ({
      ...s,
      transactions: [
        { ...t, id: uid(), createdAt: new Date().toISOString() },
        ...s.transactions,
      ],
    }));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setState((s) => ({ ...s, transactions: s.transactions.filter((t) => t.id !== id) }));
  }, []);

  const addCustomer = useCallback((c: Omit<Customer, 'id' | 'createdAt'>) => {
    setState((s) => ({
      ...s,
      customers: [{ ...c, id: uid(), createdAt: new Date().toISOString() }, ...s.customers],
    }));
  }, []);

  const updateCustomer = useCallback((id: string, patch: Partial<Customer>) => {
    setState((s) => ({
      ...s,
      customers: s.customers.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }, []);

  const deleteCustomer = useCallback((id: string) => {
    setState((s) => ({ ...s, customers: s.customers.filter((c) => c.id !== id) }));
  }, []);

  const toggleSaveOpportunity = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      opportunities: s.opportunities.map((o) =>
        o.id === id ? { ...o, saved: !o.saved } : o,
      ),
    }));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      state,
      updateUser,
      updateBusiness,
      completeOnboarding,
      resetDemo,
      clearAll,
      addTask,
      updateTask,
      toggleTask,
      deleteTask,
      addTransaction,
      deleteTransaction,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      toggleSaveOpportunity,
    }),
    [
      state,
      updateUser,
      updateBusiness,
      completeOnboarding,
      resetDemo,
      clearAll,
      addTask,
      updateTask,
      toggleTask,
      deleteTask,
      addTransaction,
      deleteTransaction,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      toggleSaveOpportunity,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
