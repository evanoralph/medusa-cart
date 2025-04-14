import { MedusaProvider as MedusaProviderBase, CartProvider } from "medusa-react"
import { QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient()
const baseUrl = process.env.EXPO_PUBLIC_MEDUSA_BASE_URL || "http://localhost:9000"
const publishableApiKey = process.env.EXPO_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_985a3cca7e01b401bb3a14ca60996dc66435b9b41c4748e9f39d189c310780b2"

export const MedusaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <MedusaProviderBase 
  baseUrl={baseUrl} 
  publishableApiKey={publishableApiKey}
  queryClientProviderProps={{ client: queryClient }}
  >
    <CartProvider>{children}</CartProvider>
  </MedusaProviderBase>
}
