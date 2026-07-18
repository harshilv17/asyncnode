"use client";

import { motion } from "motion/react";

const LINKS = {
  Product: [
    "Features",
    "Integrations",
    "Pricing",
    "Documentation",
    "Changelog",
  ],
  Resources: ["Blog", "Guides", "Community", "Templates", "API Reference"],
  Company: ["About", "Careers", "Contact", "Press", "Legal"],
};

export function Footer() {
  return (
    <footer className="relative bg-[#060608] border-t border-[rgba(255,255,255,0.05)] py-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex flex-col gap-[3px] w-5">
                <div className="h-[2px] w-5 bg-[#D97706] rounded-[1px]" />
                <div className="h-[2px] w-[14px] bg-[rgba(217,119,6,0.4)] rounded-[1px]" />
                <div className="h-[2px] w-[8px] bg-[rgba(217,119,6,0.2)] rounded-[1px]" />
              </div>
              <span className="font-display text-[1.02rem] font-bold text-[#FAFAFA]">
                AsyncNode
              </span>
            </div>
            <p className="font-body font-light text-[0.82rem] leading-[1.7] text-[rgba(255,255,255,0.2)] max-w-[250px] mb-5">
              Visual workflow automation for teams that move fast. Build,
              deploy, and monitor AI-powered pipelines at production scale.
            </p>
          </div>

          {Object.entries(LINKS).map(([cat, links]) => (
            <div key={cat}>
              <div className="font-display font-semibold text-[0.78rem] tracking-[0.06em] text-[rgba(255,255,255,0.5)] uppercase mb-4">
                {cat}
              </div>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-body font-light text-[0.8rem] text-[rgba(255,255,255,0.18)] hover:text-[rgba(255,255,255,0.6)] transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[rgba(255,255,255,0.04)] pt-8 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="w-[5px] h-[5px] rounded-full bg-[#22C55E]"
            />
            <span className="font-mono text-[0.6rem] tracking-[0.06em] text-[rgba(255,255,255,0.14)]">
              All systems nominal
            </span>
          </div>

          <span className="font-mono text-[0.6rem] text-[rgba(255,255,255,0.1)]">
            © 2025 AsyncNode, Inc.
          </span>
        </div>
      </div>
    </footer>
  );
}
