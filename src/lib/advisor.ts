import type { AppState } from '@/types';
import {
  calcBalance,
  calcTotalIncome,
  calcTotalExpenses,
  openTasks,
  customerCounts,
  profileCompletion,
} from '@/lib/logic';

export interface AdvisorAnswer {
  text: string;
  bullets: string[];
  nextStep: string;
}

interface Rule {
  match: (q: string) => boolean;
  answer: (state: AppState) => AdvisorAnswer;
}

const fmtMoney = (n: number) => `R${Math.abs(n).toLocaleString('en-ZA')}`;

const rules: Rule[] = [
  {
    match: (q) => /first customer|get customer|find customer|customer validation|first sale/i.test(q),
    answer: (state) => {
      const { total } = customerCounts(state.customers);
      if (total === 0) {
        return {
          text: 'Your next priority should be customer validation. Speak to at least five potential customers before spending heavily on marketing or development.',
          bullets: [
            'List 10 people who could use what you sell and message 5 this week.',
            'Ask what they do today, what frustrates them, and what they would pay for.',
            'Add each one as a Lead in Customers so you can track follow-ups.',
          ],
          nextStep: 'Add your first 3 leads in the Customers tab.',
        };
      }
      return {
        text: `You already have ${total} potential customers. Focus on turning leads into paying customers with a clear offer and a simple reason to buy now.`,
        bullets: [
          'Pick the 2 most interested leads and offer them a small first deal.',
          'Set a deadline to create urgency (e.g. first 5 customers get a launch price).',
          'Ask every customer for a referral or testimonial.',
        ],
        nextStep: 'Create a "Follow up with hot leads" task in the Tasks tab.',
      };
    },
  },
  {
    match: (q) => /price|pricing|how much|charge/i.test(q),
    answer: (state) => {
      const income = calcTotalIncome(state.transactions);
      if (income === 0) {
        return {
          text: 'Start simple. Pick a price based on the value you create for the customer, not just your costs. Test it with a few customers and adjust.',
          bullets: [
            'Estimate the value or time you save your customer per month.',
            'Set your price at 10-30% of that value so it feels like a clear win.',
            'Offer one simple package first — avoid confusing options.',
          ],
          nextStep: 'Create a "Create a simple pricing model" task.',
        };
      }
      return {
        text: `You have made ${fmtMoney(income)} so far. Use that data to test whether your price feels fair and whether customers will pay more.`,
        bullets: [
          'Look at what each customer paid and why.',
          'Try a small price increase with your next 2 customers.',
          'Keep the price simple and easy to explain in one sentence.',
        ],
        nextStep: 'Add a pricing review task in the Tasks tab.',
      };
    },
  },
  {
    match: (q) => /market|marketing|advertise|promote|get the word out/i.test(q),
    answer: (state) => {
      const { total } = customerCounts(state.customers);
      return {
        text:
          total < 3
            ? 'Before you spend on marketing, make sure a few people already want what you sell. Word of mouth from happy customers beats paid ads for an early-stage business.'
            : 'You have early customers — now build a simple, repeatable way to reach more of them. Pick one channel and do it consistently for a month.',
        bullets: [
          'Choose ONE channel your customers already use (WhatsApp, Instagram, local markets).',
          'Post or message consistently for 30 days before judging it.',
          'Ask every happy customer to tell one other person.',
        ],
        nextStep: 'Add a "Pick one marketing channel" task.',
      };
    },
  },
  {
    match: (q) => /focus on next|what next|next step|what should i do|priority/i.test(q),
    answer: (state) => {
      const profile = profileCompletion(state.business);
      const open = openTasks(state.tasks);
      const high = open.find((t) => t.priority === 'High');
      const { total } = customerCounts(state.customers);
      const balance = calcBalance(state.transactions);
      if (profile < 100) {
        return {
          text: `Your profile is only ${profile}% complete. Start there — a clear profile helps you (and YouthBiz) make better decisions.`,
          bullets: [
            'Fill in your business description and goal.',
            'Be specific about who your customer is.',
            'Save it, then come back to the dashboard.',
          ],
          nextStep: 'Open My Business and complete your profile.',
        };
      }
      if (total === 0) {
        return {
          text: 'Your next priority is customer validation. Talk to real people before building more.',
          bullets: [
            'Message 5 potential customers this week.',
            'Add them as leads in Customers.',
            'Note what they say they would pay for.',
          ],
          nextStep: 'Add your first lead in the Customers tab.',
        };
      }
      if (balance < 0) {
        return {
          text: 'Your cash is going out faster than it is coming in. Focus on revenue first, then cut costs.',
          bullets: [
            'Reach out to existing prospects this week to close a sale.',
            'List your expenses and drop anything not essential.',
            'Review your pricing — it may be too low.',
          ],
          nextStep: 'Open Finance to review your transactions.',
        };
      }
      if (high) {
        return {
          text: `Your highest priority task is "${high.title}". Finish it before anything else this week.`,
          bullets: [
            'Block out 1 hour today to make a start.',
            'Break it into smaller steps if it feels big.',
            'Mark it complete when done — your dashboard will update.',
          ],
          nextStep: 'Open the Tasks tab and complete your high-priority task.',
        };
      }
      return {
        text: 'Things look steady. Add one specific task that will move your business forward this week.',
        bullets: [
          'Pick something that leads directly to a customer or to revenue.',
          'Give it a due date within 7 days.',
          'Make it small enough to actually finish.',
        ],
        nextStep: 'Add a task in the Tasks tab.',
      };
    },
  },
  {
    match: (q) => /no money|no funds|bootstrap|start with nothing|low budget/i.test(q),
    answer: (state) => {
      return {
        text: 'You do not need money to start. You need your first yes from a real customer. Sell first, build less, and reinvest what you earn.',
        bullets: [
          'Pre-sell your service to 1-2 customers before you build it.',
          'Use free tools: WhatsApp, Instagram, a one-page Carrd or Google Site.',
          'Reinvest your first R500 into the one thing that gets you more customers.',
        ],
        nextStep: 'Add a "Pre-sell to 1 customer" task this week.',
      };
    },
  },
  {
    match: (q) => /validate|is my idea good|will it work|test idea/i.test(q),
    answer: (state) => {
      const { total } = customerCounts(state.customers);
      return {
        text:
          total === 0
            ? 'Validate before you build. The cheapest test is a real conversation with 5 people who could pay you.'
            : 'You have started validating. Now turn your notes into a clear "yes, I would pay" or "no, this is not a fit" from each person.',
        bullets: [
          'Describe your idea in one sentence and the problem it solves.',
          'Ask 5 people: would you pay R___ for this? Why or why not?',
          'Only build what people actually say they would pay for.',
        ],
        nextStep: 'Add your first 5 leads in the Customers tab.',
      };
    },
  },
  {
    match: (q) => /funding|investor|grant|finance my business|raise money/i.test(q),
    answer: (state) => {
      const income = calcTotalIncome(state.transactions);
      const expenses = calcTotalExpenses(state.transactions);
      return {
        text:
          income === 0
            ? 'Funders want proof, not promises. Get a few paying customers first — even small ones — before you look for funding.'
            : 'You have proof of revenue. Now look at the Opportunities tab for grants and programmes that match your stage.',
        bullets: [
          'Track your income and expenses clearly (the Finance tab does this for you).',
          'Save 2-3 opportunities from the Opportunities tab.',
          'Prepare a 1-page summary: problem, solution, customer, revenue, ask.',
        ],
        nextStep: 'Open the Opportunities tab and save the ones that match you.',
      };
    },
  },
];

