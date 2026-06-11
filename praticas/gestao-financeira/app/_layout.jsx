import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useContext } from "react"
import LoginScreen from "../components/LoginScreen"
import { colors } from "../constants/colors"
import GlobalState, { MoneyContext } from "../contexts/GlobalState"

function AppContent() {
  const { user } = useContext(MoneyContext)

  return (
    <>
      <StatusBar backgroundColor={colors.primary} style="light" />
      {user ? (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      ) : (
        <LoginScreen />
      )}
    </>
  )
}

export default function RootLayout() {
  return (
    <GlobalState>
      <AppContent />
    </GlobalState>
  )
}
