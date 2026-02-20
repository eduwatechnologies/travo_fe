'use client'

import { useAuth } from '@/lib/auth-context'
import { useApp } from '@/lib/app-context'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, ReactNode } from 'react'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Mail, 
  Wallet, 
  Key, 
  Webhook, 
  Settings, 
  LogOut,
  Zap,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const { creditsRemaining } = useApp()
  const router = useRouter()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const navigationItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Send SMS', href: '/sms', icon: MessageSquare },
    { label: 'Send Email', href: '/email', icon: Mail },
    { label: 'Wallet', href: '/wallet', icon: Wallet },
    { label: 'API Keys', href: '/api-keys', icon: Key },
    { label: 'Webhooks', href: '/webhooks', icon: Webhook },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]

  const planLabel = user?.plan ?? 'Free'
  const isPaid = planLabel !== 'Free'
  const planBadgeClasses = isPaid
    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
    : 'bg-amber-50 text-amber-700 border border-amber-200'

  const routeMeta: Record<string, { title: string; description: string }> = {
    '/dashboard': {
      title: 'Dashboard',
      description: "Overview of your messaging performance and usage.",
    },
    '/sms': {
      title: 'Send SMS',
      description: 'Create and monitor SMS campaigns.',
    },
    '/email': {
      title: 'Send Email',
      description: 'Compose and track email messages.',
    },
    '/wallet': {
      title: 'Wallet',
      description: 'Manage your credits and billing balance.',
    },
    '/api-keys': {
      title: 'API Keys',
      description: 'Manage API credentials for your integrations.',
    },
    '/webhooks': {
      title: 'Webhooks',
      description: 'Configure real-time event notifications.',
    },
    '/settings': {
      title: 'Settings',
      description: 'Manage your account and workspace preferences.',
    },
  }

  const currentMeta =
    routeMeta[pathname] ?? {
      title: 'Overview',
      description: '',
    }

  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar */}
      <aside 
        className={`relative border-r border-border bg-card flex flex-col transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-9 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:text-foreground hover:shadow-md transition-all"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        <div className={`p-6 border-b border-border flex items-center gap-2 ${isCollapsed ? 'justify-center px-2' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shrink-0">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-foreground overflow-hidden whitespace-nowrap transition-all duration-300">
          Travo
            </h1>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <TooltipProvider>
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 py-2.5 rounded-lg transition-all duration-200 group ${
                        isCollapsed ? 'justify-center px-2' : 'px-3'
                      } ${
                        isActive
                          ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                          : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary'}`} />
                      {!isCollapsed && <span className="overflow-hidden whitespace-nowrap transition-all duration-300">{item.label}</span>}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </nav>

        {user && (
          <div className={`border-t border-border p-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
            {!isCollapsed ? (
              <>
                <div className="flex items-center gap-3 mb-4 px-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                    {user.name?.[0] || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4 items-center w-full">
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold cursor-help">
                        {user.name?.[0] || 'U'}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip delayDuration={0}>
                     <TooltipTrigger asChild>
                        <button
                          onClick={handleLogout}
                          className="flex items-center justify-center p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <LogOut className="w-5 h-5" />
                        </button>
                     </TooltipTrigger>
                     <TooltipContent side="right">Logout</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-muted/10">
        <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto flex  flex-col gap-4 px-10 py-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold tracking-tight ">
                  {currentMeta.title}
                </h1>
                {user && (
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${planBadgeClasses}`}>
                    {isPaid ? `${planLabel} plan` : 'Free plan'}
                  </span>
                )}
              </div>
              {currentMeta.description && (
                <p className="text-xs text-muted-foreground">
                  {currentMeta.description}
                </p>
              )}
            </div>
            {user && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-xs md:text-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="font-medium text-foreground">
                    {creditsRemaining.toLocaleString()} credits available
                  </span>
                </div>
                {!isPaid && (
                  <Link
                    href="/settings"
                    className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-xs md:text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    Upgrade plan
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
        <div className=" px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
