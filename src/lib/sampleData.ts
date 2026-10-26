import type { AppState, Opportunity } from '@/types';

export const SAMPLE_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Youth Innovation Challenge',
    type: 'Competition',
    description:
      'A national challenge for founders under 30 building tech solutions. Cash prize and exposure to investors.',
    matchPercent: 92,
    deadline: '2026-11-30',
    saved: false,
  },
  {
    id: 'opp-2',
    title: 'Student Entrepreneur Programme',
    type: 'Programme',
    description:
      'A 12-week programme giving student founders mentorship, a small grant, and a place to pilot their product.',
    matchPercent: 81,
    deadline: '2026-12-15',
    saved: false,
  },
  {
    id: 'opp-3',
    title: 'Small Business Digital Grant',
    type: 'Grant',
    description:
      'A government-backed grant helping small businesses get online with a website, payment tools, and marketing credit.',
    matchPercent: 74,
    deadline: '2027-01-20',
    saved: false,
  },
  {
    id: 'opp-4',
    title: 'FNB Entrepreneurship Competition',
    type: 'Competition',
    description:
      'Pitch your business to a panel of judges for funding, mentorship and a place in an accelerator cohort.',
    matchPercent: 88,
    deadline: '2026-11-10',
    saved: false,
  },
  {
    id: 'opp-5',
    title: 'Mentorship Programme',
    type: 'Mentorship',
    description:
      'Get matched with an experienced entrepreneur in your industry for 6 months of guided mentorship.',
    matchPercent: 69,
    deadline: '2026-12-01',
    saved: false,
  },
  {
    id: 'opp-6',
    title: 'Township Tech Accelerator',
    type: 'Accelerator',
    description:
      'A 3-month accelerator for founders building solutions for township and emerging-market consumers.',
    matchPercent: 77,
    deadline: '2027-02-28',
    saved: false,
  },
];

export function createSampleState(): AppState {
  const now = new Date();
  const isoDays = (d: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() + d);
    return date.toISOString().slice(0, 10);
  };
  const isoMinus = (days: number) => isoDays(-days);

  return {
    onboarded: true,
    user: {
      name: 'Shaun',
    },
    business: {
      name: 'FlowPrint',
      owner: 'Shaun',
      category: 'Technology',
      description:
        'FlowPrint helps small businesses turn repeat customers into a marketing channel. We build simple referral links that reward customers for sharing products they already love.',
      location: 'Johannesburg, Gauteng',
      stage: 'Early stage',
      goal: 'Get first customers',
    },
    tasks: [
      {
        id: 't1',
        title: 'Interview 5 potential customers',
        category: 'Strategy',
        priority: 'High',
        dueDate: isoDays(2),
        completed: false,
        createdAt: isoMinus(3),
        notes: 'Focus on cafes and small online stores. Ask about how they currently get referrals.',
      },
      {
        id: 't2',
        title: 'Create a simple pricing model',
        category: 'Finance',
        priority: 'High',
        dueDate: isoDays(4),
        completed: false,
        createdAt: isoMinus(2),
        notes: 'Free tier + R99/mo Pro tier with branded referral pages.',
      },
      {
        id: 't3',
        title: 'Set up a basic landing page',
        category: 'Marketing',
        priority: 'Medium',
        dueDate: isoDays(6),
        completed: true,
        completedAt: isoMinus(1),
        createdAt: isoMinus(6),
      },
      {
        id: 't4',
        title: 'Register the business name',
        category: 'Operations',
        priority: 'Medium',
        dueDate: isoDays(10),
        completed: true,
        completedAt: isoMinus(2),
        createdAt: isoMinus(8),
      },
      {
        id: 't5',
        title: 'Draft a 1-page business plan',
        category: 'Strategy',
        priority: 'Medium',
        dueDate: isoDays(1),
        completed: false,
        createdAt: isoMinus(1),
        notes: 'Problem, solution, customer, revenue, next milestone.',
      },
    ],
    transactions: [
      {
        id: 'tx1',
        type: 'Income',
        amount: 1500,
        description: 'First paying customer — Pro plan (3 months)',
        date: isoMinus(4),
        createdAt: isoMinus(4),
      },
      {
        id: 'tx2',
        type: 'Expense',
        amount: 280,
        description: 'Domain + hosting (1 year)',
        date: isoMinus(5),
        createdAt: isoMinus(5),
      },
      {
        id: 'tx3',
        type: 'Expense',
        amount: 450,
        description: 'Logo design + brand colours',
        date: isoMinus(8),
        createdAt: isoMinus(8),
      },
      {
        id: 'tx4',
        type: 'Income',
        amount: 600,
        description: 'Two referral setups for a cafe',
        date: isoMinus(2),
        createdAt: isoMinus(2),
      },
      {
        id: 'tx5',
        type: 'Expense',
        amount: 120,
        description: 'Social media ad test',
        date: isoMinus(1),
        createdAt: isoMinus(1),
      },
    ],
    customers: [
      {
        id: 'c1',
        name: 'Braam Cafe',
        contact: 'owner@braamcafe.co.za',
        status: 'Customer',
        potentialValue: 2400,
        notes: 'Already paying. Wants to roll out to second branch.',
        createdAt: isoMinus(4),
      },
      {
        id: 'c2',
        name: 'Lerato (online store)',
        contact: 'lerato@gmail.com',
        status: 'Prospect',
        potentialValue: 1200,
        notes: 'Saw the landing page, wants a demo next week.',
        createdAt: isoMinus(3),
      },
      {
        id: 'c3',
        name: 'Tshepo (barber shop)',
        status: 'Lead',
        potentialValue: 900,
        notes: 'Met at a market, interested in referrals.',
        createdAt: isoMinus(1),
      },
    ],
    opportunities: SAMPLE_OPPORTUNITIES.map((o) => ({ ...o })),
  };
}
