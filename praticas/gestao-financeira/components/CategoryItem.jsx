import { MaterialIcons } from "@expo/vector-icons"
import { StyleSheet, View } from "react-native"
import { colors } from "../constants/colors"

export default function CategoryItem({ category }) {
  const backgroundColor = category?.background ?? colors.categoryFood
  const icon = category?.icon ?? "fastfood"

  return (
    <View style={[styles.background, { backgroundColor }]}>
      <MaterialIcons
        name={icon}
        size={24}
        color={colors.primaryContrast}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    borderRadius: 22,
  },
})
