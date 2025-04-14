import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { ScrollView } from "react-native";
import { PropsWithChildren } from "react";

interface ContentBoxProps extends PropsWithChildren {
  refLayout: any;
}

export default function ContentBox({ children, refLayout }: ContentBoxProps) {
  return <Box ref={refLayout} className="p-4 flex-1 w-full">
    {children}
  </Box>;
}
