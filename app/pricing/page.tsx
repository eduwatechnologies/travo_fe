'use client'

import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-border">
        <Link href="/" className="text-2xl font-bold text-primary">
          SendHub
        </Link>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2 text-foreground hover:text-primary transition">
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground text-balance">
            Pay only for what you use. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Starter Plan */}
          <div className="border border-border rounded-lg p-8 bg-card">
            <h2 className="text-2xl font-bold text-foreground mb-2">Starter</h2>
            <p className="text-muted-foreground mb-6">Perfect for getting started</p>

            <div className="mb-6">
              <span className="text-4xl font-bold text-foreground">Free</span>
              <p className="text-muted-foreground mt-2">First month included</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-foreground">1,000 SMS credits</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-foreground">500 email credits</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-foreground">API access</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-foreground">Email support</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-muted-foreground">✗</span>
                <span className="text-muted-foreground">Webhooks</span>
              </li>
            </ul>

            <Link
              href="/register"
              className="w-full block text-center px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition font-medium"
            >
              Get Started
            </Link>
          </div>

          {/* Growth Plan */}
          <div className="border-2 border-primary rounded-lg p-8 bg-card relative">
            <div className="absolute -top-4 left-8 bg-primary text-primary-foreground px-3 py-1 rounded text-sm font-semibold">
              Most Popular
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">Growth</h2>
            <p className="text-muted-foreground mb-6">For growing businesses</p>

            <div className="mb-6">
              <span className="text-4xl font-bold text-foreground">$49</span>
              <span className="text-muted-foreground">/month</span>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-foreground">100,000 SMS credits</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-foreground">50,000 email credits</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-foreground">Advanced API</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-foreground">Priority support</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-foreground">Webhooks & callbacks</span>
              </li>
            </ul>

            <Link
              href="/register"
              className="w-full block text-center px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="border border-border rounded-lg p-8 bg-card">
            <h2 className="text-2xl font-bold text-foreground mb-2">Enterprise</h2>
            <p className="text-muted-foreground mb-6">For large-scale operations</p>

            <div className="mb-6">
              <span className="text-4xl font-bold text-foreground">Custom</span>
              <p className="text-muted-foreground mt-2">Volume pricing available</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-foreground">Unlimited SMS credits</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-foreground">Unlimited email credits</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-foreground">Dedicated support</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-foreground">SLA guarantee</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-foreground">Custom integrations</span>
              </li>
            </ul>

            <button className="w-full px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition font-medium">
              Contact Sales
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="bg-card border border-border rounded-lg p-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Can I change my plan?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">What happens to unused credits?</h3>
              <p className="text-muted-foreground">
                Unused credits roll over to the next month. You'll never lose them due to inactivity.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Is there a setup fee?</h3>
              <p className="text-muted-foreground">
                No, there are no setup fees or hidden charges. You only pay for the plan you choose.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground">
                We offer a 30-day money-back guarantee if you're not satisfied with our service.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
