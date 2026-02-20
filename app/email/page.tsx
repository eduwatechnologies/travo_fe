'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import DashboardLayout from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Send, Mail, FileText, History, AlertCircle, CheckCircle2, CreditCard, Copy } from 'lucide-react'
import { Separator } from "@/components/ui/separator"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface EmailMessageRecord {
  id: string
  recipient: string
  subject: string
  message: string
  timestamp: Date
  status: string
}

interface WalletSummary {
  creditsRemaining: number
}

export default function EmailPage() {
  const { token } = useAuth()
  const [emailMessages, setEmailMessages] = useState<EmailMessageRecord[]>([])
  const [creditsRemaining, setCreditsRemaining] = useState(0)
  
  // Tab state
  const [activeTab, setActiveTab] = useState("compose")

  // Form state
  const [recipient, setRecipient] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) return

    async function loadData() {
      try {
        const [summaryRes, emailRes] = await Promise.all([
          fetch(`${API_BASE}/wallet/summary`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/email`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        if (summaryRes.ok) {
          const data: WalletSummary = await summaryRes.json()
          setCreditsRemaining(data.creditsRemaining ?? 0)
        }

        if (emailRes.ok) {
          const data = await emailRes.json()
          const mapped: EmailMessageRecord[] = (data.emails || []).map((e: any) => ({
            id: e._id,
            recipient: e.recipient,
            subject: e.subject,
            message: e.message,
            timestamp: new Date(e.createdAt),
            status: e.status,
          }))
          setEmailMessages(mapped)
        }
      } catch {
      }
    }

    loadData()
  }, [token])

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipient || !subject || !message) return

    if (!token) return

    setSending(true)
    setSuccess(false)
    try {
      const res = await fetch(`${API_BASE}/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipient, subject, message }),
      })

      if (!res.ok) {
        return
      }

      const data = await res.json()
      const email = data.email
      if (email) {
        setEmailMessages((prev) => [
          {
            id: email._id,
            recipient: email.recipient,
            subject: email.subject,
            message: email.message,
            timestamp: new Date(email.createdAt),
            status: email.status,
          },
          ...prev,
        ])
        setCreditsRemaining((prev) => prev - 1)
      }

      setRecipient('')
      setSubject('')
      setMessage('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } finally {
      setSending(false)
    }
  }

  const handleUseTemplate = (templateSubject: string, templateBody: string) => {
    setSubject(templateSubject)
    setMessage(templateBody)
    setActiveTab("compose")
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'sent':
        return 'secondary'
      case 'delivered':
        return 'default'
      case 'bounced':
      case 'failed':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const templates = [
    {
      title: 'Welcome Email',
      subject: 'Welcome to Travo!',
      body: 'Welcome to our platform! We\'re excited to have you on board. Get started by exploring your dashboard.',
    },
    {
      title: 'Password Reset',
      subject: 'Reset Your Password',
      body: 'We received a request to reset your password. Click the link below to create a new password:\n\n[Reset Link]\n\nIf you didn\'t request this, please ignore this email.',
    },
    {
      title: 'Verification Code',
      subject: 'Your Verification Code',
      body: 'Your verification code is: 123456\n\nDo not share this code with anyone.',
    },
    {
      title: 'Order Confirmation',
      subject: 'Order #12345 Confirmed',
      body: 'Thank you for your order! We have received your payment and will process your items shortly.',
    },
  ]

  return (
    <DashboardLayout active="email">
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Communication</h1>
          <p className="text-muted-foreground">Compose, manage, and track your email campaigns.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="compose">Compose</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              {/* Compose Tab */}
              <TabsContent value="compose">
                <Card>
                  <CardHeader>
                    <CardTitle>Compose Email</CardTitle>
                    <CardDescription>Send a transactional or marketing email.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSendEmail} className="space-y-4">
                      {success && (
                        <Alert className="bg-green-500/10 text-green-600 border-green-500/20">
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertTitle>Success</AlertTitle>
                          <AlertDescription>Email sent successfully.</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="recipient">Recipient</Label>
                        <Input
                          id="recipient"
                          type="email"
                          placeholder="user@example.com"
                          value={recipient}
                          onChange={(e) => setRecipient(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="Email subject line"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="message">Message Body</Label>
                          <span className="text-xs text-muted-foreground">HTML supported</span>
                        </div>
                        <Textarea
                          id="message"
                          placeholder="Type your email content here..."
                          className="min-h-[200px] font-sans"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={sending}>
                        {sending ? 'Sending...' : 'Send Email'}
                        <Send className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Templates Tab */}
              <TabsContent value="templates">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Templates</CardTitle>
                    <CardDescription>Quickly start with pre-defined templates.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {templates.map((template, idx) => (
                        <Card key={idx} className="cursor-pointer hover:bg-secondary/50 transition-colors border-dashed" onClick={() => handleUseTemplate(template.subject, template.body)}>
                          <CardHeader className="p-4">
                            <CardTitle className="text-base flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              {template.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                            <p className="line-clamp-3">{template.body}</p>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Button variant="ghost" size="sm" className="w-full text-xs h-8">
                              Use Template
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Email History</CardTitle>
                    <CardDescription>View your recently sent emails.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Status</TableHead>
                          <TableHead>To</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {emailMessages.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                              No emails found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          emailMessages.map((msg) => (
                            <TableRow key={msg.id}>
                              <TableCell>
                                <Badge variant={getBadgeVariant(msg.status)}>
                                  {msg.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">{msg.recipient}</TableCell>
                              <TableCell className="max-w-[200px] truncate" title={msg.subject}>
                                {msg.subject}
                              </TableCell>
                              <TableCell className="text-right text-muted-foreground text-sm">
                                {formatDate(msg.timestamp)}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Email Quota</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{creditsRemaining.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Credits remaining
                </p>
                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cost per Email</span>
                    <span className="font-medium">1 Credit</span>
                  </div>
                  <Button className="w-full" variant="outline">
                    <CreditCard className="mr-2 h-4 w-4" /> Top Up
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary text-sm">
                  <AlertCircle className="h-4 w-4" />
                  Deliverability Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Avoid spammy subject lines (e.g., ALL CAPS, "FREE").</p>
                <p>• Include a clear unsubscribe link in marketing emails.</p>
                <p>• Verify your domain to improve sender reputation.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
