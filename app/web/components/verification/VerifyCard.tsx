"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import axios from "axios"
import {useMe} from "@/hooks/useMe"

const CODE_LENGTH = 6

export default function VerifyCard({ userId }: { userId: string }) {
  const router = useRouter()
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""))
  const [error, setError] = useState("")
  const [loadings, setLoading] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const focus = (i: number) => inputs.current[i]?.focus()

  const {user, loading,route}  = useMe()

  useEffect(()=>{
    if(user?.isVerified){
      router.push("/dashboard")
    }
    if(route){
      router.push("/signin")
    }
  },[user,route])

  const handleChange = useCallback(
    (i: number, val: string) => {
      const ch = val.replace(/\D/g, "").slice(-1)
      setDigits(prev => {
        const next = [...prev]
        next[i] = ch
        return next
      })
      setError("")
      if (ch && i < CODE_LENGTH - 1) focus(i + 1)
    },
    [],
  )

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) focus(i - 1)
    if (e.key === "ArrowLeft" && i > 0) focus(i - 1)
    if (e.key === "ArrowRight" && i < CODE_LENGTH - 1) focus(i + 1)
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH)
    if (!pasted) return
    const next = Array(CODE_LENGTH).fill("")
    pasted.split("").forEach((ch, i) => { next[i] = ch })
    setDigits(next)
    focus(Math.min(pasted.length, CODE_LENGTH - 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = digits.join("")
    if (code.length < CODE_LENGTH) {
      setError("Please enter the full 6-digit code.")
      return
    }
    setLoading(true)
    setError("")
    try {
      await api.post("/v1/auth/verify/confirm", { email: userId, code })
      router.push("/dashboard")
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? "Invalid or expired code. Please try again."
        : "Something went wrong. Please try again."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const filled = digits.every(d => d !== "")

  return (
    <div className={[
      "verify-card w-[480px] rounded-lg p-12",
      "bg-white/[0.03] backdrop-blur-[20px] backdrop-saturate-[160%]",
      "[border-top:1px_solid_rgba(255,255,255,0.10)]",
      "[border-left:1px_solid_rgba(255,255,255,0.06)]",
      "[border-right:1px_solid_rgba(255,255,255,0.03)]",
      "[border-bottom:1px_solid_rgba(255,255,255,0.02)]",
      "shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]",
    ].join(" ")}>

      {/* icon */}
      <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg border border-amber-600/30 bg-amber-600/10">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M2.5 5.833A1.667 1.667 0 0 1 4.167 4.167h11.666A1.667 1.667 0 0 1 17.5 5.833v8.334a1.667 1.667 0 0 1-1.667 1.666H4.167A1.667 1.667 0 0 1 2.5 14.167V5.833Z" stroke="#d97706" strokeWidth="1.4"/>
          <path d="M2.5 6.667l7.5 5 7.5-5" stroke="#d97706" strokeWidth="1.4" strokeLinejoin="round"/>
        </svg>
      </div>

      <h1 className="mb-2 text-[32px] font-bold tracking-[-0.04em] leading-tight font-display">
        <span className="text-[#f0eee9]">Verify your </span>
        <span className="text-transparent [-webkit-text-stroke:1.5px_rgba(217,119,6,0.7)]">
          email
        </span>
      </h1>
      <p className="mb-8 mt-2 text-sm font-light leading-relaxed text-white/40">
        We sent a 6-digit code to your inbox. Enter it below to activate your account.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {/* OTP inputs */}
        <div className="flex gap-3 mb-6" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => { inputs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              autoFocus={i === 0}
              className={[
                "h-14 w-full rounded-md text-center text-xl font-semibold",
                "bg-white/[0.05] border outline-none transition-colors",
                "text-[#f0eee9] caret-amber-500",
                d
                  ? "border-amber-600/60 bg-amber-600/[0.07]"
                  : "border-white/10 focus:border-amber-600/50 focus:bg-white/[0.07]",
              ].join(" ")}
            />
          ))}
        </div>

        {error && (
          <p className="mb-4 text-[13px] text-red-400/80">{error}</p>
        )}

        <button
          type="submit"
          disabled={!filled || loadings}
          className="verify-cta disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loadings ? "Verifying…" : "Verify email"}
        </button>
      </form>

      <div className="mt-7 pt-6 border-t border-white/[0.04]">
        <p className="text-center text-[13px] font-light text-white/40">
          Didn't receive a code?{" "}
          <button
            type="button"
            className="font-normal text-amber-600 hover:underline bg-transparent border-none cursor-pointer"
          >
            Resend email
          </button>
        </p>
      </div>
    </div>
  )
}
