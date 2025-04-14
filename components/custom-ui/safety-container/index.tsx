import { SafeAreaView } from "react-native-safe-area-context";
import { PropsWithChildren } from "react";

export default function SafetyContainer({ children }: PropsWithChildren) {
  return <SafeAreaView style={{ flex: 1, width: "100%" }}>{children}</SafeAreaView>;
}
