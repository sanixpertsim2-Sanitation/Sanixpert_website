import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, signIn, signUp } from '@/lib/supabase.js'

/**
 * Login.jsx
 * ---------
 * Email/password authentication with sign-up toggle.
 * - Handles both login and registration flows
 * - Form validation for required fields and email format
 * - Loading states during auth operations
 * - Error message display
 * - After successful sign-up, creates profile entry automatically
 * - Redirects to home (/) on successful auth
 */
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  /**
   * Validate email format using regex
   */
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  /**
   * Handle form submission — either login or sign-up
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // --- Validation ---
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (isSignUp && !fullName.trim()) {
      setError('Please enter your full name.')
      return
    }

    setLoading(true)

    try {
      if (isSignUp) {
        // --- Sign up flow ---
        const { data, error: signUpError } = await signUp(email, password)
        if (signUpError) throw signUpError

        // Create profile entry manually after sign-up
        if (data?.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              full_name: fullName.trim(),
              email: email.trim().toLowerCase(),
              role: 'employee', // default role
              created_at: new Date().toISOString()
            })
          if (profileError) {
            console.error('Profile creation error:', profileError)
            // Don't block the user — profile may be created via trigger
          }
        }

        setSuccess('Account created! You can now sign in.')
        setIsSignUp(false)
        setPassword('')
        setFullName('')
      } else {
        // --- Sign in flow ---
        const { error: signInError } = await signIn(email, password)
        if (signInError) throw signInError
        navigate('/')
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Toggle between login and sign-up mode
   */
  const toggleMode = () => {
    setIsSignUp((prev) => !prev)
    setError('')
    setSuccess('')
  }

  return (
    <div className="page login-page">
      <div className="login-card card">
        {/* Logo */}
        <div className="login-logo">
          <div className="logo-icon">SE</div>
          <h1>SaniExpert</h1>
          <p>Digital Checklist System</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Error / Success messages */}
          {error && <div className="toast toast-error">{error}</div>}
          {success && <div className="toast toast-success">{success}</div>}

          {/* Full name — only for sign-up */}
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                disabled={loading}
                className="form-input"
              />
            </div>
          )}

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              disabled={loading}
              className="form-input"
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignUp ? 'Min 6 characters' : 'Your password'}
              disabled={loading}
              className="form-input"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: '8px' }}
          >
            {loading
              ? (isSignUp ? 'Creating account...' : 'Signing in...')
              : (isSignUp ? 'Create Account' : 'Sign In')
            }
          </button>

          {/* Toggle login / sign-up */}
          <p className="text-center text-sm" style={{ marginTop: '16px', color: 'var(--color-text-muted)' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary font-medium"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              disabled={loading}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
