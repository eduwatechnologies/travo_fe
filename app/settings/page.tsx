'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import DashboardLayout from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from 'sonner'
import { 
  User, 
  Lock, 
  CreditCard, 
  Bell, 
  Shield, 
  Download, 
  Trash2, 
  Activity, 
  Mail, 
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()

  const [name, setName] = useState(user?.name || '')
  const [companyName, setCompanyName] = useState(user?.companyName || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Notification preferences state
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    toast.success('Profile updated successfully')
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setLoading(false)
    toast.success('Password changed successfully')
  }

  return (
    <DashboardLayout active="settings">
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account, preferences, and subscription.</p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-64 flex-shrink-0">
              <TabsList className="flex flex-col h-auto w-full items-stretch bg-transparent p-0 gap-1">
                <TabsTrigger 
                  value="general" 
                  className="justify-start px-4 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <User className="h-4 w-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="justify-start px-4 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger 
                  value="billing" 
                  className="justify-start px-4 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Billing
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="justify-start px-4 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger 
                  value="api" 
                  className="justify-start px-4 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  API Limits
                </TabsTrigger>
              </TabsList>
            </aside>
            
            <div className="flex-1 space-y-6">
              {/* General Settings */}
              <TabsContent value="general" className="mt-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal and company details.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={`https://avatar.vercel.sh/${user?.email}`} />
                          <AvatarFallback className="text-lg">
                            {name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" type="button">Change Avatar</Button>
                          <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
                        </div>
                      </div>
                      
                      <Separator />

                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            value={user?.email || ''} 
                            disabled 
                            className="bg-muted" 
                          />
                          <p className="text-xs text-muted-foreground">
                            Contact support to change your email address.
                          </p>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="company">Company Name</Label>
                          <Input 
                            id="company" 
                            value={companyName} 
                            onChange={(e) => setCompanyName(e.target.value)} 
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card className="border-destructive/20">
                  <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                      <Trash2 className="h-5 w-5" />
                      Delete Account
                    </CardTitle>
                    <CardDescription>
                      Permanently delete your account and all of your data.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                    </p>
                    <Button variant="destructive">Delete Account</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="mt-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="current">Current Password</Label>
                        <Input 
                          id="current" 
                          type="password" 
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="new">New Password</Label>
                        <Input 
                          id="new" 
                          type="password" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="confirm">Confirm Password</Label>
                        <Input 
                          id="confirm" 
                          type="password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button type="submit" disabled={loading}>
                          {loading ? 'Updating...' : 'Update Password'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security to your account.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Two-factor authentication is currently off</p>
                      <p className="text-sm text-muted-foreground">
                        Protect your account with an extra layer of security.
                      </p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Billing Settings */}
              <TabsContent value="billing" className="mt-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Plan</CardTitle>
                    <CardDescription>Manage your billing and subscription details.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-secondary/20">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">Growth Plan</p>
                          <p className="text-sm text-muted-foreground">$49/month • Renews Feb 13, 2026</p>
                        </div>
                      </div>
                      <Badge>Active</Badge>
                    </div>

                    <div className="grid gap-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Next billing date</span>
                        <span className="font-medium">February 13, 2026</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Payment method</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Visa ending in 4242</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Update Payment Method</Button>
                    <Button variant="default">Upgrade Plan</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>Download your previous invoices.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                              <span className="text-xs font-bold">PDF</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Invoice #INV-2024-00{i}</p>
                              <p className="text-xs text-muted-foreground">Jan {14 - i}, 2026 • $49.00</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications" className="mt-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Notifications</CardTitle>
                    <CardDescription>Manage your email notification preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">System Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about your system status and critical alerts.
                        </p>
                      </div>
                      <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about new features and special offers.
                        </p>
                      </div>
                      <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>SMS Notifications</CardTitle>
                    <CardDescription>Manage your SMS notification preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Critical Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive SMS messages for critical system failures.
                        </p>
                      </div>
                      <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* API Settings */}
              <TabsContent value="api" className="mt-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>API Rate Limits</CardTitle>
                    <CardDescription>Monitor your current API usage and limits.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">SMS API</span>
                        </div>
                        <span className="text-sm text-muted-foreground">300 / 1000 req/min</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Email API</span>
                        </div>
                        <span className="text-sm text-muted-foreground">200 / 500 req/min</span>
                      </div>
                      <Progress value={40} className="h-2 bg-secondary" indicatorClassName="bg-primary" />
                    </div>

                    <div className="rounded-lg bg-muted p-4 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-foreground">Need higher limits?</p>
                        <p className="text-muted-foreground mt-1">
                          Upgrade to an Enterprise plan for custom rate limits and dedicated support.
                        </p>
                        <Button variant="link" className="px-0 h-auto mt-2 text-primary">Contact Sales</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>Export your account data.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Download className="h-4 w-4 mr-2" />
                      Export All Data
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
