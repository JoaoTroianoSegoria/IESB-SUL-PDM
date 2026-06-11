import { useContext, useMemo } from "react"
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"

import MonthYearFilter from "../../components/MonthYearFilter"
import PieChart from "../../components/PieChart"
import SummaryItem from "../../components/SummaryItem"
import { colors } from "../../constants/colors"
import { MoneyContext } from "../../contexts/GlobalState"
import { useMonthFilter } from "../../hooks/useMonthFilter"
import { globalStyles } from "../../styles/globalStyles"

function calculateTotals(transactions, categories) {
  const totalsById = {}
  let balance = 0

  categories.forEach((category) => {
    totalsById[category.id] = 0
  })

  transactions.forEach((transaction) => {
    const value = Number(transaction.value)
    if (totalsById[transaction.categoryId] !== undefined) {
      totalsById[transaction.categoryId] += value
    }

    const category =
      transaction.category ??
      categories.find(
        (currentCategory) => currentCategory.id === transaction.categoryId,
      )

    if (category?.isIncome) {
      balance += value
    } else {
      balance -= value
    }
  })

  return { balance, totalsById }
}

export default function Summary() {
  const { categories, loading, transactions } = useContext(MoneyContext)
  const { filteredTransactions, selectedMonth, setSelectedMonth } =
    useMonthFilter(transactions)
  const totals = useMemo(() => {
    return calculateTotals(filteredTransactions, categories)
  }, [filteredTransactions, categories])

  if (loading && categories.length === 0) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  const balanceStyle =
    totals.balance >= 0 ? globalStyles.positiveText : globalStyles.negativeText

  return (
    <View style={globalStyles.screenContainer}>
      <ScrollView contentContainerStyle={globalStyles.content}>
        <MonthYearFilter
          selectedMonth={selectedMonth}
          onChange={setSelectedMonth}
        />

        <PieChart
          categories={categories}
          totalsById={totals.totalsById}
          transactionCount={filteredTransactions.length}
        />

        <View style={globalStyles.line} />

        {categories.map((category) => (
          <SummaryItem
            key={category.id}
            category={category}
            value={totals.totalsById[category.id] ?? 0}
          />
        ))}

        <View style={globalStyles.line} />

        <View style={styles.balance}>
          <Text style={styles.balanceText}>Saldo</Text>
          <Text style={balanceStyle}>{formatCurrency(totals.balance)}</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  balance: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  balanceText: {
    fontSize: 18,
    color: colors.primaryText,
    fontWeight: "800",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
