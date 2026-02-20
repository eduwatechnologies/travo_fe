'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import DashboardLayout from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, RotateCcw, DollarSign, TrendingUp, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface WalletTransaction {
  _id: string
  type: 'purchase' | 'usage' | 'refund'
  amount: number
  credits: number
  description: string
  status: 'completed' | 'pending' | 'failed'
  createdAt: string
}

interface WalletSummary {
  creditsRemaining: number
  creditsUsedThisMonth: number
}

export default function WalletPage() {
  const { token } = useAuth()
  const [amount, setAmount] = useState('50')
  const [activeTab, setActiveTab] = useState("overview")
  const [success, setSuccess] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [summary, setSummary] = useState<WalletSummary | null>(null)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) return

    async function loadWallet() {
      setLoading(true)
      try {
        const [summaryRes, txRes] = await Promise.all([
          fetch(`${API_BASE}/wallet/summary`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE}/wallet/transactions`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ])

        if (summaryRes.ok) {
          const data = await summaryRes.json()
          setSummary(data)
        }

        if (txRes.ok) {
          const data = await txRes.json()
          setTransactions(data.transactions || [])
        }
      } finally {
        setLoading(false)
      }
    }

    loadWallet()
  }, [token])

  const handlePurchase = async () => {
    if (!amount) return

    setProcessing(true)
    try {
      if (!token) return

      const res = await fetch(`${API_BASE}/wallet/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: parseInt(amount, 10) }),
      })

      if (!res.ok) {
        return
      }

      const data = await res.json()

      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl
      }
    } finally {
      setProcessing(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Completed</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case 'usage':
        return <ArrowDownLeft className="h-4 w-4 text-red-500" />
      case 'refund':
        return <RotateCcw className="h-4 w-4 text-blue-500" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const totalDeposited = transactions
    .filter((t) => t.type === 'purchase')
    .reduce((sum, t) => sum + t.credits, 0)

  return (
    <DashboardLayout active="wallet">
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet & Credits</h1>
          <p className="text-muted-foreground">Manage your account balance and view transaction history.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credits Remaining</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold">
                {summary ? summary.creditsRemaining.toLocaleString() : loading ? '...' : '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Available for use
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold">
                {summary ? summary.creditsUsedThisMonth.toLocaleString() : loading ? '...' : '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Credits used this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deposited</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDeposited.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime credits purchased
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Buy Credits</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>

              {/* Buy Credits Tab */}
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Up Wallet</CardTitle>
                    <CardDescription>Purchase credits to send messages and emails.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     {success && (
                        <Alert className="bg-green-500/10 text-green-600 border-green-500/20">
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertTitle>Success</AlertTitle>
                          <AlertDescription>Credits successfully added to your wallet.</AlertDescription>
                        </Alert>
                      )}

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {[10, 25, 50, 100].map((val) => (
                        <div
                          key={val}
                          onClick={() => setAmount(String(val))}
                          className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all hover:border-primary ${
                            parseInt(amount || '0') === val
                              ? 'border-primary bg-primary/5'
                              : 'border-muted bg-card'
                          }`}
                        >
                          <div className="text-2xl font-bold">${val}</div>
                          <div className="text-xs text-muted-foreground">
                            {val * 100} Credits
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Custom Amount (USD)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="amount"
                            type="number"
                            min="10"
                            step="10"
                            className="pl-9"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          You will receive <span className="font-medium text-foreground">{parseInt(amount || '0') * 100}</span> credits
                        </p>
                      </div>

                      <div className="rounded-lg bg-secondary/50 p-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Exchange Rate</span>
                          <span className="font-medium">1 USD = 100 Credits</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-sm">
                          <span className="font-medium">Total Cost</span>
                          <span className="text-lg font-bold">${amount || '0.00'}</span>
                        </div>
                      </div>

                      <Button 
                        onClick={handlePurchase} 
                        className="w-full" 
                        size="lg"
                        disabled={!amount || parseInt(amount) <= 0 || processing}
                      >
                        {processing ? 'Processing...' : 'Confirm Purchase'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Transactions Tab */}
              <TabsContent value="transactions">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>View your recent wallet activity.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Credits</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              No transactions found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          transactions.map((t) => (
                            <TableRow key={t.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="rounded-full bg-secondary p-2">
                                    {getTypeIcon(t.type)}
                                  </div>
                                  <span className="capitalize hidden sm:inline-block">{t.type}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium">{t.description}</span>
                                  <span className="text-xs text-muted-foreground">{formatDate(t.timestamp)}</span>
                                </div>
                              </TableCell>
                              <TableCell className="font-mono">
                                ${t.amount.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <span className={t.type === 'usage' ? 'text-red-500' : 'text-green-500'}>
                                  {t.type === 'usage' ? '-' : '+'}{t.credits}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                {getStatusBadge(t.status)}
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
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary text-sm">
                  <AlertCircle className="h-4 w-4" />
                  Auto-Recharge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Never run out of credits. Set up auto-recharge to automatically add credits when your balance falls below a threshold.
                </p>
                <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/10 hover:text-primary">
                  Configure Auto-Recharge
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Billing Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Need help with a transaction?</p>
                <p>Contact our billing support team for assistance with refunds, invoices, or payment issues.</p>
                <Button variant="link" className="px-0 text-primary">
                  Contact Support &rarr;
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
