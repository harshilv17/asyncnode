"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Terminal, Download } from "lucide-react";

// ── Types ──

interface LogEntry {
  ts: string;
  level: "INFO" | "WARN" | "ERROR";
  id: string;
  msg: string;
}

interface MetricItem {
  label: string;
  val: string;
  delta: string;
  good: boolean;
}

// ── Data Constants ──

const ALL_LOGS: LogEntry[] = [
  {
    ts: "14:23:01.043",
    level: "INFO",
    id: "wf_8x3a1",
    msg: "Workflow started: customer-onboarding-v3",
  },
  {
    ts: "14:23:01.121",
    level: "INFO",
    id: "wf_8x3a1",
    msg: "Node [HTTP Webhook] → payload received 2.4KB",
  },
  {
    ts: "14:23:01.203",
    level: "INFO",
    id: "wf_8x3a1",
    msg: "Node [Rate Limiter] → pass (48/60 req/s)",
  },
  {
    ts: "14:23:01.891",
    level: "INFO",
    id: "wf_8x3a1",
    msg: "Node [AI Processor] → invoking gpt-4o",
  },
  {
    ts: "14:23:03.441",
    level: "INFO",
    id: "wf_8x3a1",
    msg: 'Node [AI Processor] → tool_call: web_search("acme corp")',
  },
  {
    ts: "14:23:04.112",
    level: "INFO",
    id: "wf_8x3a1",
    msg: 'Node [AI Processor] → tool_call: sql_query("SELECT * FROM…")',
  },
  {
    ts: "14:23:04.892",
    level: "INFO",
    id: "wf_8x3a1",
    msg: "Node [AI Processor] → done, tokens: 1284/8192",
  },
  {
    ts: "14:23:04.901",
    level: "WARN",
    id: "wf_8x3a1",
    msg: "Node [Score Lead] → confidence 0.62 < threshold 0.70",
  },
  {
    ts: "14:23:05.012",
    level: "INFO",
    id: "wf_8x3a1",
    msg: "Node [Condition] → routing to HIGH_VALUE branch",
  },
  {
    ts: "14:23:05.231",
    level: "INFO",
    id: "wf_8x3a1",
    msg: "Node [Slack Notify] → sent to #sales-signals",
  },
  {
    ts: "14:23:05.312",
    level: "INFO",
    id: "wf_8x3a1",
    msg: "Workflow complete: 4.269s · 11 nodes · 0 errors",
  },
  {
    ts: "14:23:05.891",
    level: "ERROR",
    id: "wf_7b2f9",
    msg: "Node [PostgreSQL] → timeout 5000ms, retry 1/3",
  },
  {
    ts: "14:23:07.112",
    level: "INFO",
    id: "wf_7b2f9",
    msg: "Node [PostgreSQL] → retry 2 succeeded",
  },
];

const METRICS: MetricItem[] = [
  { label: "Avg Exec Time", val: "1.84s", delta: "-12%", good: true },
  { label: "Error Rate", val: "0.18%", delta: "-3%", good: true },
  { label: "P99 Latency", val: "4.2s", delta: "+0.1s", good: false },
  { label: "Throughput", val: "842/min", delta: "+28%", good: true },
];

// Helper to determine color based on log level
const getLogLevelColor = (level: "INFO" | "WARN" | "ERROR"): string => {
  if (level === "ERROR") return "#EF4444";
  if (level === "WARN") return "#F59E0B";
  return "#71717A";
};

// ── Layout Styles Helper ──

const GLASS_CARD_STYLES: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.03)",
  backdropFilter: "blur(20px) saturate(160%)",
  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  borderLeft: "1px solid rgba(255, 255, 255, 0.06)",
  borderRight: "1px solid rgba(255, 255, 255, 0.03)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.02)",
  boxShadow:
    "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
  borderRadius: 8,
};

// ── Main Component ──

