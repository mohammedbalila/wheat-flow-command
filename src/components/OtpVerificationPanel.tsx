import { useState } from 'react'
import { motion } from 'framer-motion'
import { KeyRound, ScanLine, ShieldCheck } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { ActionButton, IconTile, Panel, SectionHeader } from './design-system'

export function OtpVerificationPanel({
  verified,
  onVerify,
}: {
  verified: boolean
  onVerify: () => void
}) {
  const [otp, setOtp] = useState('482916')
  const [error, setError] = useState('')

  function handleVerify() {
    if (otp.trim() === '482916') {
      setError('')
      onVerify()
      return
    }
    setError('Use demo OTP 482916')
  }

  return (
    <Panel>
      <SectionHeader
        title="OTP Verification"
        description="Secure release gate for truck DSP-4428"
        action={<StatusBadge status={verified ? 'OTP Verified' : 'Release Order Generated'} />}
      />

      <div className="rounded-[8px] border border-orange-200 bg-orange-50 p-3">
        <div className="flex items-center gap-3">
          <IconTile icon={KeyRound} tone="copper" />
          <div>
            <p className="text-sm font-semibold text-slate-950">Release order RO-7742</p>
            <p className="text-xs text-slate-500">Al Baraka Trading · 320 tons · Omdurman gate 3</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
            Agent OTP
          </span>
          <input
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            className="mt-2 h-10 w-full rounded-[8px] border border-slate-200 bg-white px-4 text-base font-semibold tracking-[0.22em] text-slate-950 outline-none transition focus:border-blue-400"
          />
        </label>
        <ActionButton onClick={handleVerify} className="mt-6 h-10">
          <ScanLine className="size-4" />
          Verify OTP
        </ActionButton>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      {verified ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-3 rounded-[8px] border border-emerald-200 bg-emerald-50 p-3 text-emerald-700"
        >
          <ShieldCheck className="size-5" />
          <div>
            <p className="text-sm font-semibold">OTP matched and audit stamped</p>
            <p className="text-xs text-emerald-700/70">Dispatch can now be released to the gate ledger.</p>
          </div>
        </motion.div>
      ) : null}
    </Panel>
  )
}
