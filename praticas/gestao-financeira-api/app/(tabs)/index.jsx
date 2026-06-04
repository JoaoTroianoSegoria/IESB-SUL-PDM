import { useContext } from "react"
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

import TransactionItem from "../../components/TransactionItem"
import { colors } from "../../constants/colors"
import { MoneyContext } from "../../contexts/GlobalState"
import { globalStyles } from "../../styles/globalStyles"

export default function Transactions() {
  const { error, loading, refresh, removeTransaction, transactions } =
    useContext(MoneyContext)

  const handleLongPress = (item) => {
    Alert.alert(
      "Excluir transação",
      `Deseja excluir "${item.description}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await removeTransaction(item.id)
            } catch (currentError) {
              Alert.alert(
                "Erro ao excluir",
                currentError.message ?? "Tente novamente.",
              )
            }
          },
        },
      ],
      { cancelable: true },
    )
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
        data={transactions}
        keyExtractor={(item) => String(item.id)}
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
            Ainda não há nenhum item!
          </Text>
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        contentContainerStyle={globalStyles.content}
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
})
