"use client";

import { motion } from "motion/react";
import { ArrowRight, Play, Workflow, Shield, Clock } from "lucide-react";
import {useRouter} from "next/navigation";

export function FinalCTA() {
  const router = useRouter();
  return (

    <section className="relative overflow-hidden py-32 sm:py-40 bg-[rgba(217,119,6,0.04)] border-t border-[rgba(217,119,6,0.1)] border-b border-[rgba(217,119,6,0.06)]">
      <div
        className="absolute inset-0 bg-[length:80px_80px] bg-[image:linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] rotate-[3deg] scale-110
        "
      />
      <div className="absolute top-1/2 left-1/2 w-[700px] h-[500px] -translate-x-1/2 -translate-y-1/2 pointer-events-none blur-[40px] bg-[radial-gradient(ellipse,rgba(217,119,6,0.1)_0%,transparent_65%)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-10 bg-amber-500/[0.04] border border-amber-500/15 shadow-[0_0_12px_rgba(217,119,6,0.02)] transition-all duration-300 hover:bg-amber-500/[0.07] hover:border-amber-500/25">
            <Workflow
              size={11}
              className="text-amber-500 transition-transform duration-300"
            />
            <span className="font-mono text-[10px] font-semibold tracking-[0.06em] text-amber-500/90 uppercase select-none">
              Deploy your first workflow in under 5 minutes
            </span>
          </div>

          <h2 className="font-display text-[clamp(40px,7vw,88px)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#F0EEE9] mb-6">
            Ship faster.
            <br />
            <span className="block text-transparent [-webkit-text-stroke:1.5px_rgba(217,119,6,0.5)]">
              Break less.
            </span>
          </h2>

          <p className="max-w-[500px] mx-auto mb-12 font-body text-[1.05rem] leading-[1.72] text-[rgba(255,255,255,0.38)]">
            Create workflows, orchestrate AI agents, and automate business
            operations from one unified platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <motion.a
              whileHover={{
                backgroundColor: "#F59E0B",
              }}
              whileTap={{ scale: 0.97 }}
              href="/signup"
              className="w-full sm:w-auto justify-center"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "16px 36px",
                borderRadius: 4,
                background: "#D97706",
                color: "#060608",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.92rem",
                letterSpacing: "-0.01em",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Animated shine sweep on hover */}
              <motion.div
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                  pointerEvents: "none",
                }}
         
              />
              Start Building Free
              <span style={{ fontSize: 16 }}>→</span>
            </motion.a>

            <motion.a
              whileHover={{
                color: "rgba(255,255,255,1)",
                border: "1px solid rgba(255,255,255,0.9)",
                backgroundColor: "rgba(255,255,255,0.2)",
              }}
              href="#"
              className="w-full sm:w-auto justify-center"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "16px 28px",
                color: "rgba(255,255,255,0.65)",
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                fontSize: "0.88rem",
                border: "1px solid rgba(255,255,255,0.4)",
                transition: "color 0.25s ease",
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
            >
              Watch Demo
            </motion.a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto">
            {[
              { icon: <Shield size={11} />, label: "SOC 2 Type II" },
              {
                icon: <Workflow size={11} />,
                label: "No credit card required",
              },
              { icon: <Clock size={11} />, label: "Deploy in minutes" },
              { icon: <Shield size={11} />, label: "99.9% SLA" },
              { icon: <Workflow size={11} />, label: "Free tier forever" },
            ].map((p, i) => (
              <div
                key={i}
                className="group/pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.1] hover:scale-[1.02]"
              >
                <span className="text-emerald-500/80 group-hover/pill:text-emerald-400 transition-colors duration-300">
                  {p.icon}
                </span>
                <span className="font-sans text-[11px] font-medium tracking-wide text-zinc-400/85 group-hover/pill:text-zinc-200 transition-colors duration-300 select-none">
                  {p.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
