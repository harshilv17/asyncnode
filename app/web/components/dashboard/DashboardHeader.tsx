import { LogOut, Workflow } from "lucide-react"

interface DashboardHeaderProps {
  signingOut: boolean
  onSignOut: () => void
}

export default function DashboardHeader({ signingOut, onSignOut }: DashboardHeaderProps) {
  return (
    <header className="dash-enter mb-10 flex items-center justify-between" style={{ animationDelay: "0ms" }}>
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-600/20 text-amber-500">
          <Workflow size={16} />
        </div>
        <span className="font-display text-[18px] font-bold tracking-tight text-[#f0eee9]">
          Async<span className="text-amber-600">Node</span>
        </span>
      </div>

      <button
        onClick={onSignOut}
        disabled={signingOut}
        className="flex items-center gap-2 rounded px-3 py-2 text-[13px] text-white/40 transition-colors hover:bg-white/5 hover:text-white/70 disabled:opacity-50"
      >
        <LogOut size={14} />
        {signingOut ? "Signing out…" : "Sign out"}
      </button>
    </header>
  )
}
