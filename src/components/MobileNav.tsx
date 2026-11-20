"use client";

import { useState } from "react";

const links = [
  ["Success Stories", "#stories"],
  ["Program", "#program"],
  ["Why Us", "#why"],
  ["Tools", "#tools"],
  ["Blog", "#blog"],
  ["Pricing", "#pricing"],
  ["FAQ", "#faq"],
  ["Contact", "#contact"],
] as const;

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        className="rounded-lg border border-line p-2 text-slate-300"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M3 5h14M3 10h14M3 15h14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute inset-x-0 top-16 z-50 border-b border-line bg-ink/95 px-6 py-4 backdrop-blur">
          <div className="flex flex-col gap-3">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="text-sm text-slate-300 hover:text-white"
              >
                {label}
              </a>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} className="btn-primary mt-2">
              Book Free Consultation
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
