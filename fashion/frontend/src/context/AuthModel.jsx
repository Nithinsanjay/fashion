import React, { useState } from 'react'
import { X, Sparkles, Lock, Mail, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AuthModal() {
    const { isAuthOpen, closeAuth, login, register } = useAuth()
    const [mode, setMode] = useState('login') // 'login' | 'register' | 'forgot'

    // Form fields
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [department, setDepartment] = useState('unisex')
    const [otp, setOtp] = useState('')
    const [otpSent, setOtpSent] = useState(false)
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    // Real-time password requirement checks
    const hasMinLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const isPasswordValid = hasMinLength && hasUpperCase && hasSpecialChar

    if (!isAuthOpen) return null

    // Send Free Email OTP
    const handleSendOtp = async () => {
        if (!email) {
            setError('Please enter your email address first.')
            return
        }
        setError('')
        setLoading(true)
        try {
            const res = await fetch('http://localhost:8000/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.detail || 'Failed to send OTP')
            setOtpSent(true)
            setSuccessMsg('OTP code sent to your email!')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccessMsg('')
        setLoading(true)

        try {
            if (mode === 'login') {
                if (!email || !password) throw new Error('Please fill in all fields.')
                await login(email, password)
            } else if (mode === 'register') {
                if (!name || !email || !password) throw new Error('Please fill in all fields.')
                if (!isPasswordValid) throw new Error('Please ensure your password meets all requirements.')
                await register(name, email, password, department)
            } else if (mode === 'forgot') {
                if (!email || !otp || !password) throw new Error('Please provide email, OTP, and new password.')
                if (!isPasswordValid) throw new Error('New password must meet strength requirements.')

                const res = await fetch('http://localhost:8000/api/auth/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp, new_password: password })
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.detail || 'Failed to reset password.')

                setSuccessMsg('Password reset successfully! You can now sign in.')
                setTimeout(() => {
                    setMode('login')
                    setSuccessMsg('')
                    setPassword('')
                    setOtp('')
                }, 2000)
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={closeAuth}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100 z-10 animate-scale">

                {/* Header Graphic */}
                <div className="bg-stone-900 text-white p-6 relative">
                    <button
                        onClick={closeAuth}
                        className="absolute top-5 right-5 text-stone-400 hover:text-white p-1 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>69 Archive Club</span>
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">
                        {mode === 'login' ? 'Welcome Back.' : mode === 'register' ? 'Join the 69 Club.' : 'Reset Password'}
                    </h2>
                    <p className="text-xs text-stone-400 mt-1">
                        {mode === 'login'
                            ? 'Sign in to access your order history and saved thrift gems.'
                            : mode === 'register'
                                ? 'Create an account for early access to vintage drops and express checkout.'
                                : 'Enter your email and OTP code to reset your account password.'}
                    </p>

                    {/* Mode Switcher Tabs */}
                    {mode !== 'forgot' && (
                        <div className="flex bg-stone-800 rounded-xl p-1 mt-6 text-xs font-bold">
                            <button
                                onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                                className={`flex-1 py-2 rounded-lg transition-all ${mode === 'login' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-white'}`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
                                className={`flex-1 py-2 rounded-lg transition-all ${mode === 'register' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-white'}`}
                            >
                                Create Account
                            </button>
                        </div>
                    )}
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
                            {error}
                        </div>
                    )}

                    {successMsg && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-medium">
                            {successMsg}
                        </div>
                    )}

                    {/* Name Field (Register only) */}
                    {mode === 'register' && (
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    type="text"
                                    placeholder="e.g. Alex River"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Email Field */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                                type="email"
                                placeholder="you@domain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                                required
                            />
                        </div>
                    </div>

                    {/* OTP Field (Forgot password only) */}
                    {mode === 'forgot' && (
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                    6-Digit OTP Code
                                </label>
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={loading}
                                    className="text-[11px] font-bold text-rose-500 hover:text-rose-600 underline"
                                >
                                    {otpSent ? 'Resend OTP' : 'Send OTP Code'}
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="e.g. 123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm tracking-widest text-center font-bold focus:outline-none focus:ring-2 focus:ring-stone-900"
                                required={mode === 'forgot'}
                            />
                        </div>
                    )}

                    {/* Password Field */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                {mode === 'forgot' ? 'New Password' : 'Password'}
                            </label>
                            {mode === 'login' && (
                                <button
                                    type="button"
                                    onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }}
                                    className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 hover:underline"
                                >
                                    Forgot password?
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 focus:outline-none p-1 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Real-Time Password Checklist */}
                        {(mode === 'register' || mode === 'forgot') && password.length > 0 && (
                            <div className="mt-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                                <p className="font-semibold text-stone-600 text-[11px] uppercase tracking-wider mb-1">
                                    Password Requirements:
                                </p>
                                <div className={`flex items-center space-x-1.5 ${hasMinLength ? 'text-emerald-600 font-medium' : 'text-stone-400'}`}>
                                    <span>{hasMinLength ? '✓' : '○'}</span>
                                    <span>At least 8 characters</span>
                                </div>
                                <div className={`flex items-center space-x-1.5 ${hasUpperCase ? 'text-emerald-600 font-medium' : 'text-stone-400'}`}>
                                    <span>{hasUpperCase ? '✓' : '○'}</span>
                                    <span>At least 1 uppercase letter (A-Z)</span>
                                </div>
                                <div className={`flex items-center space-x-1.5 ${hasSpecialChar ? 'text-emerald-600 font-medium' : 'text-stone-400'}`}>
                                    <span>{hasSpecialChar ? '✓' : '○'}</span>
                                    <span>At least 1 special character (!@#$%^&*)</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preferred Department (Register only) */}
                    {mode === 'register' && (
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                                Preferred Style
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {['women', 'men', 'unisex'].map((dept) => (
                                    <button
                                        type="button"
                                        key={dept}
                                        onClick={() => setDepartment(dept)}
                                        className={`py-2 text-xs font-semibold rounded-xl border uppercase tracking-wider transition-all ${department === dept
                                                ? 'border-stone-900 bg-stone-900 text-white'
                                                : 'border-stone-200 text-stone-600 hover:border-stone-400 bg-stone-50'
                                            }`}
                                    >
                                        {dept}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 text-sm mt-2"
                    >
                        {loading
                            ? 'Please wait...'
                            : mode === 'login'
                                ? 'Sign In'
                                : mode === 'register'
                                    ? 'Create My Account'
                                    : 'Reset Password'}
                    </button>

                    {/* Back to Sign In Link (Forgot password only) */}
                    {mode === 'forgot' && (
                        <div className="text-center mt-2">
                            <button
                                type="button"
                                onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                                className="text-xs text-stone-500 hover:text-stone-900 underline font-medium"
                            >
                                ← Back to Sign In
                            </button>
                        </div>
                    )}
                </form>

            </div>
        </div>
    )
}