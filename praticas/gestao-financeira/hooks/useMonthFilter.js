import { useEffect, useMemo, useState } from "react"
import {
  filterTransactionsByMonth,
  getNewestTransactionMonth,
  startOfMonth,
} from "../utils/monthFilter"

export function useMonthFilter(transactions) {
  const [selectedMonth, setSelectedMonth] = useState(() =>
    startOfMonth(new Date()),
  )
  const [hasManualSelection, setHasManualSelection] = useState(false)

  useEffect(() => {
    if (!hasManualSelection && transactions.length > 0) {
      setSelectedMonth(getNewestTransactionMonth(transactions))
    }
  }, [hasManualSelection, transactions])

  const changeMonth = (month) => {
    setHasManualSelection(true)
    setSelectedMonth(startOfMonth(month))
  }

  const filteredTransactions = useMemo(() => {
    return filterTransactionsByMonth(transactions, selectedMonth)
  }, [selectedMonth, transactions])

  return {
    filteredTransactions,
    selectedMonth,
    setSelectedMonth: changeMonth,
  }
}
