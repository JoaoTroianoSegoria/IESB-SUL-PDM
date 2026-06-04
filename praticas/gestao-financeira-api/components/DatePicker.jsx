import { useState } from "react"
import { Platform, Text, TextInput, TouchableOpacity, View } from "react-native"
import RNDateTimePicker from "@react-native-community/datetimepicker"
import { globalStyles } from "../styles/globalStyles"

export default function DatePicker({ form, setForm }) {
  const [showPicker, setShowPicker] = useState(false)

  const handleDateChange = (_, selectedDate) => {
    setShowPicker(false)

    if (selectedDate) {
      setForm((currentForm) => ({ ...currentForm, date: selectedDate }))
    }
  }

  return (
    <View>
      <Text style={globalStyles.inputLabel}>Data</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <TextInput
          value={form.date.toLocaleDateString("pt-BR")}
          editable={false}
          pointerEvents="none"
          style={globalStyles.input}
        />
      </TouchableOpacity>

      {showPicker && (
        <RNDateTimePicker
          display={Platform.OS === "ios" ? "inline" : "default"}
          mode="date"
          value={form.date}
          onChange={handleDateChange}
        />
      )}
    </View>
  )
}
