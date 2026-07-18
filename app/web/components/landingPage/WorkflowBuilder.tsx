"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Globe,
  Clock,
  Cpu,
  Database,
  GitBranch,
  MessageSquare,
  Filter,
  CheckCircle2,
  Play,
  Settings,
  Search,
  ChevronDown,
  Plus,
  Layers,
} from "lucide-react";

// ── Types ──

interface SidebarItem {
  icon: React.ComponentType<any>;
  name: string;
  color: string;
}

interface SidebarCategory {
  categoryName: string;
  items: SidebarItem[];
}

interface CanvasNode {
  id: number;
  label: string;
  type: string;
  icon: React.ComponentType<any>;
  color: string;
  x: number;
  y: number;
  w: number;
  status: "done" | "running" | "idle";
}

interface CanvasEdge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface InspectorConfigField {
  label: string;
  val: string;
  amber: boolean;
}

// ── Data Constants ──

const SIDEBAR_CATEGORIES: SidebarCategory[] = [
  {
    categoryName: "Triggers",
    items: [
      { icon: Globe, name: "HTTP Webhook", color: "#D97706" },
      { icon: Clock, name: "Cron Schedule", color: "#A1A1AA" },
    ],
  },
  {
    categoryName: "AI Agents",
    items: [
      { icon: Cpu, name: "AI Processor", color: "#F59E0B" },
      { icon: Cpu, name: "GPT-4o", color: "#A1A1AA" },
    ],
  },
  {
    categoryName: "Data",
    items: [
      { icon: Database, name: "PostgreSQL", color: "#71717A" },
      { icon: Filter, name: "Transform", color: "#D97706" },
    ],
  },
  {
    categoryName: "Actions",
    items: [
      { icon: MessageSquare, name: "Slack", color: "#A1A1AA" },
      { icon: GitBranch, name: "Condition", color: "#71717A" },
    ],
  },
];

const CANVAS_NODES: CanvasNode[] = [
  {
    id: 1,
    label: "Daily Schedule",
    type: "CRON",
    icon: Clock,
    color: "#A1A1AA",
    x: 44,
    y: 52,
    w: 150,
    status: "done",
  },
  {
    id: 2,
    label: "Fetch Leads",
    type: "HTTP",
    icon: Globe,
    color: "#D97706",
    x: 240,
    y: 34,
    w: 150,
    status: "done",
  },
  {
    id: 3,
    label: "AI Enrichment",
    type: "AI AGENT",
    icon: Cpu,
    color: "#F59E0B",
    x: 438,
    y: 43,
    w: 154,
    status: "running",
  },
  {
    id: 4,
    label: "Score Lead",
    type: "TRANSFORM",
    icon: Filter,
    color: "#D97706",
    x: 642,
    y: 33,
    w: 150,
    status: "idle",
  },
  {
    id: 5,
    label: "High Value?",
    type: "CONDITION",
    icon: GitBranch,
    color: "#71717A",
    x: 438,
    y: 178,
    w: 150,
    status: "idle",
  },
  {
    id: 6,
    label: "Notify Sales",
    type: "SLACK",
    icon: MessageSquare,
    color: "#A1A1AA",
    x: 642,
    y: 174,
    w: 150,
    status: "idle",
  },
];

const CANVAS_EDGES: CanvasEdge[] = [
  { x1: 194, y1: 76, x2: 240, y2: 68 },
  { x1: 390, y1: 68, x2: 438, y2: 70 },
  { x1: 592, y1: 70, x2: 642, y2: 58 },
  { x1: 515, y1: 103, x2: 515, y2: 178 },
  { x1: 588, y1: 203, x2: 642, y2: 199 },
];

const INSPECTOR_FIELDS: InspectorConfigField[] = [
  { label: "MODEL", val: "gpt-4o", amber: true },
  { label: "TEMPERATURE", val: "0.3", amber: false },
  { label: "MAX TOKENS", val: "4096", amber: false },
  { label: "TOOLS", val: "6 active", amber: false },
  { label: "TIMEOUT", val: "30s", amber: false },
];

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


