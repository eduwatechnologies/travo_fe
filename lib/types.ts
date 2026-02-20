export interface User {
  id: string
  email: string
  name: string
  companyName: string
  createdAt: Date
  plan: 'Free' | 'Growth' | 'Enterprise'
}

export interface SMSMessage {
  id: string
  phone: string
  message: string
  senderId: string
  timestamp: Date
  status: 'sent' | 'delivered' | 'failed'
  credits: number
}

export interface EmailMessage {
  id: string
  recipient: string
  subject: string
  message: string
  timestamp: Date
  status: 'sent' | 'delivered' | 'failed' | 'bounced'
}

export interface Transaction {
  id: string
  type: 'purchase' | 'usage' | 'refund'
  amount: number
  credits: number
  description: string
  timestamp: Date
  status: 'completed' | 'pending' | 'failed'
}

export interface APIKey {
  id: string
  name: string
  key: string
  createdAt: Date
  lastUsedAt: Date | null
  isActive: boolean
}

export interface WebhookEndpoint {
  id: string
  url: string
  events: string[]
  isActive: boolean
  createdAt: Date
  lastTriggeredAt: Date | null
}

export interface DashboardStats {
  totalSMSSent: number
  totalEmailsSent: number
  smsDeliveryRate: number
  emailDeliveryRate: number
  creditsRemaining: number
  creditsUsedThisMonth: number
}
