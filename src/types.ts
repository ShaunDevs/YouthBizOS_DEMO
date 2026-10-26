export type BusinessStage = 'Idea' | 'Early stage' | 'Operating' | 'Growing';
export type BusinessCategory =
  | 'Technology'
  | 'Food & Beverage'
  | 'Retail'
  | 'Services'
  | 'Creative'
  | 'Agriculture'
  | 'Education'
  | 'Other';
export type PrimaryGoal =
  | 'Get first customers'
  | 'Increase sales'
  | 'Improve finances'
  | 'Launch my product'
  | 'Find funding'
  | 'Grow my business';

export type TaskCategory = 'Strategy' | 'Sales' | 'Finance' | 'Marketing' | 'Operations';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate?: string; // ISO date
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export type TransactionType = 'Income' | 'Expense';
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string; // ISO date
  createdAt: string;
}

export type CustomerStatus = 'Lead' | 'Prospect' | 'Customer';
export interface Customer {
  id: string;
  name: string;
  contact?: string;
  status: CustomerStatus;
  potentialValue: number;
  notes?: string;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  type: string;
  description: string;
  matchPercent: number;
  deadline?: string;
  saved: boolean;
}

export interface User {
  name: string;
  email?: string;
}

export interface Business {
  name: string;
  owner: string;
  category: BusinessCategory;
  description: string;
  location: string;
  stage: BusinessStage;
  goal: PrimaryGoal;
}

export interface AppState {
  user: User;
  business: Business;
  tasks: Task[];
  transactions: Transaction[];
  customers: Customer[];
  opportunities: Opportunity[];
  onboarded: boolean;
}
