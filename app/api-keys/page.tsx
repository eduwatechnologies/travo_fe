'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import DashboardLayout from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Key, Copy, Check, Plus, Trash2, Shield, AlertTriangle, Terminal, Eye, EyeOff } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface ApiKeyRecord {
  id: string
  name: string
  key: string
  isActive: boolean
  createdAt: Date
  lastUsedAt?: Date | null
}

export default function APIKeysPage() {
  const { token } = useAuth()
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([])
  const [newKeyName, setNewKeyName] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!token) return

    async function loadKeys() {
      try {
        const res = await fetch(`${API_BASE}/api-keys`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          return
        }

        const data = await res.json()
        const mapped: ApiKeyRecord[] = (data.keys || []).map((k: any) => ({
          id: k._id,
          name: k.name,
          key: k.key,
          isActive: k.isActive,
          createdAt: new Date(k.createdAt),
          lastUsedAt: k.lastUsedAt ? new Date(k.lastUsedAt) : null,
        }))
        setApiKeys(mapped)
      } catch {
      }
    }

    loadKeys()
  }, [token])

  const handleCreateKey = async () => {
    if (!newKeyName.trim() || !token) return

    try {
      const res = await fetch(`${API_BASE}/api-keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newKeyName }),
      })

      if (!res.ok) {
        return
      }

      const data = await res.json()
      const key = data.key
      if (key) {
        const record: ApiKeyRecord = {
          id: key._id,
          name: key.name,
          key: key.key,
          isActive: key.isActive,
          createdAt: new Date(key.createdAt),
          lastUsedAt: key.lastUsedAt ? new Date(key.lastUsedAt) : null,
        }
        setApiKeys((prev) => [record, ...prev])
      }

      setNewKeyName('')
      setIsDialogOpen(false)
    } catch {
    }
  }

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleKeyVisibility = (id: string) => {
    const newVisibleKeys = new Set(visibleKeys)
    if (newVisibleKeys.has(id)) {
      newVisibleKeys.delete(id)
    } else {
      newVisibleKeys.add(id)
    }
    setVisibleKeys(newVisibleKeys)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <DashboardLayout active="api-keys">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
            <p className="text-muted-foreground">Manage authentication keys for your applications.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create New Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create API Key</DialogTitle>
                <DialogDescription>
                  Enter a name for your new API key to identify it later.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Key Name</Label>
                  <Input
                    id="name"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g. Production Server, Mobile App"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateKey} disabled={!newKeyName.trim()}>Create Key</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Content - Key List */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active API Keys</CardTitle>
                <CardDescription>
                  These keys can be used to authenticate requests to our API.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {apiKeys.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <Key className="h-12 w-12 mb-4 opacity-20" />
                    <p>No API keys found.</p>
                    <p className="text-sm">Create a new key to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {apiKeys.map((key) => (
                      <div key={key.id} className="flex flex-col gap-4 rounded-lg border p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">{key.name}</div>
                            {key.isActive ? (
                              <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200">Active</Badge>
                            ) : (
                              <Badge variant="destructive">Inactive</Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={async () => {
                              if (!token) return
                              try {
                                const res = await fetch(`${API_BASE}/api-keys/${key.id}`, {
                                  method: 'DELETE',
                                  headers: { Authorization: `Bearer ${token}` },
                                })
                                if (res.ok || res.status === 204 || res.status === 404) {
                                  setApiKeys((prev) => prev.filter((k) => k.id !== key.id))
                                }
                              } catch {
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <Input 
                              readOnly 
                              value={visibleKeys.has(key.id) ? key.key : 'pk_live_••••••••••••••••••••••••••••'} 
                              className="font-mono text-sm pr-20 bg-muted/50"
                            />
                            <div className="absolute right-1 top-1 flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => toggleKeyVisibility(key.id)}
                              >
                                {visibleKeys.has(key.id) ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => handleCopyKey(key.key, key.id)}
                              >
                                {copiedId === key.id ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div>Created: {formatDate(key.createdAt)}</div>
                          <div>Last used: {key.lastUsedAt ? formatDate(key.lastUsedAt) : 'Never'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Quick Start
                </CardTitle>
                <CardDescription>
                  Use your API key to make your first request.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-zinc-950 p-4 font-mono text-sm text-zinc-50 overflow-x-auto">
                  <div className="flex items-center gap-2 text-zinc-500 mb-2">
                    <span>bash</span>
                  </div>
                  <pre>
{`curl -X POST https://api.travo.com/v1/sms \\
  -H "Authorization: Bearer ${apiKeys[0]?.key || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+15550000000",
    "message": "Hello World"
  }'`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary text-sm">
                  <Shield className="h-4 w-4" />
                  Security Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <ul className="space-y-2 list-disc pl-4">
                  <li>Never commit your API keys to version control (git).</li>
                  <li>Use environment variables to store keys securely.</li>
                  <li>Rotate your keys periodically (at least every 90 days).</li>
                  <li>Use different keys for development and production.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Revoking an API key will immediately stop all applications using it from working.
                </p>
                <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20">
                  Revoke All Keys
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
