'use client'

import { useAuth } from '@/lib/auth-context'
import { useApp } from '@/lib/app-context'
import DashboardLayout from '@/components/dashboard-layout'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { 
  MessageSquare, 
  Mail, 
  Wallet, 
  Zap, 
  ArrowUpRight, 
  TrendingUp, 
  Activity 
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from 'recharts'

const chartData = [
  { day: 'Mon', sms: 145, email: 240 },
  { day: 'Tue', sms: 232, email: 310 },
  { day: 'Wed', sms: 185, email: 180 },
  { day: 'Thu', sms: 290, email: 350 },
  { day: 'Fri', sms: 210, email: 280 },
  { day: 'Sat', sms: 110, email: 150 },
  { day: 'Sun', sms: 95, email: 120 },
]

const chartConfig = {
  sms: {
    label: "SMS",
    color: "hsl(var(--chart-1))",
  },
  email: {
    label: "Email",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function DashboardPage() {
  const { user } = useAuth()
  const { stats } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      console.log("[v0] No user found, redirecting to login")
      router.push('/login')
    }
  }, [user, router])

  const statCards = [
    {
      title: 'Total SMS Sent',
      value: stats.totalSMSSent.toLocaleString(),
      change: '+12.5%',
      icon: MessageSquare,
      description: 'from last month',
      color: 'text-primary',
    },
    {
      title: 'Total Emails Sent',
      value: stats.totalEmailsSent.toLocaleString(),
      change: '+8.2%',
      icon: Mail,
      description: 'from last month',
      color: 'text-green-500',
    },
    {
      title: 'Available Credits',
      value: stats.creditsRemaining.toLocaleString(),
      change: '-2.1%',
      icon: Wallet,
      description: 'remaining balance',
      color: 'text-purple-500',
    },
    {
      title: 'Delivery Rate',
      value: `${stats.smsDeliveryRate}%`,
      change: '+1.2%',
      icon: Zap,
      description: 'average success rate',
      color: 'text-orange-500',
    },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, idx) => (
            <Card key={idx}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={stat.change.startsWith('+') ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                    {stat.change}
                  </span>
                  {' '}{stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid gap-4 md:grid-cols-7">
          {/* Chart Section */}
          <Card className="col-span-4 lg:col-span-5">
            <CardHeader>
              <CardTitle>Message Volume</CardTitle>
              <CardDescription>
                SMS and Email traffic over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillSms" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-sms)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--color-sms)" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="fillEmail" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-email)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--color-email)" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-muted-foreground text-xs"
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="email"
                    type="natural"
                    fill="url(#fillEmail)"
                    fillOpacity={0.4}
                    stroke="var(--color-email)"
                    stackId="a"
                  />
                  <Area
                    dataKey="sms"
                    type="natural"
                    fill="url(#fillSms)"
                    fillOpacity={0.4}
                    stroke="var(--color-sms)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Quick Actions / Recent Activity */}
          <Card className="col-span-3 lg:col-span-2 flex flex-col">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and operations
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Link href="/sms" className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors group">
                <div className="p-2 bg-primary/10 text-primary rounded-md group-hover:bg-primary/20 transition-colors">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">Send SMS</div>
                  <div className="text-xs text-muted-foreground">Start a campaign</div>
                </div>
                <ArrowUpRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-foreground" />
              </Link>
              
              <Link href="/email" className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors group">
                <div className="p-2 bg-green-100 text-green-600 rounded-md group-hover:bg-green-200 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">Send Email</div>
                  <div className="text-xs text-muted-foreground">Compose message</div>
                </div>
                <ArrowUpRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-foreground" />
              </Link>

              <Link href="/wallet" className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors group">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-md group-hover:bg-purple-200 transition-colors">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">Add Credits</div>
                  <div className="text-xs text-muted-foreground">Top up wallet</div>
                </div>
                <ArrowUpRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-foreground" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Table (Placeholder) */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest transactions and message logs</CardDescription>
              </div>
              <Link href="/reports" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Bulk SMS Campaign #{100 + i}</p>
                      <p className="text-xs text-muted-foreground">Completed • 2 mins ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">- $12.50</p>
                    <p className="text-xs text-muted-foreground">1,250 credits</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
