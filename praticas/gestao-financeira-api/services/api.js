import Constants from "expo-constants"
import { Platform } from "react-native"

const REQUEST_TIMEOUT_MS = 8000

function getDevServerHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost ??
    Constants.manifest?.debuggerHost

  return hostUri?.split(":")[0]
}

function getBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL
  }

  if (Platform.OS === "web") {
    return "http://localhost:3000"
  }

  const devServerHost = getDevServerHost()
  if (
    devServerHost &&
    devServerHost !== "localhost" &&
    devServerHost !== "127.0.0.1"
  ) {
    return `http://${devServerHost}:3000`
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000"
  }

  return "http://localhost:3000"
}

const BASE_URL = getBaseUrl()

async function request(path, options = {}) {
  const controller = new AbortController()
  let timeoutId

  try {
    const response = await Promise.race([
      fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        ...options,
      }),
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          controller.abort()
          reject(new Error(`Tempo esgotado ao conectar em ${BASE_URL}`))
        }, REQUEST_TIMEOUT_MS)
      }),
    ])

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`HTTP ${response.status}: ${text}`)
    }

    return response.status === 204 ? null : response.json()
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`Tempo esgotado ao conectar em ${BASE_URL}`)
    }

    throw error
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}

export const api = {
  listCategories: () => request("/categories"),
  createCategory: (data) =>
    request("/categories", { method: "POST", body: JSON.stringify(data) }),
  updateCategory: (id, data) =>
    request(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: "DELETE" }),

  listTransactions: () => request("/transactions"),
  createTransaction: (data) =>
    request("/transactions", { method: "POST", body: JSON.stringify(data) }),
  updateTransaction: (id, data) =>
    request(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteTransaction: (id) =>
    request(`/transactions/${id}`, { method: "DELETE" }),
}
