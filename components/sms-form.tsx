'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'

interface SMSFormProps {
  onSendSMS: (phone: string, message: string, senderId: string) => void
}

export default function SMSForm({ onSendSMS }: SMSFormProps) {
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [senderId, setSenderId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const charCount = message.length
  const maxChars = 160
  const charPercentage = (charCount / maxChars) * 100

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !message || !senderId) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    onSendSMS(phone, message, senderId)
    setPhone('')
    setMessage('')
    setSenderId('')
    setIsLoading(false)
  }

  const isValid = phone.trim() && message.trim() && senderId.trim()

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Container */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-6">
        {/* Phone Number Input */}
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-foreground">
            Phone Number
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground">
            Enter the recipient's phone number with country code
          </p>
        </div>

        {/* Sender ID Input */}
        <div className="space-y-2">
          <label htmlFor="senderId" className="block text-sm font-medium text-foreground">
            Sender ID
          </label>
          <Input
            id="senderId"
            type="text"
            placeholder="MyApp"
            value={senderId}
            onChange={(e) => setSenderId(e.target.value)}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground">
            The name or number that will appear as the sender
          </p>
        </div>

        {/* Message Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="message" className="block text-sm font-medium text-foreground">
              Message
            </label>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium ${
                  charCount > maxChars
                    ? 'text-destructive'
                    : charCount > maxChars * 0.9
                      ? 'text-yellow-500'
                      : 'text-muted-foreground'
                }`}
              >
                {charCount}/{maxChars}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <textarea
              id="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={5}
            />

            {/* Character Counter Progress Bar */}
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${
                  charCount > maxChars
                    ? 'bg-destructive'
                    : charCount > maxChars * 0.9
                      ? 'bg-yellow-500'
                      : 'bg-primary'
                }`}
                style={{ width: `${Math.min(charPercentage, 100)}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Standard SMS messages are limited to 160 characters
          </p>
        </div>
      </div>

      {/* Send Button */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={!isValid || isLoading || charCount > maxChars}
          className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send SMS
            </>
          )}
        </Button>

        <Button
          type="button"
          onClick={() => {
            setMessage('')
            setPhone('')
            setSenderId('')
          }}
          variant="outline"
          className="border-border text-foreground hover:bg-secondary"
        >
          Clear
        </Button>
      </div>
    </form>
  )
}
