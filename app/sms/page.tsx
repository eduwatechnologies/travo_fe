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
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Send, Smartphone, History, Users, CreditCard, AlertCircle, Info, CheckCircle2, XCircle } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface SmsMessage {
  id: string
  phone: string
  message: string
  senderId: string
  timestamp: Date
  status: string
  credits: number
}

interface WalletSummary {
  creditsRemaining: number
}

export default function SMSPage() {
  const { token } = useAuth()
  const [smsMessages, setSmsMessages] = useState<SmsMessage[]>([])
  const [creditsRemaining, setCreditsRemaining] = useState(0)
  
  // Send Single SMS state
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [senderId, setSenderId] = useState('MyApp')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)

  // Bulk SMS state
  const [bulkPhones, setBulkPhones] = useState('')
  const [bulkMessage, setBulkMessage] = useState('')
  const [bulkSenderId, setBulkSenderId] = useState('MyApp')
  const [bulkSending, setBulkSending] = useState(false)
  const [bulkSuccess, setBulkSuccess] = useState(false)

  const characterCount = message.length
  const characterLimit = 160
  const messageChunks = Math.ceil(characterCount / characterLimit) || 1
  const progressValue = Math.min((characterCount / characterLimit) * 100, 100)

  const bulkCharacterCount = bulkMessage.length
  const bulkMessageChunks = Math.ceil(bulkCharacterCount / characterLimit) || 1
  const bulkProgressValue = Math.min((bulkCharacterCount / characterLimit) * 100, 100)

  useEffect(() => {
    if (!token) return

    async function loadData() {
      try {
        const [summaryRes, smsRes] = await Promise.all([
          fetch(`${API_BASE}/wallet/summary`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/sms`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        if (summaryRes.ok) {
          const data: WalletSummary = await summaryRes.json()
          setCreditsRemaining(data.creditsRemaining ?? 0)
        }

        if (smsRes.ok) {
          const data = await smsRes.json()
          const mapped: SmsMessage[] = (data.sms || []).map((m: any) => ({
            id: m._id,
            phone: m.phone,
            message: m.message,
            senderId: m.senderId,
            timestamp: new Date(m.createdAt),
            status: m.status,
            credits: m.credits,
          }))
          setSmsMessages(mapped)
        }
      } catch {
      }
    }

    loadData()
  }, [token])

  const handleSendSMS = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !message) return

    if (!token) return

    setSending(true)
    setSuccess(false)
    try {
      const res = await fetch(`${API_BASE}/sms/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone, message, senderId }),
      })

      if (!res.ok) {
        return
      }

      const data = await res.json()
      const sms = data.sms
      if (sms) {
        setSmsMessages((prev) => [
          {
            id: sms._id,
            phone: sms.phone,
            message: sms.message,
            senderId: sms.senderId,
            timestamp: new Date(sms.createdAt),
            status: sms.status,
            credits: sms.credits,
          },
          ...prev,
        ])
        setCreditsRemaining((prev) => prev - (sms.credits ?? 1))
      }

      setPhone('')
      setMessage('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } finally {
      setSending(false)
    }
  }

  const handleBulkSMS = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bulkPhones || !bulkMessage) return

    const phones = bulkPhones
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p)

    if (phones.length === 0) return

    if (!token) return

    setBulkSending(true)
    setBulkSuccess(false)
    try {
      const res = await fetch(`${API_BASE}/sms/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phones,
          message: bulkMessage,
          senderId: bulkSenderId,
        }),
      })

      if (!res.ok) {
        return
      }

      const data = await res.json()
      const smsList = data.sms || []

      if (Array.isArray(smsList) && smsList.length > 0) {
        const mapped: SmsMessage[] = smsList.map((sms: any) => ({
          id: sms._id,
          phone: sms.phone,
          message: sms.message,
          senderId: sms.senderId,
          timestamp: new Date(sms.createdAt),
          status: sms.status,
          credits: sms.credits,
        }))

        setSmsMessages((prev) => [...mapped, ...prev])
        setCreditsRemaining((prev) => prev - mapped.reduce((sum, m) => sum + (m.credits ?? 1), 0))
      }

      setBulkPhones('')
      setBulkMessage('')
      setBulkSuccess(true)
      setTimeout(() => setBulkSuccess(false), 3000)
    } finally {
      setBulkSending(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'default' // blue-ish in shadcn usually
      case 'delivered':
        return 'success' // green
      case 'failed':
        return 'destructive' // red
      default:
        return 'secondary'
    }
  }

  // Helper to map status to Badge variant (since Badge usually takes specific variants)
  const getBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
     switch (status) {
      case 'sent':
        return 'secondary'
      case 'delivered':
        return 'default' // Assuming default is acceptable for success, or use custom class
      case 'failed':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <DashboardLayout active="sms">
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SMS Communication</h1>
          <p className="text-muted-foreground">Manage your SMS campaigns and messaging.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Content Area */}
          <div className="md:col-span-2">
            <Tabs defaultValue="single" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="single">Send SMS</TabsTrigger>
                <TabsTrigger value="bulk">Bulk Campaign</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              {/* Single SMS Tab */}
              <TabsContent value="single">
                <Card>
                  <CardHeader>
                    <CardTitle>Send Single Message</CardTitle>
                    <CardDescription>
                      Send a quick message to a single recipient.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSendSMS} className="space-y-4">
                      {success && (
                        <Alert className="bg-green-500/10 text-green-600 border-green-500/20">
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertTitle>Success</AlertTitle>
                          <AlertDescription>Message sent successfully.</AlertDescription>
                        </Alert>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            placeholder="+1 (555) 000-0000"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="senderId">Sender ID</Label>
                          <Input
                            id="senderId"
                            placeholder="MyApp"
                            value={senderId}
                            onChange={(e) => setSenderId(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="message">Message</Label>
                          <span className={`text-xs ${characterCount > characterLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {characterCount}/{characterLimit}
                          </span>
                        </div>
                        <Textarea
                          id="message"
                          placeholder="Type your message here..."
                          className="min-h-[120px]"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          maxLength={480} // Allow up to 3 chunks
                          required
                        />
                        <Progress value={progressValue} className={`h-1 ${characterCount > characterLimit ? 'bg-destructive/20' : ''}`} />
                        <p className="text-xs text-muted-foreground">
                          {messageChunks} credit(s) will be used.
                        </p>
                      </div>

                      <Button type="submit" className="w-full" disabled={sending}>
                        {sending ? 'Sending...' : 'Send Message'}
                        <Send className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Bulk SMS Tab */}
              <TabsContent value="bulk">
                <Card>
                  <CardHeader>
                    <CardTitle>Bulk SMS Campaign</CardTitle>
                    <CardDescription>
                      Send messages to multiple recipients at once.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleBulkSMS} className="space-y-4">
                      {bulkSuccess && (
                        <Alert className="bg-green-500/10 text-green-600 border-green-500/20">
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertTitle>Success</AlertTitle>
                          <AlertDescription>Bulk campaign started successfully.</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="senderId-bulk">Sender ID</Label>
                        <Input
                          id="senderId-bulk"
                          placeholder="MyApp"
                          value={bulkSenderId}
                          onChange={(e) => setBulkSenderId(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phones-bulk">Phone Numbers</Label>
                        <Textarea
                          id="phones-bulk"
                          placeholder="Enter phone numbers, one per line..."
                          className="min-h-[120px] font-mono text-sm"
                          value={bulkPhones}
                          onChange={(e) => setBulkPhones(e.target.value)}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          {bulkPhones.split('\n').filter(p => p.trim()).length} recipients detected.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="message-bulk">Message</Label>
                          <span className={`text-xs ${bulkCharacterCount > characterLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {bulkCharacterCount}/{characterLimit}
                          </span>
                        </div>
                        <Textarea
                          id="message-bulk"
                          placeholder="Type your campaign message here..."
                          className="min-h-[100px]"
                          value={bulkMessage}
                          onChange={(e) => setBulkMessage(e.target.value)}
                          required
                        />
                        <Progress value={bulkProgressValue} className="h-1" />
                         <p className="text-xs text-muted-foreground">
                          {bulkMessageChunks} credit(s) per recipient.
                        </p>
                      </div>

                      <Button type="submit" className="w-full" disabled={bulkSending}>
                        {bulkSending ? 'Processing...' : 'Launch Campaign'}
                        <Users className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Message History</CardTitle>
                    <CardDescription>
                      View your recently sent messages.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Status</TableHead>
                          <TableHead>To</TableHead>
                          <TableHead>Sender ID</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {smsMessages.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              No messages found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          smsMessages.map((msg) => (
                            <TableRow key={msg.id}>
                              <TableCell>
                                <Badge variant={getBadgeVariant(msg.status)}>
                                  {msg.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">{msg.phone}</TableCell>
                              <TableCell>{msg.senderId}</TableCell>
                              <TableCell className="max-w-[200px] truncate" title={msg.message}>
                                {msg.message}
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

          {/* Sidebar / Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{creditsRemaining.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  ~{creditsRemaining} standard messages
                </p>
                <div className="mt-4 pt-4 border-t space-y-2">
                   <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cost per SMS</span>
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
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Keep messages under 160 characters to save credits.</p>
                <p>• Use a clear Sender ID for better delivery rates.</p>
                <p>• Avoid using special characters unless necessary.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
