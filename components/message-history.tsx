'use client'

import { CheckCircle2, Clock, AlertCircle, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface Message {
  id: string
  phone: string
  message: string
  senderId: string
  timestamp: Date
  status: 'sent' | 'delivered' | 'failed'
}

interface MessageHistoryProps {
  messages: Message[]
}

export default function MessageHistory({ messages }: MessageHistoryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getStatusBadge = (status: Message['status']) => {
    switch (status) {
      case 'delivered':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered
          </div>
        )
      case 'sent':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium">
            <Clock className="w-3.5 h-3.5" />
            Sent
          </div>
        )
      case 'failed':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 text-xs font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            Failed
          </div>
        )
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Message History</h2>
        <p className="text-muted-foreground text-sm">
          View all sent messages and their delivery status
        </p>
      </div>

      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Sender ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-border">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Clock className="w-8 h-8 text-muted-foreground/40" />
                      <p className="text-muted-foreground">No messages sent yet</p>
                      <p className="text-xs text-muted-foreground/70">
                        Send your first SMS to see it here
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr
                    key={msg.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-foreground">{msg.phone}</p>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-foreground truncate" title={msg.message}>
                        {msg.message}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded text-sm font-medium">
                        {msg.senderId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(msg.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {formatTime(msg.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => copyToClipboard(msg.message, msg.id)}
                        className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Footer Stats */}
      {messages.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-sm mb-1">Total Sent</p>
            <p className="text-2xl font-bold text-foreground">
              {messages.length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-sm mb-1">Delivered</p>
            <p className="text-2xl font-bold text-green-400">
              {messages.filter((m) => m.status === 'delivered').length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-sm mb-1">Failed</p>
            <p className="text-2xl font-bold text-red-400">
              {messages.filter((m) => m.status === 'failed').length}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
