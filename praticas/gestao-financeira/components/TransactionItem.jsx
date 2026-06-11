import { StyleSheet, Text, View } from "react-native"
import { globalStyles } from "../styles/globalStyles"
import CategoryItem from "./CategoryItem"

export default function TransactionItem({ category, date, description, value }) {
  const valueStyle = category?.isIncome
    ? globalStyles.positiveText
    : globalStyles.negativeText

  return (
    <>
      <View style={styles.itemContainer}>
        <CategoryItem category={category} />
        <View style={styles.textContainer}>
          <Text style={globalStyles.secondaryText}>{formatDate(date)}</Text>
          <View style={styles.bottomLineContainer}>
            <Text style={globalStyles.primaryText}>{description}</Text>
            <Text style={valueStyle}>{formatCurrency(Number(value))}</Text>
          </View>
        </View>
      </View>
      <View style={globalStyles.line} />
    </>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 4,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 8,
  },
  bottomLineContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
})

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR")
}
