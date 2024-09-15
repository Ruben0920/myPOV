import React, { createContext, useContext, useState, PropsWithChildren } from "react"
import { loadData } from "app/utils/storage/securestore"
import { useEffect } from "react"

type AuthState = {
  isLoggedIn: boolean
  token: string | null
}

type AuthContextType = {
  loggedIn: () => any
  loggedOut: () => any
} & AuthState

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  token: null,
  loggedIn: () => new Promise(() => ({})),
  loggedOut: () => new Promise(() => ({})),
})

export function useAuth() {
  const value = useContext(AuthContext)

  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useAuth must be used within an AuthProvider")
    }
  }

  return value
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const initializeAuth = async () => {
      await loadData("accessToken").then(setToken)
    }
    initializeAuth()
  }, [])

  const loggedIn = async () => {
    await loadData("refreshToken").then(setToken)
    // !need to check for refreshkeyexpiry
  }
  const loggedOut = () => {
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, token, loggedIn, loggedOut }}>
      {children}
    </AuthContext.Provider>
  )
}
