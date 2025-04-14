import SafetyContainer from "@/components/custom-ui/safety-container";
import { Box } from "@/components/ui/box";
import { Stack, Slot } from "expo-router";

export default function ProductLayout() {
  return <SafetyContainer>
    <Slot />
  </SafetyContainer>
}