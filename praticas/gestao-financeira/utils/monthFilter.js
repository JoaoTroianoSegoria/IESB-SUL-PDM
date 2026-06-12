const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
})

export function startOfMonth(date) {
  const currentDate = new Date(date)
  return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
}

export function shiftMonth(date, amount) {
  const currentDate = startOfMonth(date)
  return new Date(currentDate.getFullYear(), currentDate.getMonth() + amount, 1)
}

export function getMonthLabel(date) {
  const label = monthFormatter.format(startOfMonth(date))
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function isSameMonth(date, selectedMonth) {
  const currentDate = new Date(date)
  const monthDate = startOfMonth(selectedMonth)

  return (
    currentDate.getFullYear() === monthDate.getFullYear() &&
    currentDate.getMonth() === monthDate.getMonth()
  )
}

export function getNewestTransactionMonth(transactions) {
  if (transactions.length === 0) {
    return startOfMonth(new Date())
  }

  const newestTransaction = transactions.reduce((newest, transaction) => {
    if (!newest) return transaction

    return new Date(transaction.date) > new Date(newest.date)
      ? transaction
      : newest
  }, null)

  return startOfMonth(newestTransaction.date)
}

export function filterTransactionsByMonth(transactions, selectedMonth) {
  return transactions.filter((transaction) =>
    isSameMonth(transaction.date, selectedMonth),
  )
}
