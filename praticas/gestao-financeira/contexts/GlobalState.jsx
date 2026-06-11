import AsyncStorage from "@react-native-async-storage/async-storage"
import { createContext, useCallback, useEffect, useState } from "react"
import { api, setAuthToken } from "../services/api"

const AUTH_STORAGE_KEY = "gestao-financeira-auth"

export const MoneyContext = createContext()

export default function GlobalState({ children }) {
  const [user, setUser] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [nextCategories, nextTransactions] = await Promise.all([
        api.listCategories(),
        api.listTransactions(),
      ])

      setCategories(nextCategories)
      setTransactions(nextTransactions)
    } catch (currentError) {
      setError(currentError.message ?? "Falha ao carregar dados do servidor")
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY)

        if (storedAuth) {
          const parsedAuth = JSON.parse(storedAuth)
          setAuthToken(parsedAuth.token)

          const response = await api.me()
          setUser(response.user)
        }
      } catch {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY)
        setAuthToken(null)
      } finally {
        setAuthLoading(false)
      }
    }

    loadStoredAuth()
  }, [])

  useEffect(() => {
    if (!authLoading) {
      refresh()
    }
  }, [authLoading, refresh])

  const login = useCallback(async (credentials) => {
    const auth = await api.login(credentials)

    setAuthToken(auth.token)
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
    setUser(auth.user)

    return auth.user
  }, [])

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY)
    setAuthToken(null)
    setUser(null)
    setTransactions([])
    setCategories([])
    setError(null)
    setLoading(false)
  }, [])

  const addTransaction = useCallback(async (data) => {
    const created = await api.createTransaction(data)
    setTransactions((currentTransactions) =>
      [created, ...currentTransactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      ),
    )
    return created
  }, [])

  const updateTransaction = useCallback(async (id, data) => {
    const updated = await api.updateTransaction(id, data)
    setTransactions((currentTransactions) =>
      currentTransactions
        .map((transaction) => (transaction.id === id ? updated : transaction))
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    )
    return updated
  }, [])

  const removeTransaction = useCallback(async (id) => {
    await api.deleteTransaction(id)
    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== id),
    )
  }, [])

  const addCategory = useCallback(async (data) => {
    const created = await api.createCategory(data)
    setCategories((currentCategories) =>
      [...currentCategories, created].sort((a, b) =>
        a.displayName.localeCompare(b.displayName),
      ),
    )
    return created
  }, [])

  const removeCategory = useCallback(async (id) => {
    await api.deleteCategory(id)
    setCategories((currentCategories) =>
      currentCategories.filter((category) => category.id !== id),
    )
  }, [])

  return (
    <MoneyContext.Provider
      value={{
        user,
        transactions,
        categories,
        loading,
        authLoading,
        error,
        login,
        logout,
        refresh,
        addTransaction,
        updateTransaction,
        removeTransaction,
        addCategory,
        removeCategory,
      }}
    >
      {children}
    </MoneyContext.Provider>
  )
}
