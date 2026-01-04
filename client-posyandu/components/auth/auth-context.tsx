"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, AuthState } from "@/lib/types"

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

interface RegisterData {
  username: string
  password: string
  posyandu_name: string
  address: string
  lat: number
  lng: number
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth on mount
    const token = localStorage.getItem("sigizi_token")
    const userStr = localStorage.getItem("sigizi_user")
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        setAuthState({ user, token, isAuthenticated: true })
      } catch {
        localStorage.removeItem("sigizi_token")
        localStorage.removeItem("sigizi_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock login - replace with actual API call
    if (username && password) {
      const mockUser: User = {
        id: "user_001",
        username,
        role: "POSYANDU_ADMIN",
        posyandu_details: {
          name: "Posyandu Mawar 01",
          address: "Jl. Kebon Jeruk No 1, Jakarta Barat",
          location: { lat: -6.2, lng: 106.816 },
        },
      }
      const mockToken = "mock_jwt_token_" + Date.now()

      localStorage.setItem("sigizi_token", mockToken)
      localStorage.setItem("sigizi_user", JSON.stringify(mockUser))

      setAuthState({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
      })
      return true
    }
    return false
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    // Mock register - replace with actual API call
    const mockUser: User = {
      id: "user_" + Date.now(),
      username: data.username,
      role: "POSYANDU_ADMIN",
      posyandu_details: {
        name: data.posyandu_name,
        address: data.address,
        location: { lat: data.lat, lng: data.lng },
      },
    }
    const mockToken = "mock_jwt_token_" + Date.now()

    localStorage.setItem("sigizi_token", mockToken)
    localStorage.setItem("sigizi_user", JSON.stringify(mockUser))

    setAuthState({
      user: mockUser,
      token: mockToken,
      isAuthenticated: true,
    })
    return true
  }

  const logout = () => {
    localStorage.removeItem("sigizi_token")
    localStorage.removeItem("sigizi_user")
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  }

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
