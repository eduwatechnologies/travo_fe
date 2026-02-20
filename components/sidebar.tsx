import {
  MessageSquare,
  Settings,
  BarChart3,
  Users,
  HelpCircle,
  LogOut,
} from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <span className="font-bold text-sidebar-foreground text-lg">
            SendSMS
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground font-medium hover:bg-sidebar-accent/80 transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Send SMS</span>
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <BarChart3 className="w-5 h-5" />
          <span>Analytics</span>
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <Users className="w-5 h-5" />
          <span>Contacts</span>
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>API Keys</span>
        </a>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Help</span>
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </a>
      </div>
    </aside>
  )
}
