import { Picker } from "@react-native-picker/picker"
import { StyleSheet, Text, View } from "react-native"
import { colors } from "../constants/colors"
import { globalStyles } from "../styles/globalStyles"

export default function CategoryPicker({ categories, form, setForm }) {
  return (
    <View>
      <Text style={globalStyles.inputLabel}>Categoria</Text>
      <View style={styles.picker}>
        <Picker
          selectedValue={form.categoryId}
          onValueChange={(categoryId) =>
            setForm((currentForm) => ({ ...currentForm, categoryId }))
          }
        >
          {categories.map((category) => (
            <Picker.Item
              key={category.id}
              label={category.displayName}
              value={category.id}
            />
          ))}
        </Picker>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  picker: {
    justifyContent: "center",
    minHeight: 44,
    borderColor: colors.secondaryText,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: colors.primaryContrast,
  },
})
