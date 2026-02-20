'use client'

import React, { createContext, useContext, useState } from 'react'
import { SMSMessage, EmailMessage, Transaction, APIKey, WebhookEndpoint, DashboardStats } from './types'

interface AppContextType {
  // SMS
  smsMessages: SMSMessage[]
  sendSMS: (phone: string, message: string, senderId: string) => void
  sendBulkSMS: (phones: string[], message: string, senderId: string) => void
  
  // Email
  emailMessages: EmailMessage[]
  sendEmail: (recipient: string, subject: string, message: string) => void
  
  // Transactions
  transactions: Transaction[]
  buyCredits: (amount: number) => void
  
  // API Keys
  apiKeys: APIKey[]
  createAPIKey: (name: string) => APIKey
  deleteAPIKey: (id: string) => void
  
  // Webhooks
  webhooks: WebhookEndpoint[]
  addWebhook: (url: string, events: string[]) => void
  updateWebhook: (id: string, url: string, events: string[]) => void
  deleteWebhook: (id: string) => void
  toggleWebhook: (id: string) => void
  
  // Stats
  stats: DashboardStats
  creditsRemaining: number
  addCredits: (amount: number) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [smsMessages, setSmsMessages] = useState<SMSMessage[]>([])
  const [emailMessages, setEmailMessages] = useState<EmailMessage[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([])
  const [creditsRemaining, setCreditsRemaining] = useState(0)

  const sendSMS = (phone: string, message: string, senderId: string) => {
    const newMessage: SMSMessage = {
      id: String(smsMessages.length + 1),
      phone,
      message,
      senderId,
      timestamp: new Date(),
      status: 'sent',
      credits: 1,
    }
    setSmsMessages(prev => [newMessage, ...prev])
    setCreditsRemaining(prev => Math.max(0, prev - 1))
  }

  const sendBulkSMS = (phones: string[], message: string, senderId: string) => {
    const newMessages: SMSMessage[] = phones.map((phone, idx) => ({
      id: String(smsMessages.length + idx + 1),
      phone,
      message,
      senderId,
      timestamp: new Date(),
      status: Math.random() > 0.1 ? 'sent' : 'failed',
      credits: 1,
    }))
    setSmsMessages(prev => [...newMessages, ...prev])
    setCreditsRemaining(prev => Math.max(0, prev - phones.length))
  }

  const sendEmail = (recipient: string, subject: string, message: string) => {
    const newMessage: EmailMessage = {
      id: String(emailMessages.length + 1),
      recipient,
      subject,
      message,
      timestamp: new Date(),
      status: 'sent',
    }
    setEmailMessages(prev => [newMessage, ...prev])
    setCreditsRemaining(prev => Math.max(0, prev - 1))
  }

  const buyCredits = (amount: number) => {
    const credits = amount * 100 // 1 dollar = 100 credits
    const transaction: Transaction = {
      id: String(transactions.length + 1),
      type: 'purchase',
      amount,
      credits,
      description: `Purchased ${credits} credits`,
      timestamp: new Date(),
      status: 'completed',
    }
    setTransactions(prev => [transaction, ...prev])
    setCreditsRemaining(prev => prev + credits)
  }

  const createAPIKey = (name: string): APIKey => {
    const newKey: APIKey = {
      id: String(apiKeys.length + 1),
      name,
      key: `travo_${Math.random().toString(36).substring(2, 30)}`,
      createdAt: new Date(),
      lastUsedAt: null,
      isActive: true,
    }
    setApiKeys(prev => [...prev, newKey])
    return newKey
  }

  const deleteAPIKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id))
  }

  const addWebhook = (url: string, events: string[]) => {
    const newWebhook: WebhookEndpoint = {
      id: String(webhooks.length + 1),
      url,
      events,
      isActive: true,
      createdAt: new Date(),
      lastTriggeredAt: null,
    }
    setWebhooks(prev => [...prev, newWebhook])
  }

  const updateWebhook = (id: string, url: string, events: string[]) => {
    setWebhooks(prev =>
      prev.map(webhook =>
        webhook.id === id ? { ...webhook, url, events } : webhook
      )
    )
  }

  const deleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(webhook => webhook.id !== id))
  }

  const toggleWebhook = (id: string) => {
    setWebhooks(prev =>
      prev.map(webhook =>
        webhook.id === id ? { ...webhook, isActive: !webhook.isActive } : webhook
      )
    )
  }

  const stats: DashboardStats = {
    totalSMSSent: smsMessages.filter(m => m.status !== 'failed').length,
    totalEmailsSent: emailMessages.filter(m => m.status !== 'failed').length,
    smsDeliveryRate: 94,
    emailDeliveryRate: 97,
    creditsRemaining,
    creditsUsedThisMonth: 1842,
  }

  return (
    <AppContext.Provider
      value={{
        smsMessages,
        sendSMS,
        sendBulkSMS,
        emailMessages,
        sendEmail,
        transactions,
        buyCredits,
        apiKeys,
        createAPIKey,
        deleteAPIKey,
        webhooks,
        addWebhook,
        updateWebhook,
        deleteWebhook,
        toggleWebhook,
        stats,
        creditsRemaining,
        addCredits: buyCredits,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
