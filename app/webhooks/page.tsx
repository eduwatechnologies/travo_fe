'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import DashboardLayout from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Webhook, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Globe, 
  Activity,
  Code,
  ExternalLink,
  ShieldAlert
} from 'lucide-react'
import { toast } from 'sonner'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface WebhookRecord {
  id: string
  url: string
  events: string[]
  isActive: boolean
  createdAt: Date
  lastTriggeredAt: Date | null
}

interface WebhookLogRecord {
  id: string
  event: string
  statusCode: number | null
  success: boolean
  errorMessage?: string | null
  createdAt: Date
  url: string | null
}

export default function WebhooksPage() {
  const { token } = useAuth()
  const [webhooks, setWebhooks] = useState<WebhookRecord[]>([])
  const [logs, setLogs] = useState<WebhookLogRecord[]>([])
  
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['sms.sent', 'email.sent'])

  useEffect(() => {
    if (!token) return

    async function loadData() {
      try {
        const [webhookRes, logsRes] = await Promise.all([
          fetch(`${API_BASE}/webhooks`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/webhooks/logs`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        if (webhookRes.ok) {
          const data = await webhookRes.json()
          const mapped: WebhookRecord[] = (data.webhooks || []).map((w: any) => ({
            id: w._id,
            url: w.url,
            events: w.events || [],
            isActive: w.isActive,
            createdAt: new Date(w.createdAt),
            lastTriggeredAt: w.lastTriggeredAt ? new Date(w.lastTriggeredAt) : null,
          }))
          setWebhooks(mapped)
        }

        if (logsRes.ok) {
          const data = await logsRes.json()
          const mappedLogs: WebhookLogRecord[] = (data.logs || []).map((log: any) => ({
            id: log._id,
            event: log.event,
            statusCode: typeof log.statusCode === 'number' ? log.statusCode : null,
            success: !!log.success,
            errorMessage: log.errorMessage ?? null,
            createdAt: new Date(log.createdAt),
            url: log.webhook?.url ?? null,
          }))
          setLogs(mappedLogs)
        }
      } catch {
      }
    }

    loadData()
  }, [token])

  const availableEvents = [
    { id: 'sms.sent', label: 'SMS Sent', description: 'Triggered when an SMS is successfully sent' },
    { id: 'sms.delivered', label: 'SMS Delivered', description: 'Triggered when an SMS delivery report is received' },
    { id: 'sms.failed', label: 'SMS Failed', description: 'Triggered when an SMS fails to send or deliver' },
    { id: 'email.sent', label: 'Email Sent', description: 'Triggered when an email is successfully sent' },
    { id: 'email.bounced', label: 'Email Bounced', description: 'Triggered when an email bounces' },
    { id: 'email.failed', label: 'Email Failed', description: 'Triggered when an email fails to send' },
  ]

  const handleAddWebhook = async () => {
    if (!url || selectedEvents.length === 0 || !token) return

    try {
      const res = await fetch(`${API_BASE}/webhooks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url, events: selectedEvents }),
      })

      if (!res.ok) {
        return
      }

      const data = await res.json()
      const w = data.webhook
      if (w) {
        const record: WebhookRecord = {
          id: w._id,
          url: w.url,
          events: w.events || [],
          isActive: w.isActive,
          createdAt: new Date(w.createdAt),
          lastTriggeredAt: w.lastTriggeredAt ? new Date(w.lastTriggeredAt) : null,
        }
        setWebhooks((prev) => [record, ...prev])
      }

      setUrl('')
      setSelectedEvents(['sms.sent', 'email.sent'])
      setIsAddOpen(false)
      toast.success('Webhook created successfully')
    } catch {
    }
  }

  const toggleEvent = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((e) => e !== eventId) : [...prev, eventId]
    )
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <DashboardLayout active="webhooks">
      <div className="flex flex-col gap-6 p-6">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Webhook className="h-8 w-8 text-primary" />
              Webhooks
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure webhooks to receive real-time event notifications for your application.
            </p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Webhook
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Webhook</DialogTitle>
                <DialogDescription>
                  Enter the endpoint URL and select the events you want to subscribe to.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Endpoint URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://api.yourdomain.com/webhooks/travo"
                      className="pl-9"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We'll send a POST request to this URL when events occur.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label>Events to Subscribe</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableEvents.map((event) => (
                      <div 
                        key={event.id}
                        className={`
                          flex items-start space-x-3 p-3 rounded-md border transition-colors cursor-pointer
                          ${selectedEvents.includes(event.id) 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'}
                        `}
                        onClick={() => toggleEvent(event.id)}
                      >
                        <Checkbox 
                          checked={selectedEvents.includes(event.id)}
                          onCheckedChange={() => toggleEvent(event.id)}
                          id={event.id}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={event.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {event.label}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button onClick={handleAddWebhook} disabled={!url || selectedEvents.length === 0}>
                  Create Webhook
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active">Active Webhooks</TabsTrigger>
                <TabsTrigger value="logs">Delivery Logs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-4 mt-4">
                {webhooks.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Webhook className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No webhooks configured</h3>
                      <p className="text-muted-foreground max-w-sm mb-6">
                        Create your first webhook to start receiving real-time updates about your SMS and Email activities.
                      </p>
                      <Button onClick={() => setIsAddOpen(true)}>
                        Create Webhook
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  webhooks.map((webhook) => (
                    <Card key={webhook.id} className="overflow-hidden transition-all hover:shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-base font-mono break-all flex items-center gap-2">
                              {webhook.url}
                              <Badge variant={webhook.isActive ? "default" : "secondary"} className={webhook.isActive ? "bg-green-500 hover:bg-green-600" : ""}>
                                {webhook.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 text-xs">
                              <Clock className="h-3 w-3" />
                              Created {formatDate(webhook.createdAt)}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={webhook.isActive}
                              onCheckedChange={async () => {
                                if (!token) return
                                try {
                                  const res = await fetch(`${API_BASE}/webhooks/${webhook.id}/toggle`, {
                                    method: 'PATCH',
                                    headers: { Authorization: `Bearer ${token}` },
                                  })

                                  if (!res.ok) {
                                    return
                                  }

                                  const data = await res.json()
                                  const w = data.webhook
                                  if (w) {
                                    setWebhooks((prev) =>
                                      prev.map((item) =>
                                        item.id === webhook.id
                                          ? {
                                              ...item,
                                              isActive: w.isActive,
                                            }
                                          : item
                                      )
                                    )
                                  }
                                } catch {
                                }
                              }}
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Subscribed Events</p>
                            <div className="flex flex-wrap gap-2">
                              {webhook.events.map((event) => (
                                <Badge key={event} variant="outline" className="bg-secondary/50">
                                  {event}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                            <div className="flex items-center gap-1.5">
                              <Activity className="h-4 w-4" />
                              <span>Last triggered: <span className="text-foreground font-medium">{formatDate(webhook.lastTriggeredAt)}</span></span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/50 py-3 flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={async () => {
                            if (!token) return
                            try {
                              const res = await fetch(`${API_BASE}/webhooks/${webhook.id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` },
                              })
                              if (res.ok || res.status === 204 || res.status === 404) {
                                setWebhooks((prev) => prev.filter((w) => w.id !== webhook.id))
                              }
                            } catch {
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="logs" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Deliveries</CardTitle>
                    <CardDescription>
                      Log of recent webhook delivery attempts and their status codes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {logs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                        <Activity className="h-12 w-12 mb-4 opacity-20" />
                        <p>No delivery logs available yet.</p>
                        <p className="text-sm">Trigger an event to see webhook activity here.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {logs.map((log) => (
                          <div
                            key={log.id}
                            className="flex items-start justify-between border-b last:border-b-0 py-3 text-sm"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant={log.success ? 'secondary' : 'destructive'}>
                                  {log.success ? 'Success' : 'Failed'}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {log.statusCode ?? '—'}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                <span className="font-medium">{log.event}</span>
                                {log.url && <span className="ml-2">{log.url}</span>}
                              </div>
                              {log.errorMessage && (
                                <div className="text-xs text-red-500">
                                  {log.errorMessage}
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(log.createdAt)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Code className="h-5 w-5" />
                  Payload Format
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We send a POST request with a JSON payload containing the event details.
                </p>
                <div className="bg-card border rounded-md p-3 overflow-x-auto">
                  <pre className="text-xs font-mono text-foreground">
{`{
  "event": "sms.delivered",
  "timestamp": "2024-02-13T10:30:00Z",
  "data": {
    "id": "msg_123...",
    "status": "delivered",
    "recipient": "+1234567890"
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-orange-500" />
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Verify Signatures
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Always verify the <code className="bg-muted px-1 rounded">X-Travo-Signature</code> header to ensure requests are genuine.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Respond Quickly
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Return a 200 OK within 30 seconds. Process heavy logic asynchronously.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    Retry Logic
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    We will retry failed deliveries up to 5 times with exponential backoff.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full text-xs" size="sm">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  View Developer Docs
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
