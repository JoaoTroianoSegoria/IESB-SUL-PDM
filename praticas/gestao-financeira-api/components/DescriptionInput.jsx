import { Text, TextInput, View } from "react-native"
import { globalStyles } from "../styles/globalStyles"

export default function DescriptionInput({ form, setForm, valueInputRef }) {
  return (
    <View>
      <Text style={globalStyles.inputLabel}>Descrição</Text>
      <TextInput
        value={form.description}
        onChangeText={(description) =>
          setForm((currentForm) => ({ ...currentForm, description }))
        }
        onSubmitEditing={() => valueInputRef.current?.focus()}
        placeholder="Ex: Salário"
        returnKeyType="next"
        style={globalStyles.input}
      />
    </View>
  )
}
