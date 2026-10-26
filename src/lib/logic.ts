import type { AppState, Task, Transaction, Customer, Business } from '@/types';

export interface Recommendation {
  id: string;
  title: string;
  detail: string;
  action?: {
    label: string;
    page: string;
    targetId?: string;
  };
  priority: 'low' | 'medium' | 'high';
}

const uid = () => Math.random().toString(36).slice(2, 9);

export function calcBalance(transactions: Transaction[]): number {
  return transactions.reduce((acc, t) => (t.type === 'Income' ? acc + t.amount : acc - t.amount), 0);
}
export function calcTotalIncome(transactions: Transaction[]): number {
  return transactions.filter((t) => t.type === 'Income').reduce((a, t) => a + t.amount, 0);
}
export function calcTotalExpenses(transactions: Transaction[]): number {
  return transactions.filter((t) => t.type === 'Expense').reduce((a, t) => a + t.amount, 0);
}

export function openTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => !t.completed);
}
export function completedTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.completed);
}
export function taskCompletionPct(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  return Math.round((completedTasks(tasks).length / tasks.length) * 100);
}

export function customerCounts(customers: Customer[]) {
  const leads = customers.filter((c) => c.status === 'Lead').length;
  const prospects = customers.filter((c) => c.status === 'Prospect').length;
  const paying = customers.filter((c) => c.status === 'Customer').length;
  return { leads, prospects, paying, total: customers.length };
}
export function potentialValue(customers: Customer[]): number {
  return customers.reduce((a, c) => a + (c.potentialValue || 0), 0);
}

export function profileCompletion(business: Business): number {
  const fields = [
    business.name,
    business.owner,
    business.category,
    business.description,
    business.location,
    business.stage,
    business.goal,
  ];
  const filled = fields.filter((v) => !!v && String(v).trim().length > 0).length;
  return Math.round((filled / fields.length) * 100);
}

// Business Health Score (0-100). Weighted blend of signals.
export function healthScore(state: AppState): number {
  const tasks = state.tasks;
  const tPct = taskCompletionPct(tasks); // 0-100
  const profile = profileCompletion(state.business); // 0-100
  const { total: customers } = customerCounts(state.customers);
  const balance = calcBalance(state.transactions);
  const hasTx = state.transactions.length > 0;

  // task progress 30%, profile 20%, customer activity 25%, finance activity 25%
  const customerScore = Math.min(100, customers * 25); // 4+ customers = full
  const financeScore = Math.min(100, (hasTx ? 40 : 0) + (balance >= 0 ? 60 : 20));

  const score = tPct * 0.3 + profile * 0.2 + customerScore * 0.25 + financeScore * 0.25;
  return Math.round(Math.max(0, Math.min(100, score)));
}

export function momentum(state: AppState) {
  const byCat = (cat: string) => state.tasks.filter((t) => t.category === cat);
  const catScore = (cat: string) => {
    const list = byCat(cat);
    if (list.length === 0) return 15; // nothing yet
    const done = list.filter((t) => t.completed).length;
    return Math.round((done / list.length) * 100);
  };
  const customers = customerCounts(state.customers);
  const balance = calcBalance(state.transactions);
  const income = calcTotalIncome(state.transactions);
  const expenses = calcTotalExpenses(state.transactions);

  return [
    {
      key: 'Strategy',
      label: 'Strategy',
      score: catScore('Strategy'),
      hint: 'Planning, positioning and your business model.',
    },
    {
      key: 'Sales',
      label: 'Sales',
      score: Math.min(100, customers.total * 30),
      hint: 'Leads, prospects and paying customers.',
    },
    {
      key: 'Finance',
      label: 'Finance',
      score: Math.min(100, (income > 0 ? 50 : 0) + (balance >= 0 ? 30 : 0) + (state.transactions.length > 2 ? 20 : 0)),
      hint: 'Income, expenses and cash position.',
    },
    {
      key: 'Operations',
      label: 'Operations',
      score: catScore('Operations'),
      hint: 'Day-to-day execution and admin.',
    },
  ];
}

export function nextBestAction(state: AppState): Recommendation | null {
  const open = openTasks(state.tasks);
  const highPriority = open.find((t) => t.priority === 'High') ?? open.find((t) => t.priority === 'Medium');
  const { total: customers, paying } = customerCounts(state.customers);
  const balance = calcBalance(state.transactions);
  const profile = profileCompletion(state.business);

  if (profile < 100) {
    return {
      id: uid(),
      title: 'Complete your business profile',
      detail: `Your profile is ${profile}% complete. A complete profile helps YouthBiz give you better recommendations.`,
      action: { label: 'Go to My Business', page: 'business' },
      priority: 'medium',
    };
  }
  if (customers === 0) {
    return {
      id: uid(),
      title: 'Validate with your first customers',
      detail: 'You have no customers or leads yet. Speak to at least five potential customers before building more.',
      action: { label: 'Add a customer', page: 'customers' },
      priority: 'high',
    };
  }
  if (balance < 0) {
    return {
      id: uid(),
      title: 'Review your costs and pricing',
      detail: 'Your expenses are higher than your income. Look at where you can cut costs and check your pricing.',
      action: { label: 'Open Finance', page: 'finance' },
      priority: 'high',
    };
  }
  if (highPriority) {
    return {
      id: uid(),
      title: highPriority.title,
      detail: `This is your highest priority ${highPriority.category.toLowerCase()} task.${
        highPriority.dueDate ? ` Due ${formatDate(highPriority.dueDate)}.` : ''
      } Finishing it will move your business forward.`,
      action: { label: 'Open Tasks', page: 'tasks', targetId: highPriority.id },
      priority: highPriority.priority === 'High' ? 'high' : 'medium',
    };
  }
  if (state.business.goal === 'Find funding') {
    return {
      id: uid(),
      title: 'Review relevant funding opportunities',
      detail: 'Your goal is to find funding. Look at the saved opportunities for grants and programmes that match your stage.',
      action: { label: 'See Opportunities', page: 'opportunities' },
      priority: 'medium',
    };
  }
  if (paying > 0 && customers > paying) {
    return {
      id: uid(),
      title: 'Follow up with your prospects',
      detail: `You have ${customers - paying} prospects in your pipeline. Follow up with them to turn prospects into customers.`,
      action: { label: 'Open Customers', page: 'customers' },
      priority: 'medium',
    };
  }
  return {
    id: uid(),
    title: 'Add your next task',
    detail: 'No open tasks right now. Add the next step that will move your business forward.',
    action: { label: 'Add a task', page: 'tasks' },
    priority: 'low',
  };
}

export function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}
export function relativeDue(iso: string): { label: string; overdue: boolean; soon: boolean } {
  const due = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, overdue: true, soon: false };
  if (diff === 0) return { label: 'Due today', overdue: false, soon: true };
  if (diff === 1) return { label: 'Due tomorrow', overdue: false, soon: true };
  if (diff <= 7) return { label: `In ${diff} days`, overdue: false, soon: true };
  return { label: formatDate(iso), overdue: false, soon: false };
}
