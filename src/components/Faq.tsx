"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What if my teen has no coding experience?",
    a: "That is exactly who the program is built for. Students build real, full-stack apps with modern no-code and AI-assisted tools, guided 1:1 at every step. No prior coding needed.",
  },
  {
    q: "How do you guarantee university admissions?",
    a: "We cannot control admissions decisions, and no honest program can. What we guarantee is a launched, revenue-ready product, a public Product Hunt presence and a story that stands out in applications. If we don't deliver the outcomes we promise, you get your money back.",
  },
  {
    q: "What kind of apps do students typically build?",
    a: "Real products with real users: AI-powered farming tools, subscription services, language-learning apps, e-commerce brands. Every student ships something they chose and validated themselves.",
  },
  {
    q: "How much time commitment is required?",
    a: "One hour of live 1:1 mentoring per week for 8 weeks, plus a few hours of guided building between sessions. The schedule flexes around school.",
  },
  {
    q: "What is the success rate?",
    a: "Over 100 students mentored, with launched apps, early revenue and admissions to top universities. Every student finishes with a working product and a public launch.",
  },
  {
    q: "Can my teen generate real revenue?",
    a: "Yes. Several student apps earn from their first weeks: a 13-year-old's book subscription reached INR 1,00,000 in monthly revenue, and a 16-year-old's gifting brand made INR 9,000 in week one.",
  },
  {
    q: "What universities have your students gotten into?",
    a: "Students have earned admissions to top universities in India and abroad, using their launched products as the centerpiece of their applications.",
  },
  {
    q: "What ongoing support do you provide?",
    a: "Lifetime support after the program: product questions, pitch reviews and launch help whenever your teen needs it.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-10 space-y-3">
      {faqs.map((f, i) => (
        <div key={f.q} className="card overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between px-6 py-4 text-left"
            aria-expanded={open === i}
          >
            <span className="font-medium text-white">{f.q}</span>
            <span
              className={`ml-4 text-neutral-300 transition-transform ${
                open === i ? "rotate-45" : ""
              }`}
            >
              +
            </span>
          </button>
          {open === i && (
            <p className="px-6 pb-5 text-sm leading-relaxed text-neutral-400">
              {f.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
