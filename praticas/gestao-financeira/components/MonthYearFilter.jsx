import { MaterialIcons } from "@expo/vector-icons"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { colors } from "../constants/colors"
import { getMonthLabel, shiftMonth } from "../utils/monthFilter"

export default function MonthYearFilter({ selectedMonth, onChange }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        accessibilityLabel="Mês anterior"
        onPress={() => onChange(shiftMonth(selectedMonth, -1))}
        style={styles.button}
      >
        <MaterialIcons name="chevron-left" size={28} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.label}>{getMonthLabel(selectedMonth)}</Text>

      <TouchableOpacity
        accessibilityLabel="Próximo mês"
        onPress={() => onChange(shiftMonth(selectedMonth, 1))}
        style={styles.button}
      >
        <MaterialIcons name="chevron-right" size={28} color={colors.primary} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.secondaryText,
    borderRadius: 8,
    backgroundColor: colors.primaryContrast,
  },
  button: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: colors.primaryText,
  },
})
