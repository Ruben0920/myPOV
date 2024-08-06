import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  PropsWithChildren,
} from "react"
import { loadData } from "app/utils/storage/securestore"
import AuthService from "./AuthService"

type AuthState = {
  isLoggedIn: boolean
  token: string | null
}

type AuthContextType = {
  loggedIn: () => any
} & AuthState

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  token: null,
  loggedIn: () => new Promise(() => ({})),
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

  const loggedIn = async () => {
    const refreshToken = await loadData("refreshToken")
    setToken(refreshToken)
    // need to check for refreshkeyexpiry
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, token, loggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}
