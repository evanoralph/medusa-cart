import SafetyContainer from "@/components/custom-ui/safety-container";
import { Stack, Slot } from "expo-router";

export default function AuthLayout() {
  return (<Stack>
    <Stack.Screen name="sign-in" options={{ headerShown: false, animation: 'fade' }} />
    <Stack.Screen name="sign-up" options={{ headerShown: false, animation: 'fade' }} />
  </Stack>
  );
}