const fallback: Rule = {
  match: () => true,
  answer: (state) => {
    const profile = profileCompletion(state.business);
    const open = openTasks(state.tasks);
    const { total: customers } = customerCounts(state.customers);
    const balance = calcBalance(state.transactions);
    const income = calcTotalIncome(state.transactions);
    const expenses = calcTotalExpenses(state.transactions);
    const summary: string[] = [];
    summary.push(`Profile ${profile}% complete`);
    summary.push(`${open.length} open task${open.length === 1 ? '' : 's'}`);
    summary.push(`${customers} potential customer${customers === 1 ? '' : 's'}`);
    if (income > 0 || expenses > 0) {
      summary.push(`Income ${fmtMoney(income)}, expenses ${fmtMoney(expenses)}, balance ${fmtMoney(balance)}`);
    }
    return {
      text: `Here is a quick read on your business: ${summary.join(' · ')}. Focus on the single next thing that gets you closer to a customer or to cash.`,
      bullets: [
        'Pick one task to finish this week.',
        'Talk to at least one potential customer.',
        'Keep your money records up to date in the Finance tab.',
      ],
      nextStep: 'Start with your Next Best Action on the dashboard.',
    };
  },
};

export function answerQuestion(question: string, state: AppState): AdvisorAnswer {
  const q = question.trim().toLowerCase();
  const matched = rules.find((r) => r.match(q));
  const rule = matched ?? fallback;
  return rule.answer(state);
}
