import { StyleSheet, Text, TouchableHighlight } from "react-native"
import { colors } from "../constants/colors"

export default function Button({ children, disabled = false, onPress }) {
  return (
    <TouchableHighlight
      accessibilityRole="button"
      activeOpacity={0.85}
      disabled={disabled}
      underlayColor={colors.positiveText}
      style={[styles.background, disabled && styles.disabled]}
      onPress={onPress}
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  background: {
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  disabled: {
    opacity: 0.65,
  },
  text: {
    color: colors.primaryContrast,
    fontSize: 18,
    fontWeight: "600",
  },
})
