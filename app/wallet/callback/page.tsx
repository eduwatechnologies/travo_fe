'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import DashboardLayout from '@/components/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function WalletCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { token } = useAuth()

  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const reference = searchParams.get('reference')

    if (!reference) {
      setStatus('error')
      setMessage('Missing payment reference.')
      return
    }

    if (!token) {
      setStatus('error')
      setMessage('You need to be logged in to verify this payment.')
      return
    }

    const verify = async () => {
      setStatus('verifying')
      try {
        const res = await fetch(
          `${API_BASE}/wallet/paystack/verify?reference=${encodeURIComponent(reference)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!res.ok) {
          setStatus('error')
          setMessage('Payment could not be verified.')
          return
        }

        const data = await res.json()

        if (typeof data.creditsRemaining === 'number') {
          setStatus('success')
          setMessage('Your wallet has been successfully funded.')
          setTimeout(() => {
            router.push('/wallet')
          }, 2000)
        } else {
          setStatus('error')
          setMessage('Payment verification did not return wallet data.')
        }
      } catch {
        setStatus('error')
        setMessage('An error occurred while verifying your payment.')
      }
    }

    verify()
  }, [router, searchParams, token])

  return (
    <DashboardLayout active="wallet">
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Wallet Top Up</CardTitle>
            <CardDescription>Completing your Paystack payment verification.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === 'verifying' && (
              <div className="flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Verifying your payment, please wait...</p>
              </div>
            )}

            {status === 'success' && (
              <Alert className="bg-green-500/10 text-green-700 border-green-500/20">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Payment Verified</AlertTitle>
                <AlertDescription>
                  {message || 'Your wallet has been updated. Redirecting you to the wallet page...'}
                </AlertDescription>
              </Alert>
            )}

            {status === 'error' && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>
                  {message || 'We could not verify your payment. Please try again or contact support.'}
                </AlertDescription>
              </Alert>
            )}

            {(status === 'success' || status === 'error') && (
              <div className="pt-2 flex justify-end">
                <Button onClick={() => router.push('/wallet')}>
                  Go to Wallet
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

