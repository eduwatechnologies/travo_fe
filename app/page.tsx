'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, BarChart3, Globe2, Lock, MessageSquare, Zap, CheckCircle2 } from 'lucide-react'
import { Logo } from '@/components/logo'

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  if (user) {
    router.push('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
          
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm text-muted-foreground mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              New: Real-time Analytics Dashboard
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
              Global Messaging Infrastructure <br className="hidden md:block" />
              <span className="text-primary">Built for Developers</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Send SMS, Email, and WhatsApp messages with a single API. Reliable delivery, real-time tracking, and simple integration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Start Building for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-base font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Read Documentation
              </Link>
            </div>

            <div className="mt-16 flex items-center justify-center gap-8 grayscale opacity-50">
              {/* Placeholder logos for social proof */}
              <div className="h-8 w-24 bg-foreground/20 rounded"></div>
              <div className="h-8 w-24 bg-foreground/20 rounded"></div>
              <div className="h-8 w-24 bg-foreground/20 rounded"></div>
              <div className="h-8 w-24 bg-foreground/20 rounded"></div>
              <div className="h-8 w-24 bg-foreground/20 rounded hidden sm:block"></div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 bg-muted/30 border-y border-border/40">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to scale</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Powerful features designed to help you build faster and scale effortlessly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Globe2,
                  title: 'Global Infrastructure',
                  description: 'Send messages worldwide with 99.9% uptime guarantee and automatic failover.',
                },
                {
                  icon: BarChart3,
                  title: 'Real-time Analytics',
                  description: 'Track delivery status, open rates, and engagement metrics in real-time.',
                },
                {
                  icon: Zap,
                  title: 'Developer First',
                  description: 'Clean REST API, comprehensive SDKs, and detailed documentation.',
                },
                {
                  icon: Lock,
                  title: 'Enterprise Security',
                  description: 'SOC 2 Type II compliant, end-to-end encryption, and GDPR ready.',
                },
                {
                  icon: MessageSquare,
                  title: 'Multi-channel Support',
                  description: 'SMS, Email, WhatsApp, and Push notifications all in one platform.',
                },
                {
                  icon: CheckCircle2,
                  title: 'Reliable Delivery',
                  description: 'Smart routing algorithms ensure your messages always reach the destination.',
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="group p-6 bg-background border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all duration-200"
                >
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6 mx-auto">
              <div className="relative rounded-3xl bg-slate-900 px-6 py-16 md:px-16 md:py-24 text-center overflow-hidden">
              <div className="absolute inset-0 bg-primary/10" />
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to get started?
                </h2>
                <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                  Join thousands of developers building the future of communication. Start for free, scale as you grow.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/register"
                    className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-base font-medium text-slate-900 shadow transition-colors hover:bg-slate-100"
                  >
                    Create Free Account
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center rounded-md border border-slate-700 bg-transparent px-8 text-base font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
                  >
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20">
        <div className="container px-4 md:px-6 mx-auto py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Logo />
              <p className="text-sm text-muted-foreground mb-4">
                Reliable messaging infrastructure for the modern web.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">SMS</Link></li>
                <li><Link href="#" className="hover:text-foreground">Email</Link></li>
                <li><Link href="#" className="hover:text-foreground">WhatsApp</Link></li>
                <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Documentation</Link></li>
                <li><Link href="#" className="hover:text-foreground">API Reference</Link></li>
                <li><Link href="#" className="hover:text-foreground">Guides</Link></li>
                <li><Link href="#" className="hover:text-foreground">Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">About</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2024 Travo Inc. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
              <Link href="#" className="hover:text-foreground">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
