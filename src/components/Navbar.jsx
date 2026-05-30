import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  supabase,
  signOut,
  getCurrentUser,
  getProfile
} from '@/lib/supabase.js'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet'
import {
  Menu,
  LayoutDashboard,
  ClipboardList,
  Users,
  ShieldCheck,
  SearchCheck,
  LogOut,
  Home,
  Factory
} from 'lucide-react'

/**
 * Navbar.jsx
 * ----------
 * Sticky top navigation bar with role-based links.
 * - Shows SaniExpert branding on the left
 * - Hamburger sheet menu on mobile with all navigation links
 * - Links filtered by user role (employee / area_lead / admin)
 * - Displays user name and role badge
 * - Logout button with confirmation
 * - Active route highlighting
 * - Hidden on the login page
 */
export default function Navbar() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Check if we're on the login page — hide navbar
  const isLoginPage = location.pathname === '/login'

  /**
   * Fetch current user and profile on mount + auth state changes
   */
  useEffect(() => {
    let mounted = true

    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!mounted) return
        setUser(currentUser)

        if (currentUser?.id) {
          const profileData = await getProfile(currentUser.id)
          if (mounted) setProfile(profileData)
        }
      } catch {
        if (mounted) {
          setUser(null)
          setProfile(null)
        }
      }
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user ?? null
        setUser(u)
        if (u?.id) {
          getProfile(u.id).then(setProfile).catch(() => setProfile(null))
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  /**
   * Handle logout — clear state and reload to login
   */
  const handleLogout = async () => {
    try {
      await signOut()
      setUser(null)
      setProfile(null)
      window.location.href = '/login'
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  // Don't render navbar if not logged in or on login page
  if (!user || isLoginPage) return null

  const role = profile?.role || 'employee'
  const userName = profile?.full_name || user.email?.split('@')[0] || 'User'

  /**
   * Build navigation links based on user role
   */
  const getNavLinks = () => {
    const links = [
      { to: '/', label: 'Home', icon: Home },
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]

    // Employee links
    if (role === 'employee') {
      links.push({ to: '/my-assignments', label: 'My Assignments', icon: ClipboardList })
    }

    // Area Lead links
    if (role === 'area_lead' || role === 'admin') {
      links.push(
        { to: '/verify-lines', label: 'Verify Lines', icon: SearchCheck },
        { to: '/findings', label: 'Findings', icon: ShieldCheck }
      )
    }

    // Admin links
    if (role === 'admin') {
      links.push({ to: '/users', label: 'User Management', icon: Users })
    }

    return links
  }

  const navLinks = getNavLinks()

  /**
   * Get a readable role badge label
   */
  const getRoleBadgeClass = () => {
    switch (role) {
      case 'admin': return 'badge badge-danger'
      case 'area_lead': return 'badge badge-secondary'
      default: return 'badge badge-raw'
    }
  }

  const getRoleLabel = () => {
    switch (role) {
      case 'admin': return 'Admin'
      case 'area_lead': return 'Area Lead'
      default: return 'Employee'
    }
  }

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand" onClick={() => navigate('/')}>
        <Factory className="text-primary" size={24} />
        <span className="navbar-title">SaniExpert</span>
      </div>

      {/* Actions: user badge + menu */}
      <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* User info — desktop only */}
        <div
          className="hidden md:flex items-center gap-2"
          style={{ fontSize: '0.85rem' }}
        >
          <span className="text-muted">{userName}</span>
          <span className={getRoleBadgeClass()}>{getRoleLabel()}</span>
        </div>

        {/* Mobile hamburger sheet menu */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button className="navbar-btn" aria-label="Open menu">
              <Menu size={20} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-3/4 sm:max-w-sm">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Factory size={20} className="text-primary" />
                SaniExpert Menu
              </SheetTitle>
            </SheetHeader>

            {/* User info in menu */}
            <div className="flex flex-col gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <div className="font-medium">{userName}</div>
              <div>
                <span className={getRoleBadgeClass()}>{getRoleLabel()}</span>
              </div>
              <div className="text-sm text-muted">{user.email}</div>
            </div>

            {/* Navigation links */}
            <div className="flex flex-col py-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to
                const Icon = link.icon
                return (
                  <SheetClose asChild key={link.to}>
                    <Link
                      to={link.to}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors"
                      style={{
                        color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                        background: isActive ? 'var(--color-primary-light)' : 'transparent',
                        borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent'
                      }}
                      onClick={() => setMenuOpen(false)}
                    >
                      <Icon size={18} />
                      {link.label}
                    </Link>
                  </SheetClose>
                )
              })}
            </div>

            {/* Logout at bottom */}
            <div className="mt-auto px-4 py-4" style={{ borderTop: '1px solid var(--color-border)' }}>
              <button
                onClick={handleLogout}
                className="btn btn-danger btn-full flex items-center justify-center gap-2"
                style={{ fontSize: '0.9rem' }}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
