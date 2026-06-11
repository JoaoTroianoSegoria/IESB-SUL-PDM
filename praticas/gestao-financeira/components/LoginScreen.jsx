import { useContext, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"
import Button from "./Button"
import { colors } from "../constants/colors"
import { MoneyContext } from "../contexts/GlobalState"
import { globalStyles } from "../styles/globalStyles"

export default function LoginScreen() {
  const { authLoading, login } = useContext(MoneyContext)
  const [email, setEmail] = useState("aluno@iesb.com")
  const [password, setPassword] = useState("123456")
  const [submitting, setSubmitting] = useState(false)

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Informe e-mail e senha.")
      return
    }

    setSubmitting(true)
    try {
      await login({
        email: email.trim().toLowerCase(),
        password,
      })
    } catch (error) {
      Alert.alert("Não foi possível entrar", error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <KeyboardAvoidingView style={[globalStyles.screenContainer, styles.center]}>
      <View style={styles.form}>
        <Text style={styles.title}>Gestão Financeira</Text>
        <Text style={globalStyles.secondaryText}>
          Entre para acessar suas receitas e despesas.
        </Text>

        <View>
          <Text style={globalStyles.inputLabel}>E-mail</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={globalStyles.input}
          />
        </View>

        <View>
          <Text style={globalStyles.inputLabel}>Senha</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={globalStyles.input}
          />
        </View>

        <Button onPress={handleLogin} disabled={submitting}>
          {submitting ? "Entrando..." : "Entrar"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  form: {
    gap: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.primaryText,
  },
})
