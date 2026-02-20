'use client'

import Link from 'next/link'
import { Logo } from '@/components/logo'

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-border">
        <Logo />
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
        <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">Documentation</h1>
        <p className="text-xl text-muted-foreground mb-12 text-balance">
          Everything you need to integrate Travo into your application
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Getting Started */}
          <section className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-bold text-foreground mb-4">Getting Started</h2>
            <ul className="space-y-3">
              <li>
                <a href="#auth" className="text-primary hover:underline">
                  Authentication
                </a>
              </li>
              <li>
                <a href="#keys" className="text-primary hover:underline">
                  API Keys
                </a>
              </li>
              <li>
                <a href="#quickstart" className="text-primary hover:underline">
                  Quick Start
                </a>
              </li>
              <li>
                <a href="#errors" className="text-primary hover:underline">
                  Error Handling
                </a>
              </li>
            </ul>
          </section>

          {/* SMS API */}
          <section className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-bold text-foreground mb-4">SMS API</h2>
            <ul className="space-y-3">
              <li>
                <a href="#send-sms" className="text-primary hover:underline">
                  Send SMS
                </a>
              </li>
              <li>
                <a href="#bulk-sms" className="text-primary hover:underline">
                  Send Bulk SMS
                </a>
              </li>
              <li>
                <a href="#sms-status" className="text-primary hover:underline">
                  Check Status
                </a>
              </li>
              <li>
                <a href="#sms-logs" className="text-primary hover:underline">
                  Message Logs
                </a>
              </li>
            </ul>
          </section>

          {/* Email API */}
          <section className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-bold text-foreground mb-4">Email API</h2>
            <ul className="space-y-3">
              <li>
                <a href="#send-email" className="text-primary hover:underline">
                  Send Email
                </a>
              </li>
              <li>
                <a href="#templates" className="text-primary hover:underline">
                  Email Templates
                </a>
              </li>
              <li>
                <a href="#email-status" className="text-primary hover:underline">
                  Check Status
                </a>
              </li>
              <li>
                <a href="#email-logs" className="text-primary hover:underline">
                  Message Logs
                </a>
              </li>
            </ul>
          </section>
        </div>

        {/* API Endpoints */}
        <section className="mt-16 p-8 border border-border rounded-lg bg-card">
          <h2 className="text-3xl font-bold text-foreground mb-8">API Reference</h2>

          <div className="space-y-8">
            {/* Send SMS Endpoint */}
            <div>
              <h3 id="send-sms" className="text-xl font-bold text-foreground mb-4">
                Send SMS
              </h3>
              <div className="bg-secondary p-4 rounded-lg mb-4 overflow-x-auto">
                <code className="text-sm text-foreground font-mono">
                  POST /api/sms/send
                </code>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-foreground mb-2">Request Body:</p>
                  <pre className="bg-secondary p-3 rounded text-xs text-foreground overflow-x-auto">
{`{
  "phone": "+1234567890",
  "message": "Your message here",
  "senderId": "YourAppName"
}`}
                  </pre>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Response:</p>
                  <pre className="bg-secondary p-3 rounded text-xs text-foreground overflow-x-auto">
{`{
  "id": "msg_123456",
  "status": "sent",
  "timestamp": "2024-01-15T10:30:00Z"
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Send Email Endpoint */}
            <div>
              <h3 id="send-email" className="text-xl font-bold text-foreground mb-4">
                Send Email
              </h3>
              <div className="bg-secondary p-4 rounded-lg mb-4 overflow-x-auto">
                <code className="text-sm text-foreground font-mono">
                  POST /api/email/send
                </code>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-foreground mb-2">Request Body:</p>
                  <pre className="bg-secondary p-3 rounded text-xs text-foreground overflow-x-auto">
{`{
  "recipient": "user@example.com",
  "subject": "Welcome",
  "message": "Your email content here"
}`}
                  </pre>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Response:</p>
                  <pre className="bg-secondary p-3 rounded text-xs text-foreground overflow-x-auto">
{`{
  "id": "email_123456",
  "status": "sent",
  "timestamp": "2024-01-15T10:30:00Z"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section className="mt-16 p-8 border border-border rounded-lg bg-card">
          <h2 className="text-3xl font-bold text-foreground mb-8">Code Examples</h2>

          <div className="space-y-8">
            <div>
              <p className="font-semibold text-foreground mb-2">JavaScript/Node.js:</p>
              <pre className="bg-secondary p-4 rounded text-xs text-foreground overflow-x-auto">
{`const response = await fetch('https://api.travo.io/sms/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    phone: '+1234567890',
    message: 'Hello from Travo!',
    senderId: 'MyApp'
  })
});`}
              </pre>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-2">Python:</p>
              <pre className="bg-secondary p-4 rounded text-xs text-foreground overflow-x-auto">
{`import requests

response = requests.post(
  'https://api.travo.io/sms/send',
  headers={'Authorization': 'Bearer YOUR_API_KEY'},
  json={
    'phone': '+1234567890',
    'message': 'Hello from Travo!',
    'senderId': 'MyApp'
  }
)`}
              </pre>
            </div>
          </div>
        </section>

        {/* Support */}
        <section className="mt-16 text-center p-8 bg-card border border-border rounded-lg">
          <h2 className="text-2xl font-bold text-foreground mb-2">Need Help?</h2>
          <p className="text-muted-foreground mb-4">
            Contact our support team or check our FAQ
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
          >
            Access Dashboard
          </Link>
        </section>
      </div>
    </div>
  )
}
