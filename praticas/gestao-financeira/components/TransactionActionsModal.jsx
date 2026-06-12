import { useEffect, useRef, useState } from "react"
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import Button from "./Button"
import CategoryPicker from "./CategoryPicker"
import CurrencyInput from "./CurrencyInput"
import DatePicker from "./DatePicker"
import DescriptionInput from "./DescriptionInput"
import { colors } from "../constants/colors"
import { globalStyles } from "../styles/globalStyles"

function buildForm(transaction) {
  return {
    description: transaction?.description ?? "",
    value: Number(transaction?.value ?? 0),
    date: transaction ? new Date(transaction.date) : new Date(),
    categoryId: transaction?.categoryId ?? "",
  }
}

export default function TransactionActionsModal({
  categories,
  onClose,
  onDelete,
  onSave,
  transaction,
  visible,
}) {
  const valueInputRef = useRef(null)
  const [form, setForm] = useState(() => buildForm(transaction))
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setForm(buildForm(transaction))
  }, [transaction])

  if (!transaction) {
    return null
  }

  const handleSave = async () => {
    if (!form.description.trim()) {
      Alert.alert("Informe a descrição.")
      return
    }

    if (!form.value || form.value <= 0) {
      Alert.alert("Informe um valor maior que zero.")
      return
    }

    if (!form.categoryId) {
      Alert.alert("Selecione uma categoria.")
      return
    }

    setSubmitting(true)
    try {
      await onSave({
        description: form.description.trim(),
        value: form.value,
        date: form.date,
        categoryId: form.categoryId,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = () => {
    Alert.alert(
      "Excluir transação",
      `Deseja excluir "${transaction.description}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: onDelete,
        },
      ],
      { cancelable: true },
    )
  }

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modal}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView contentContainerStyle={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>Editar transação</Text>
                <TouchableOpacity onPress={onClose} hitSlop={8}>
                  <Text style={styles.close}>Fechar</Text>
                </TouchableOpacity>
              </View>

              <DescriptionInput
                form={form}
                setForm={setForm}
                valueInputRef={valueInputRef}
              />
              <CurrencyInput
                form={form}
                setForm={setForm}
                valueInputRef={valueInputRef}
              />
              <DatePicker form={form} setForm={setForm} />
              <CategoryPicker
                categories={categories}
                form={form}
                setForm={setForm}
              />

              <Button onPress={handleSave} disabled={submitting}>
                {submitting ? "Salvando..." : "Salvar alterações"}
              </Button>

              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteText}>Excluir transação</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  modal: {
    maxHeight: "88%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: colors.background,
  },
  content: {
    gap: 12,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primaryText,
  },
  close: {
    color: colors.primary,
    fontWeight: "700",
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.negativeText,
  },
  deleteText: {
    color: colors.negativeText,
    fontSize: globalStyles.primaryText.fontSize,
    fontWeight: "700",
  },
})
