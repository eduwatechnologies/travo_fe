'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { User } from './types'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, companyName: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
const TOKEN_STORAGE_KEY = 'travo_auth_token'

function mapUserPayload(payload: any): User {
  return {
    id: payload.id,
    email: payload.email,
    name: payload.name,
    companyName: payload.companyName,
    createdAt: new Date(payload.createdAt),
    plan: payload.plan,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_STORAGE_KEY) : null
    if (!token) {
      return
    }

    async function fetchMe() {
      setIsLoading(true)
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          window.localStorage.removeItem(TOKEN_STORAGE_KEY)
          return
        }

        const data = await res.json()
        if (data.user) {
          setUser(mapUserPayload(data.user))
          setToken(token)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchMe()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}))
        const message = errorBody.message || 'Unable to login'
        throw new Error(message)
      }

      const data = await res.json()
      if (data.token) {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, data.token)
        setToken(data.token)
      }
      if (data.user) {
        setUser(mapUserPayload(data.user))
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (email: string, password: string, name: string, companyName: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, companyName }),
      })

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}))
        const message = errorBody.message || 'Unable to register'
        throw new Error(message)
      }

      const data = await res.json()
      if (data.token) {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, data.token)
        setToken(data.token)
      }
      if (data.user) {
        setUser(mapUserPayload(data.user))
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
    setUser(null)
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
