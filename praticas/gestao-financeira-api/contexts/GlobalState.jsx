import { createContext, useCallback, useEffect, useState } from "react"
import { api } from "../services/api"

export const MoneyContext = createContext()

export default function GlobalState({ children }) {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addTransaction = useCallback(async (data) => {
    const created = await api.createTransaction(data)
    setTransactions((currentTransactions) => [created, ...currentTransactions])
    return created
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
        transactions,
        categories,
        loading,
        error,
        refresh,
        addTransaction,
        removeTransaction,
        addCategory,
        removeCategory,
      }}
    >
      {children}
    </MoneyContext.Provider>
  )
}