export function WorkflowBuilder() {
  const [activeNodeId, setActiveNodeId] = useState<number>(3);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {
      Triggers: true,
      "AI Agents": true,
    },
  );

  const toggleCategory = (categoryName: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  return (
    <section className="relative pt-20 pb-24 overflow-hidden bg-transparent">
      {/* ── Background Glow Orb ── */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "-10%",
          width: 500,
          height: 500,
          background:
            "radial-gradient(ellipse, rgba(217, 119, 6, 0.07) 0%, transparent 65%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* ── Header Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: "#FAFAFA",
              paddingBottom: "1rem",
            }}
          >
            {["Build", "anything,", "visually"].map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                  delay: i * 0.08,
                }}
                style={{
                  display: "inline-block",
                  marginRight: "0.25em",
                  ...(word === "visually"
                    ? {
                        background: "linear-gradient(135deg, #FBBF24 0%, #D97706 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }
                    : {}),
                }}
              >
                {word}
              </motion.span>
            ))}
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
            A professional workflow canvas that feels like a real IDE —
            drag-and-drop, live execution tracing, and instant deployment.
          </p>
        </motion.div>

        {/* ── Builder Window Shell ── */}
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
          style={GLASS_CARD_STYLES}
        >
          {/* ── Toolbar Header ── */}
          <div
            className="flex items-center justify-between px-4 py-2.5 bg-[#0B0B0C]"
            style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}
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

              <div className="flex items-center gap-0.5 ml-2">
                {["File", "Edit", "View", "Deploy"].map((item) => (
                  <button
                    key={item}
                    className="px-2.5 py-1 rounded text-xs text-[#3F3F46] hover:text-[#A1A1AA] hover:bg-white/[0.04] transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                style={{
                  color: "#27272A",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.62rem",
                }}
              >
                lead-enrichment.flow · saved
              </span>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#22C55E] hover:bg-[#1ea850] transition-colors"
                style={{
                  boxShadow: "0 0 12px rgba(34, 197, 94, 0.25)",
                  fontFamily: "var(--font-body)",
                  borderRadius: 16,
                }}
              >
                <Play size={10} /> Deploy
              </button>
            </div>
          </div>

          <div className="flex" style={{ height: 460 }}>
            {/* ── Left Sidebar ── */}
            <div
              className="flex-shrink-0 overflow-y-auto bg-[#0A0A0B]"
              style={{
                width: 196,
                borderRight: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div className="p-3">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg mb-4 bg-white/3 border border-white/6">
                  <Search size={11} className="text-[#3F3F46]" />
                  <span
                    style={{
                      color: "#27272A",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.73rem",
                    }}
                  >
                    Search nodes…
                  </span>
                </div>

                {SIDEBAR_CATEGORIES.map((category) => {
                  const isOpen = openCategories[category.categoryName] ?? false;
                  return (
                    <div key={category.categoryName} className="mb-3">
                      <button
                        onClick={() => toggleCategory(category.categoryName)}
                        className="w-full flex items-center justify-between px-1 mb-1.5 text-left"
                      >
                        <span
                          style={{
                            color: "#3F3F46",
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.58rem",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {category.categoryName.toUpperCase()}
                        </span>
                        <ChevronDown
                          size={10}
                          className="text-[#3F3F46] transition-transform duration-150"
                          style={{
                            transform: isOpen
                              ? "rotate(0deg)"
                              : "rotate(-90deg)",
                          }}
                        />
                      </button>

                      {isOpen &&
                        category.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <div
                              key={item.name}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 cursor-pointer text-[#52525B] hover:text-[#A1A1AA] hover:bg-white/[0.04] transition-colors"
                            >
                              <div
                                className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                                style={{
                                  background: "transparent",
                                  border: `1px solid ${item.color}33`,
                                  borderRadius: 6,
                                  color: item.color,
                                }}
                              >
                                <Icon size={11} />
                              </div>
                              <span
                                style={{
                                  fontFamily: "var(--font-body)",
                                  fontSize: "0.73rem",
                                }}
                              >
                                {item.name}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Main Interactive Flow Canvas ── */}
            <div
              className="flex-1 relative overflow-hidden"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            >
              {/* ── SVG Edges and Animation Particles ── */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]">
                <defs>
                  <filter id="ceGlow">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {CANVAS_EDGES.map((edge, index) => (
                  <line
                    key={index}
                    x1={edge.x1}
                    y1={edge.y1}
                    x2={edge.x2}
                    y2={edge.y2}
                    stroke="rgba(217, 119, 6, 0.22)"
                    strokeWidth="1.5"
                    strokeDasharray="5 3"
                  />
                ))}

                <circle r="3" fill="#D97706" filter="url(#ceGlow)">
                  <animateMotion
                    dur="1.4s"
                    repeatCount="indefinite"
                    calcMode="linear"
                    path="M 390 68 C 414 68 414 70 438 70"
                  />
                </circle>
              </svg>

              {/* ── Render Canvas Nodes ── */}
              {/* ponytail: inline styling used for x and y positioning on custom layout graph */}
              {CANVAS_NODES.map((node) => {
                const Icon = node.icon;
                const isActive = node.id === activeNodeId;
                const isRunning = node.status === "running";

                return (
                  <motion.div
                    key={node.id}
                    whileHover={{ scale: 1.015 }}
                    onClick={() => setActiveNodeId(node.id)}
                    className="absolute cursor-pointer p-[9px_10px] backdrop-blur-md transition-all duration-200 z-[2]"
                    style={{
                      left: node.x,
                      top: node.y,
                      width: node.w,
                      background: isActive
                        ? "rgba(217, 119, 6, 0.08)"
                        : "rgba(255, 255, 255, 0.03)",
                      borderTop: `1px solid ${isActive ? "rgba(217, 119, 6, 0.35)" : "rgba(255, 255, 255, 0.1)"}`,
                      borderLeft: `1px solid ${isActive ? "rgba(217, 119, 6, 0.2)" : "rgba(255, 255, 255, 0.06)"}`,
                      borderRight: `1px solid ${isActive ? "rgba(217, 119, 6, 0.1)" : "rgba(255, 255, 255, 0.03)"}`,
                      borderBottom: `1px solid ${isActive ? "rgba(217, 119, 6, 0.05)" : "rgba(255, 255, 255, 0.02)"}`,
                      boxShadow: isRunning
                        ? "0 0 16px rgba(217, 119, 6, 0.18)"
                        : "none",
                      borderRadius: 2,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "transparent",
                          border: `1px solid ${node.color}33`,
                          borderRadius: 6,
                          color: node.color,
                        }}
                      >
                        <Icon size={12} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.72rem",
                            color: "#E4E4E7",
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {node.label}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.57rem",
                            color: "#3F3F46",
                          }}
                        >
                          {node.type}
                        </div>
                      </div>

                      {node.status === "done" && (
                        <CheckCircle2
                          size={10}
                          className="text-[#22C55E] flex-shrink-0"
                        />
                      )}
                      {node.status === "running" && (
                        <div className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse bg-[#D97706]" />
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* ── Dotted Plus Placeholder Node ── */}
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute flex items-center justify-center cursor-pointer border-2 border-dashed border-[#D97706]/25 text-[#D97706] z-[2]"
                style={{
                  left: 842,
                  top: 43,
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                }}
              >
                <Plus size={16} />
              </motion.div>
            </div>

            {/* ── Right Inspector Sidebar ── */}
            <div
              className="flex-shrink-0 overflow-y-auto bg-[#0A0A0B]"
              style={{
                width: 214,
                borderLeft: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div className="p-3.5">
                <div
                  className="flex items-center gap-2 mb-4 pb-3"
                  style={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <Settings size={11} className="text-[#3F3F46]" />
                  <span
                    style={{
                      color: "#3F3F46",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      letterSpacing: "0.07em",
                    }}
                  >
                    NODE CONFIG
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-7 h-7 flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(245, 158, 11, 0.28)",
                      borderRadius: 6,
                      color: "#F59E0B",
                    }}
                  >
                    <Cpu size={13} />
                  </div>
                  <div>
                    <div
                      style={{
                        color: "#FAFAFA",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                      }}
                    >
                      AI Enrichment
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#D97706]" />
                      <span
                        style={{
                          color: "#D97706",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.58rem",
                        }}
                      >
                        Running · 1.6s
                      </span>
                    </div>
                  </div>
                </div>

                {INSPECTOR_FIELDS.map((field) => (
                  <div key={field.label} className="mb-3">
                    <div
                      style={{
                        color: "#3F3F46",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.57rem",
                        letterSpacing: "0.07em",
                        marginBottom: 3,
                      }}
                    >
                      {field.label}
                    </div>
                    <div
                      className="px-2.5 py-1.5"
                      style={{
                        background: field.amber
                          ? "rgba(217, 119, 6, 0.08)"
                          : "rgba(255, 255, 255, 0.03)",
                        border: `1px solid ${field.amber ? "rgba(217, 119, 6, 0.2)" : "rgba(255, 255, 255, 0.06)"}`,
                        color: field.amber ? "#D97706" : "#71717A",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        borderRadius: 2,
                      }}
                    >
                      {field.val}
                    </div>
                  </div>
                ))}

                <div
                  className="mt-4 pt-3"
                  style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}
                >
                  <div
                    style={{
                      color: "#3F3F46",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.57rem",
                      letterSpacing: "0.07em",
                      marginBottom: 5,
                    }}
                  >
                    SYSTEM PROMPT
                  </div>
                  <div
                    className="p-2.5 text-ellipsis overflow-hidden"
                    style={{
                      background: "rgba(217, 119, 6, 0.05)",
                      border: "1px solid rgba(217, 119, 6, 0.12)",
                      color: "#78716C",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      lineHeight: 1.55,
                      borderRadius: 2,
                    }}
                  >
                    "Analyze the lead and score 0–100 based on company size,
                    tech stack…"
                  </div>
                </div>

                <div className="flex gap-1 mt-4">
                  {["Config", "Logs", "Test"].map((tab, i) => (
                    <button
                      key={tab}
                      className="flex-1 py-1.5 text-xs text-center"
                      style={{
                        background:
                          i === 0 ? "rgba(217, 119, 6, 0.1)" : "transparent",
                        border:
                          i === 0
                            ? "1px solid rgba(217, 119, 6, 0.3)"
                            : "1px solid transparent",
                        color:
                          i === 0 ? "#D97706" : "rgba(255, 255, 255, 0.25)",
                        borderRadius: 4,
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.6rem",
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer Status Bar ── */}
          <div
            className="flex items-center justify-between px-4 py-2 bg-[#0A0A0B]"
            style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}
          >
            <div className="flex items-center gap-5">
              {[
                ["6 nodes", "#3F3F46"],
                ["5 edges", "#3F3F46"],
                ["3/6 done", "#22C55E"],
              ].map(([label, color]) => (
                <span
                  key={label}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    color,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Layers size={10} className="text-[#3F3F46]" />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  color: "#3F3F46",
                }}
              >
                Autosaved 1s ago
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Feature Callouts Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-8">
          {[
            {
              title: "Infinite Canvas",
              desc: "Pan, zoom, and organize any workflow",
            },
            {
              title: "Live Execution Trace",
              desc: "Watch data flow node-by-node in real time",
            },
            {
              title: "Git-native Versioning",
              desc: "Branch, diff, and revert any workflow",
            },
            {
              title: "Multi-cursor Editing",
              desc: "Collaborate simultaneously like Figma",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 36, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.07,
              }}
              className="p-4"
              style={GLASS_CARD_STYLES}
            >
              <div
                style={{
                  color: "#D4D4D8",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.82rem",
                  fontWeight: 500,
                  marginBottom: 3,
                }}
              >
                {feature.title}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  color: "rgba(255, 255, 255, 0.38)",
                  fontSize: "0.75rem",
                }}
              >
                {feature.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
