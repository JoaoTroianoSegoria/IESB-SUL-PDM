import { Text, TextInput, View } from "react-native"
import { globalStyles } from "../styles/globalStyles"

export default function CurrencyInput({ form, setForm, valueInputRef }) {
  const handleCurrencyChange = (text) => {
    const onlyNumbers = text.replace(/\D/g, "")
    const value = onlyNumbers ? Number(onlyNumbers) / 100 : 0

    setForm((currentForm) => ({ ...currentForm, value }))
  }

  return (
    <View>
      <Text style={globalStyles.inputLabel}>Valor</Text>
      <TextInput
        ref={valueInputRef}
        value={formatCurrency(form.value)}
        onChangeText={handleCurrencyChange}
        keyboardType="numeric"
        returnKeyType="done"
        style={globalStyles.input}
      />
    </View>
  )
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
