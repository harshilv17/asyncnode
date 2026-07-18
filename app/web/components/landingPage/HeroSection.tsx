"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import {useRouter} from "next/navigation";

/* ─── Layout constants ───────────────────────────────────────────────────── */
const NW = 148,
  NH = 66;

const NODES = [
  {
    id: "webhook",
    label: "HTTP Webhook",
    type: "TRIGGER",
    x: 20,
    y: 197,
    color: "#D97706",
    status: "done",
  },
  {
    id: "auth",
    label: "Auth Guard",
    type: "VALIDATOR",
    x: 222,
    y: 114,
    color: "#A1A1AA",
    status: "done",
  },
  {
    id: "claude",
    label: "AI Processor",
    type: "AI AGENT",
    x: 432,
    y: 160,
    color: "#F59E0B",
    status: "running",
  },
  {
    id: "router",
    label: "Route Logic",
    type: "CONDITION",
    x: 630,
    y: 84,
    color: "#71717A",
    status: "idle",
  },
  {
    id: "pg",
    label: "PostgreSQL",
    type: "DATABASE",
    x: 826,
    y: 14,
    color: "#52525B",
    status: "idle",
  },
  {
    id: "transform",
    label: "Data Transform",
    type: "PROCESSOR",
    x: 432,
    y: 298,
    color: "#D97706",
    status: "done",
  },
  {
    id: "slack",
    label: "Slack Notify",
    type: "ACTION",
    x: 826,
    y: 174,
    color: "#FCD34D",
    status: "idle",
  },
  {
    id: "done",
    label: "Workflow Done",
    type: "TERMINAL",
    x: 826,
    y: 330,
    color: "#22C55E",
    status: "idle",
  },
] as const;

const op = (n: (typeof NODES)[number]) => ({ x: n.x + NW, y: n.y + NH / 2 });
const ip = (n: (typeof NODES)[number]) => ({ x: n.x, y: n.y + NH / 2 });
const nd = (id: string) => NODES.find((n) => n.id === id)!;

const mkPath = (from: string, to: string) => {
  const s = op(nd(from)),
    e = ip(nd(to)),
    mx = (s.x + e.x) / 2;
  return `M ${s.x} ${s.y} C ${mx} ${s.y} ${mx} ${e.y} ${e.x} ${e.y}`;
};

const EDGES = [
  { id: "e1", path: mkPath("webhook", "auth"), active: true },
  { id: "e2", path: mkPath("auth", "claude"), active: true },
  { id: "e3", path: mkPath("claude", "router"), active: true },
  { id: "e4", path: mkPath("router", "pg"), active: false },
  { id: "e5", path: mkPath("router", "slack"), active: false },
  { id: "e6", path: mkPath("webhook", "transform"), active: false },
  { id: "e7", path: mkPath("transform", "done"), active: false },
];

