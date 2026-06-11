import { useContext, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import MonthYearFilter from "../../components/MonthYearFilter"
import TransactionActionsModal from "../../components/TransactionActionsModal"
import TransactionItem from "../../components/TransactionItem"
import { colors } from "../../constants/colors"
import { MoneyContext } from "../../contexts/GlobalState"
import { useMonthFilter } from "../../hooks/useMonthFilter"
import { globalStyles } from "../../styles/globalStyles"

export default function Transactions() {
  const {
    categories,
    error,
    loading,
    refresh,
    removeTransaction,
    transactions,
    updateTransaction,
    user,
  } = useContext(MoneyContext)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const { filteredTransactions, selectedMonth, setSelectedMonth } =
    useMonthFilter(transactions)

  const handleLongPress = (item) => {
    setSelectedTransaction(item)
  }

  const handleDelete = async () => {
    if (!selectedTransaction) return

    try {
      await removeTransaction(selectedTransaction.id)
      setSelectedTransaction(null)
    } catch (currentError) {
      Alert.alert("Erro ao excluir", currentError.message ?? "Tente novamente.")
    }
  }

  const handleSave = async (data) => {
    if (!selectedTransaction) return

    try {
      await updateTransaction(selectedTransaction.id, data)
      setSelectedTransaction(null)
    } catch (currentError) {
      Alert.alert("Erro ao salvar", currentError.message ?? "Tente novamente.")
    }
  }

  if (loading && transactions.length === 0) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={globalStyles.secondaryText}>Carregando transações...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <Text style={globalStyles.primaryText}>Não foi possível carregar.</Text>
        <Text style={globalStyles.secondaryText}>{error}</Text>
        <TouchableOpacity onPress={refresh} style={styles.retry}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={globalStyles.screenContainer}>
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.welcome}>Olá, {user?.name}!</Text>
            <MonthYearFilter
              selectedMonth={selectedMonth}
              onChange={setSelectedMonth}
            />
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onLongPress={() => handleLongPress(item)}
          >
            <TransactionItem {...item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[globalStyles.secondaryText, styles.emptyText]}>
            Nenhuma transação neste mês.
          </Text>
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        contentContainerStyle={globalStyles.content}
      />
      <TransactionActionsModal
        categories={categories}
        onClose={() => setSelectedTransaction(null)}
        onDelete={handleDelete}
        onSave={handleSave}
        transaction={selectedTransaction}
        visible={Boolean(selectedTransaction)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  emptyText: {
    textAlign: "center",
    marginTop: 24,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 24,
  },
  retry: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryText: {
    color: colors.primaryContrast,
    fontWeight: "600",
  },
  header: {
    gap: 12,
  },
  welcome: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primaryText,
  },
})
