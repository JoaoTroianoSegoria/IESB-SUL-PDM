import { useContext, useEffect, useMemo, useRef, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native"

import Button from "../../components/Button"
import CategoryPicker from "../../components/CategoryPicker"
import CurrencyInput from "../../components/CurrencyInput"
import DatePicker from "../../components/DatePicker"
import DescriptionInput from "../../components/DescriptionInput"
import { colors } from "../../constants/colors"
import { MoneyContext } from "../../contexts/GlobalState"
import { globalStyles } from "../../styles/globalStyles"

function createInitialForm(categoryId = "") {
  return {
    description: "",
    value: 0,
    date: new Date(),
    categoryId,
  }
}

export default function AddTransactions() {
  const { addTransaction, categories, loading } = useContext(MoneyContext)
  const valueInputRef = useRef(null)

  const defaultCategoryId = useMemo(() => {
    if (categories.length === 0) return ""

    const incomeCategory = categories.find((category) => category.isIncome)
    return incomeCategory ? incomeCategory.id : categories[0].id
  }, [categories])

  const [form, setForm] = useState(() => createInitialForm())
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!form.categoryId && defaultCategoryId) {
      setForm((currentForm) => ({
        ...currentForm,
        categoryId: defaultCategoryId,
      }))
    }
  }, [defaultCategoryId, form.categoryId])

  const handleAddTransaction = async () => {
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
      await addTransaction({
        description: form.description.trim(),
        value: form.value,
        date: form.date,
        categoryId: form.categoryId,
      })

      setForm(createInitialForm(defaultCategoryId))
      Alert.alert("Transação adicionada com sucesso!")
    } catch (error) {
      console.log(error)
      Alert.alert("Não foi possível salvar a transação.", error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={globalStyles.secondaryText}>Carregando categorias...</Text>
      </View>
    )
  }

  if (categories.length === 0) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <Text style={globalStyles.primaryText}>
          Nenhuma categoria cadastrada.
        </Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView style={globalStyles.screenContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={globalStyles.content}>
          <View style={styles.form}>
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
          </View>

          <Button onPress={handleAddTransaction} disabled={submitting}>
            {submitting ? "Salvando..." : "Adicionar"}
          </Button>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  form: {
    gap: 12,
    marginTop: 10,
    marginBottom: 40,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 24,
  },
})
