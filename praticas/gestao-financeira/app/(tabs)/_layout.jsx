import { MaterialIcons } from "@expo/vector-icons"
import { Tabs } from "expo-router"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { colors } from "../../constants/colors"

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.primaryContrast,
        headerTitleAlign: "center",
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarButton: (props) => (
          <TouchableOpacity {...props} activeOpacity={0.8} />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Transações",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="attach-money" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categorias",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="category" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-transactions"
        options={{
          title: "Transações",
          tabBarLabel: "Adicionar",
          tabBarIcon: () => (
            <View style={styles.addButton}>
              <MaterialIcons
                name="add"
                size={24}
                color={colors.primaryContrast}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: "Resumo",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="pie-chart" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    height: 68,
    paddingTop: 4,
    paddingBottom: 6,
    backgroundColor: colors.background,
  },
  tabLabel: {
    fontSize: 11,
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
  },
})