export function MonitoringSection() {
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [filterLevel, setFilterLevel] = useState<string>("ALL");

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleCount(ALL_LOGS.length);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  const filteredLogs =
    filterLevel === "ALL"
      ? ALL_LOGS
      : ALL_LOGS.filter((log) => log.level === filterLevel);

  return (
    <section className="relative py-28 overflow-hidden bg-transparent">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* ── Header Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: "#FAFAFA",
              marginBottom: "1rem",
            }}
          >
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "inline-block" }}
            >
              Debug any failure in{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #FBBF24 0%, #D97706 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block",
                }}
              >
                seconds
              </span>
            </motion.span>
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: "0.95rem",
              lineHeight: 1.8,
              color: "rgba(255, 255, 255, 0.38)",
              maxWidth: 460,
              margin: "0 auto",
            }}
          >
            Step-by-step execution traces, real-time log streaming, and
            performance analytics — all in one place.
          </p>
        </motion.div>

        {/* ── Metrics Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-8">
          {METRICS.map((metric, index) => {
            const match = metric.val.match(/^([\d.]+)(.*)$/);
            const num = match ? match[1] : metric.val;
            const unit = match ? match[2] : "";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 36, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                  delay: index * 0.06,
                }}
                whileHover={{ y: -4, scale: 1.015 }}
                className="group cursor-default p-5 rounded-lg bg-white/[0.02] backdrop-blur-[20px] backdrop-saturate-[160%] border-t border-t-white/10 border-l border-l-white/6 border-r border-r-white/3 border-b border-b-white/2 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 hover:border-amber-500/20 hover:border-t-amber-500/40 hover:bg-gradient-to-b hover:from-amber-500/[0.03] hover:to-transparent hover:shadow-[0_8px_32px_rgba(217,119,6,0.06),inset_0_1px_0_rgba(255,255,255,0.08)]"
              >
                <div className="font-sans text-[10px] tracking-wider font-semibold text-zinc-500 uppercase mb-3.5 group-hover:text-zinc-400 transition-colors duration-300">
                  {metric.label}
                </div>
                <div className="flex items-baseline leading-none">
                  <span className="font-space text-[2.5rem] font-extrabold tracking-[0.03em] bg-gradient-to-br from-white via-white to-zinc-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-amber-500 transition-all duration-300">
                    {num}
                  </span>
                  {unit && (
                    <span className="font-sans text-xl font-medium tracking-[0.03em] text-zinc-500 ml-1.5 group-hover:text-amber-500/60 transition-colors duration-300 select-none">
                      {unit}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3.5">
                  <span className="font-mono text-xs text-zinc-600 group-hover:text-zinc-500 transition-colors duration-300">
                    vs last 24h
                  </span>
                  <span
                    className={`font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-all duration-300 ${
                      metric.good
                        ? "text-emerald-500 bg-emerald-500/8 border-emerald-500/15 group-hover:bg-emerald-500/12 group-hover:border-emerald-500/25"
                        : "text-red-500 bg-red-500/8 border-red-500/15 group-hover:bg-red-500/12 group-hover:border-red-500/25"
                    }`}
                  >
                    {metric.delta}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Terminal Window ── */}
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
          style={GLASS_CARD_STYLES}
        >
          {/* Terminal Header */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{
              borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
              background: "rgba(255, 255, 255, 0.01)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {["#FF5F56", "#FFBD2E", "#27C93F"].map((color) => (
                  <div
                    key={color}
                    className="w-2.5 h-2.5 rounded-full opacity-[0.72]"
                    style={{ background: color }}
                  />
                ))}
              </div>
              <Terminal size={11} style={{ color: "#3F3F46", marginLeft: 6 }} />
              <span
                style={{
                  color: "#3F3F46",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                }}
              >
                asyncnode / execution-logs
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {["ALL", "INFO", "WARN", "ERROR"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  className="px-2 py-0.5 rounded text-xs transition-all"
                  style={{
                    background:
                      filterLevel === lvl
                        ? lvl === "ERROR"
                          ? "rgba(239, 68, 68, 0.12)"
                          : lvl === "WARN"
                            ? "rgba(245, 158, 11, 0.1)"
                            : "rgba(217, 119, 6, 0.1)"
                        : "transparent",
                    color:
                      filterLevel === lvl
                        ? lvl === "ERROR"
                          ? "#EF4444"
                          : lvl === "WARN"
                            ? "#F59E0B"
                            : "#D97706"
                        : "#3F3F46",
                    border:
                      filterLevel === lvl
                        ? `1px solid ${lvl === "ERROR" ? "rgba(239, 68, 68, 0.28)" : lvl === "WARN" ? "rgba(245, 158, 11, 0.25)" : "rgba(217, 119, 6, 0.22)"}`
                        : "1px solid transparent",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.58rem",
                  }}
                >
                  {lvl}
                </button>
              ))}
              <Download size={11} className="text-[#3F3F46] cursor-pointer" />
            </div>
          </div>

          {/* Terminal Console Output */}
          <div className="p-5" style={{ maxHeight: 390, overflowY: "auto" }}>
            <div
              className="pb-2.5 mb-4"
              style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}
            >
              <span
                style={{
                  color: "#D97706",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                }}
              >
                async
              </span>
              <span
                style={{
                  color: "#3F3F46",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                }}
              >
                node
              </span>
              <span
                style={{
                  color: "#52525B",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                }}
              >
                {" "}
                $ tail -f /logs/execution.log --filter=wf_8x3a1
              </span>
            </div>

            {filteredLogs.slice(0, visibleCount).map((log, index) => {
              const levelColor = getLogLevelColor(log.level);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.18 }}
                  className="flex items-start gap-2.5 mb-1.5"
                >
                  <span
                    style={{
                      color: "#3F3F46",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      minWidth: 82,
                      flexShrink: 0,
                    }}
                  >
                    {log.ts}
                  </span>
                  <span
                    className="px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{
                      background: `${levelColor}10`,
                      color: levelColor,
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.56rem",
                      minWidth: 38,
                      textAlign: "center",
                    }}
                  >
                    {log.level}
                  </span>
                  <span
                    style={{
                      color: "#3F3F46",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      minWidth: 62,
                      flexShrink: 0,
                    }}
                  >
                    {log.id}
                  </span>
                  <span
                    style={{
                      color:
                        log.level === "ERROR"
                          ? "#EF4444"
                          : log.level === "WARN"
                            ? "#F59E0B"
                            : "#52525B",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.68rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {log.msg}
                  </span>
                </motion.div>
              );
            })}

            <div className="flex items-center gap-1 mt-2">
              <span
                style={{
                  color: "#D97706",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                }}
              >
                █
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
