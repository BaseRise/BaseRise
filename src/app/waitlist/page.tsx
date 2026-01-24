'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, Sparkles, Shield, Rocket } from 'lucide-react'

function EarlyAccessContent() {
  const searchParams = useSearchParams()
  const referredBy = searchParams.get('ref')
  
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, referredBy }),
      })

      const data = await res.json()

      if (res.ok) {
        window.location.href = `/check-email?email=${encodeURIComponent(email)}`
      } else {
        setErrorMessage(data.error || 'Something went wrong')
        setStatus('error')
      }
    } catch {
      setErrorMessage('Network error. Please try again.')
      setStatus('error')
    }
  }

  return (
    <main className="relative z-10 max-w-4xl w-full text-center flex flex-col items-center px-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/15 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-600/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Referral Badge */}
      {referredBy && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-full"
        >
          <Sparkles size={14} className="text-green-400" />
          <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Invited by a friend</span>
        </motion.div>
      )}

      {/* Logo */}
      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 150 }}
        className="mb-8"
      >
        <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl rotate-12 flex items-center justify-center shadow-[0_0_50px_-10px_rgba(59,130,246,0.5)] border border-white/20">
          <span className="text-4xl font-black -rotate-12 text-white">B</span>
          <div className="absolute -top-1 -right-1">
            <Sparkles size={16} className="text-yellow-400" />
          </div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 mb-10"
      >
        <h1 className="text-5xl md:text-7xl font-black uppercase text-white tracking-tighter leading-[0.9]">
          Join The <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Evolution</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
          The premier yield & reward protocol on Base. <br />
          <span className="text-white/60 italic font-semibold">Available for first 10,000 users only.</span>
        </p>
      </motion.div>

      {/* Form */}
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onSubmit={handleSubmit} 
        className="w-full max-w-md space-y-4"
      >
        <div className="p-1.5 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)]">
          <div className="flex flex-col md:flex-row gap-2 md:gap-0">
            <input 
              type="email" 
              required 
              placeholder="Enter your email" 
              className="flex-1 px-5 py-3.5 bg-transparent border-none outline-none text-white placeholder:text-gray-600 font-semibold text-sm"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={status === 'loading'}
              className="group relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black uppercase text-xs tracking-widest transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.7)] overflow-hidden disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {status === 'loading' ? (
                  <><Loader2 size={16} className="animate-spin" /> Securing...</>
                ) : (
                  <><Rocket size={16} /> Secure Spot</>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </motion.button>
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Shield size={12} />
          <span className="text-[10px] uppercase tracking-widest font-bold">Secured & Encrypted</span>
        </div>
      </motion.form>

      {/* Error Message */}
      {status === 'error' && (
        <motion.p 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-red-400 mt-6 font-bold text-xs bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20 uppercase tracking-wider"
        >
          {errorMessage}
        </motion.p>
      )}

      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 flex items-center gap-3"
      >
        <div className="flex -space-x-2">
          <div className="w-7 h-7 rounded-full border-2 border-black bg-gradient-to-br from-blue-500 to-blue-700" />
          <div className="w-7 h-7 rounded-full border-2 border-black bg-gradient-to-br from-purple-500 to-purple-700" />
          <div className="w-7 h-7 rounded-full border-2 border-black bg-gradient-to-br from-indigo-500 to-indigo-700" />
        </div>
        <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">
          Invitations active on <span className="text-blue-400">Base Mainnet</span>
        </p>
      </motion.div>
    </main>
  )
}

export default function EarlyAccess() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#030303] overflow-hidden px-6">
      <Suspense fallback={
        <div className="text-white flex items-center gap-2">
          <Loader2 className="animate-spin" size={20} />
          <span className="text-xs uppercase tracking-widest font-bold">Loading...</span>
        </div>
      }>
        <EarlyAccessContent />
      </Suspense>
    </div>
  )
}