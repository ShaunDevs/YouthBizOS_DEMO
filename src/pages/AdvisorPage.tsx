import { useRef, useState, useEffect, type FormEvent } from 'react';
import { Sparkles, Send, User, Bot, Lightbulb } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { answerQuestion, type AdvisorAnswer } from '@/lib/advisor';

interface Message {
  id: string;
  role: 'user' | 'advisor';
  question?: string;
  answer?: AdvisorAnswer;
}

const SUGGESTED = [
  'How do I get my first customers?',
  'How should I price my product?',
  'What should I focus on next?',
  'I have no money to start. What should I do?',
  'How do I validate my idea?',
  'How can I market my business?',
];

const uid = () => Math.random().toString(36).slice(2, 9);

export function AdvisorPage() {
  const { state } = useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q) return;
    const answer = answerQuestion(q, state);
    setMessages((m) => [
      ...m,
      { id: uid(), role: 'user', question: q },
      { id: uid(), role: 'advisor', answer },
    ]);
    setInput('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col animate-fadeIn lg:h-[calc(100vh-9rem)]">
      <div className="mb-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent-500/15 text-accent-300">
            <Sparkles size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-100 sm:text-3xl">YouthBiz Advisor</h1>
            <p className="text-sm text-slate-400">Ask a question — answers use your live business data.</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="card flex-1 overflow-y-auto p-4 sm:p-5">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-500/10 text-accent-300">
              <Lightbulb size={22} />
            </div>
            <p className="mt-4 max-w-sm text-sm text-slate-400">
              I'm your business advisor. Ask me anything about customers, pricing, marketing or what to do next. My
              advice is based on your actual business, tasks, money and customers.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="rounded-full border border-ink-700 bg-ink-850/60 px-3.5 py-2 text-xs text-slate-300 transition hover:border-accent-500/50 hover:text-accent-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((m) => (
              <div key={m.id}>
                {m.role === 'user' && (
                  <div className="flex justify-end">
                    <div className="flex items-start gap-2.5">
                      <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-accent-600/90 px-4 py-2.5 text-sm text-white">
                        {m.question}
                      </div>
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink-700 text-slate-300">
                        <User size={15} />
                      </div>
                    </div>
                  </div>
                )}
                {m.role === 'advisor' && m.answer && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2.5">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-500/15 text-accent-300">
                        <Bot size={15} />
                      </div>
                      <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-ink-700/70 bg-ink-850/60 px-4 py-3">
                        <p className="text-sm text-slate-200">{m.answer.text}</p>
                        {m.answer.bullets.length > 0 && (
                          <ul className="mt-3 space-y-1.5">
                            {m.answer.bullets.map((b, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-400" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        )}
                        <p className="mt-3 rounded-lg bg-accent-500/10 px-3 py-2 text-xs text-accent-200">
                          <span className="font-semibold">Next step: </span>
                          {m.answer.nextStep}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2">
        <input
          className="input flex-1"
          placeholder="Ask your advisor a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={!input.trim()} className="btn-primary px-4 py-3">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
