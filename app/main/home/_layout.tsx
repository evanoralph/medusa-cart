import { Box } from "@/components/ui/box";
import { Stack, Slot } from "expo-router";

export default function SignInLayout() {
  return <Box className="flex-1">
    <Slot />
  </Box>
}