/* ─── SVG Node ────────────────────────────────────────────────────────────── */
function SvgNode({
  id,
  label,
  type,
  x,
  y,
  color,
  status,
}: (typeof NODES)[number]) {
  const isRunning = status === "running";
  const isDone = status === "done";
  return (
    <motion.g
      whileHover={{ scale: 1.025, y: -2 }}
      style={{
        transformOrigin: `${x + NW / 2}px ${y + NH / 2}px`,
        cursor: "pointer",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {isRunning && (
        <rect
          x={x - 3}
          y={y - 3}
          width={NW + 6}
          height={NH + 6}
          rx={10}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.4"
        >
          <animate
            attributeName="opacity"
            values="0.4;0.1;0.4"
            dur="2s"
            repeatCount="indefinite"
          />
        </rect>
      )}
      <rect
        x={x}
        y={y}
        width={NW}
        height={NH}
        rx={8}
        fill="rgba(255,255,255,0.03)"
        stroke={isRunning ? color : "rgba(255,255,255,0.07)"}
        strokeWidth={isRunning ? 1.5 : 1}
        className="transition-all duration-300 hover:fill-white/[0.07] hover:stroke-white/[0.18]"
      />
      <rect x={x + 1} y={y} width={NW - 2} height={2.5} rx={1.5} fill={color} />
      <rect
        x={x + 8}
        y={y + 15}
        width={26}
        height={26}
        rx={6}
        fill={`${color}18`}
      />
      <text
        x={x + 21}
        y={y + 33}
        textAnchor="middle"
        fontSize="10"
        fill={color}
        fontFamily="JetBrains Mono, monospace"
        fontWeight="600"
      >
        {type[0]}
      </text>
      <text
        x={x + 42}
        y={y + 29}
        fontSize="10"
        fill="rgba(255,255,255,0.8)"
        fontFamily="var(--font-body)"
        fontWeight="500"
      >
        {label}
      </text>
      <text
        x={x + 42}
        y={y + 44}
        fontSize="7.5"
        fill="rgba(255,255,255,0.25)"
        fontFamily="JetBrains Mono, monospace"
        letterSpacing="0.08em"
      >
        {type}
      </text>
      <circle
        cx={x + NW - 12}
        cy={y + 14}
        r={4}
        fill={isDone ? "#22C55E" : isRunning ? color : "#27272A"}
      >
        {isRunning && (
          <animate
            attributeName="opacity"
            values="1;0.2;1"
            dur="1.2s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      {id !== "webhook" && (
        <circle
          cx={x}
          cy={y + NH / 2}
          r={4}
          fill="#111113"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
        />
      )}
      <circle
        cx={x + NW}
        cy={y + NH / 2}
        r={4}
        fill="#111113"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.5"
      />
    </motion.g>
  );
}

/* ─── Section ─────────────────────────────────────────────────────────────── */
export function HeroSection() {
  const [tick, setTick] = useState(0);
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background Video with blur and fade mask */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "65%",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.45,
            filter: "blur(3.5px) brightness()",
            transform: "scale(1.06)",
          }}
          src="/BgVideo-Landing.mp4"
        />
        {/* Soft bottom fade to blend with page background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, transparent 60%, #060608 100%)",
          }}
        />
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          zIndex: 1,
        }}
      />

      {/* Amber core orb */}
      <div
        className="absolute top-[10%] left-1/2 -translate-x-1/2 w-150 h-100 pointer-events-none blur-[60px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(217,119,6,0.14) 0%, transparent 70%)",
        }}
      />

      {/* Cool edge orb */}
      <div
        className="absolute bottom-0 right-0 w-100 h-100 pointer-events-none blur-[80px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.02) 0%, transparent 70%)",
        }}
      />

      {/* ── Headline ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32 lg:pt-36 pb-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          {/* H1 */}
          <h1
            className="font-display font-extrabold leading-none tracking-[-0.04em] text-[#F0EEE9] mb-7 text-[clamp(3rem,10vw,8rem)]"
            style={{
              textShadow:
                "0 10px 30px rgba(0,0,0,0.85), 0 4px 12px rgba(0,0,0,0.5), 0 0 60px rgba(255,255,255,0.05)",
            }}
          >
            Build Workflows
            <br />
            <span
              className="block text-[#060608] [--webkit-text-stroke:1.5px_rgba(217,119,6,0.6)] [-webkit-text-stroke:1.5px_rgba(217,119,6,0.6)]"
              style={{
                textShadow:
                  "0 10px 30px rgba(0,0,0,0.95), 0 0 8px rgba(217,119,6,0.75), 0 0 25px rgba(217,119,6,0.35)",
              }}
            >
              That Think.
            </span>
          </h1>

          <p
            className="font-body font-light leading-[1.75] text-white/40 max-w-120 mb-11 text-[clamp(14px,4vw,18px)]"
            style={{
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.6)",
            }}
          >
            Orchestrate AI agents, connect any API, and automate production
            pipelines — without writing infrastructure code.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mb-11 w-full max-w-md sm:max-w-fit mx-auto">
            <motion.a
              whileHover={{
                backgroundColor: "#F59E0B",
                scale: 1.025,
                boxShadow:
                  "0 10px 30px -5px rgba(217, 119, 6, 0.4), 0 8px 12px -6px rgba(217, 119, 6, 0.4)",
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
                transition: "background-color 0.25s, box-shadow 0.25s",
              }}
            >
              {/* Animated shine sweep on hover */}
              <motion.div
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
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
                backgroundColor: "rgba(255,255,255,0.15)",
                scale: 1.025,
                boxShadow: "0 10px 25px -10px rgba(0, 0, 0, 0.5)",
              }}
              whileTap={{ scale: 0.97 }}
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
                border: "1px solid rgba(255,255,255,0.3)",
                transition:
                  "color 0.25s ease, background-color 0.25s, border-color 0.25s, box-shadow 0.25s",
                backgroundColor: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(4px)",
              }}
            >
              Watch Demo
            </motion.a>
          </div>

          {/* Mini stats */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {[
              ["50K+", "Automations"],
              ["99.9%", "Uptime"],
              ["120+", "Integrations"],
            ].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="font-display text-[#FAFAFA] font-extrabold leading-none text-[clamp(0.95rem,2vw,1.05rem)]">
                  {v}
                </div>
                <div className="text-[#3F3F46] font-mono text-[0.6rem] tracking-widest mt-0.75">
                  {l!.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Canvas ── */}
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 w-full"
      >
        <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.01] backdrop-blur-md shadow-[0_24px_60px_rgba(0,0,0,0.8)]">
          {/* Chrome */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => (
                  <div
                    key={c}
                    className="w-2.5 h-2.5 rounded-full opacity-[0.72]"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <span className="ml-3 text-[#3F3F46] font-mono text-[0.68rem] tracking-wider">
                customer-onboarding.flow
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-600/8 border border-amber-600/18">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-amber-600" />
                <span className="text-amber-600 font-mono text-[0.62rem] tracking-wider">
                  LIVE
                </span>
              </div>
              <ChevronRight size={13} className="text-[#3F3F46]" />
            </div>
          </div>

          {/* SVG canvas */}
          <div className="relative overflow-hidden h-[clamp(280px,52vw,470px)]">
            <svg
              viewBox="0 0 1040 460"
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0 w-full h-full z-2"
            >
              <defs>
                <filter
                  id="amberGlow"
                  x="-200%"
                  y="-200%"
                  width="500%"
                  height="500%"
                >
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {EDGES.map((e) => (
                <path
                  key={e.id}
                  id={e.id}
                  d={e.path}
                  fill="none"
                  stroke={
                    e.active ? "rgba(217,119,6,0.25)" : "rgba(255,255,255,0.05)"
                  }
                  strokeWidth={e.active ? 1.5 : 1}
                />
              ))}

              {EDGES.filter((e) => e.active).map((e) => (
                <g key={e.id + "-p"} filter="url(#amberGlow)">
                  {[0, 0.45].map((offset) => (
                    <circle key={offset} r="3.5" fill="#D97706">
                      <animateMotion
                        dur="1.8s"
                        repeatCount="indefinite"
                        begin={`${offset * 1.8}s`}
                        calcMode="linear"
                      >
                        <mpath href={`#${e.id}`} />
                      </animateMotion>
                    </circle>
                  ))}
                </g>
              ))}

              {NODES.map((n) => (
                <SvgNode key={n.id} {...n} />
              ))}
            </svg>

            {/* Floating: Metrics */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="hidden md:block absolute top-3.5 right-3.5 min-w-[152px] z-10 rounded-xl p-3.5 bg-[#060608]/90 border border-white/[0.08] backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
            >
              <div className="text-[#3F3F46] font-mono text-[0.58rem] tracking-[0.08em] mb-2">
                LIVE METRICS
              </div>
              {[
                {
                  k: "Runs today",
                  v: (12847 + tick * 3).toLocaleString(),
                  c: "text-amber-600",
                },
                { k: "Success rate", v: "99.8%", c: "text-green-500" },
                { k: "Avg latency", v: "138ms", c: "text-[#A1A1AA]" },
              ].map((m) => (
                <div
                  key={m.k}
                  className="flex items-center justify-between mb-1"
                >
                  <span className="text-[#52525B] font-mono text-[0.6rem]">
                    {m.k}
                  </span>
                  <span
                    className={`${m.c} font-mono text-[0.68rem] font-semibold`}
                  >
                    {m.v}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Floating: Inspector */}
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2,
              }}
              className="hidden md:block absolute bottom-12 left-3.5 min-w-[176px] z-10 rounded-xl p-3.5 bg-[#060608]/90 border border-amber-600/18 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
            >
              <div className="text-[#3F3F46] font-mono text-[0.58rem] tracking-[0.08em] mb-1.5">
                NODE INSPECTOR
              </div>
              <div className="text-[#FAFAFA] font-body text-[0.76rem] font-medium mb-1">
                AI Processor
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {["model:gpt-4o", "temp:0.3", "tools:6"].map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 rounded-md bg-amber-600/10 text-amber-600 font-mono text-[0.58rem]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-amber-600" />
                <span className="text-amber-600 font-mono text-[0.6rem]">
                  Processing… 1.4s
                </span>
              </div>
            </motion.div>

            {/* Minimap */}
            <div className="hidden md:block absolute bottom-3.5 right-3.5 w-27 h-15 z-10 rounded-lg overflow-hidden bg-[#060608]/90 border border-white/[0.08] backdrop-blur-md shadow-lg">
              <svg
                viewBox="0 0 1040 460"
                className="w-full h-full opacity-[0.65]"
              >
                {NODES.map((n) => (
                  <rect
                    key={n.id}
                    x={n.x}
                    y={n.y}
                    width={NW}
                    height={NH}
                    rx={4}
                    fill={n.color}
                    opacity={0.22}
                  />
                ))}
                {EDGES.map((e) => (
                  <path
                    key={e.id}
                    d={e.path}
                    fill="none"
                    stroke={
                      e.active
                        ? "rgba(217,119,6,0.5)"
                        : "rgba(255,255,255,0.05)"
                    }
                    strokeWidth={e.active ? 3 : 1.5}
                  />
                ))}
              </svg>
              <div className="absolute bottom-1 left-2 text-[#27272A] font-mono text-[0.48rem] tracking-[0.06em]">
                MINIMAP
              </div>
            </div>
          </div>

          {/* Footer bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-white/[0.06] bg-white/[0.02]">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
              {[
                ["8 nodes", "⬡"],
                ["7 edges", "→"],
                ["2 agents", "◈"],
                ["3 active", "●"],
              ].map(([l, i]) => (
                <span
                  key={l}
                  className="text-[#3F3F46] font-mono text-[0.62rem]"
                >
                  {i} {l}
                </span>
              ))}
            </div>
            <span className="text-green-500 font-mono text-[0.62rem]">
              ● RUNNING
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
