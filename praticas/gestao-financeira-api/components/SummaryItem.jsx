import { StyleSheet, Text, View } from "react-native"
import { globalStyles } from "../styles/globalStyles"
import CategoryItem from "./CategoryItem"

export default function SummaryItem({ category, value }) {
  const valueStyle = category?.isIncome
    ? globalStyles.positiveText
    : globalStyles.negativeText

  return (
    <View style={styles.itemContainer}>
      <CategoryItem category={category} />
      <View style={styles.textContainer}>
        <Text style={globalStyles.primaryText}>{category.displayName}</Text>
        <Text style={valueStyle}>{formatCurrency(value)}</Text>
      </View>
    </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 12,
    gap: 12,
  },
})

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
