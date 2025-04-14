import { Input, InputField } from "@/components/ui/input";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

interface CustomInputProps {
  placeholder: string,
  value: string,
  onChangeText: (text: string) => void,
  error?: string,
  secureTextEntry?: boolean,
}

export default function CustomInput({ 
  placeholder, 
  value, 
  onChangeText,
  error,
  secureTextEntry = false,
  ...props
}: CustomInputProps) {
  return (
    <Box className="w-full ">
      <Input className={`border-0 ${error ? 'border-b-2 border-red-500' : ''} bg-[rgba(255,255,255,0.2)] h-[50px] p-2 rounded-lg`}>
        <InputField
          autoCapitalize="none"
          placeholderClassName="text-white"
          className="text-white m-0 p-0 border-0 font-medium text-[24px]"
          placeholder={placeholder} 
          value={value} 
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          {...props}
        />
      </Input>
      {error && (
        <Text className="text-red-500 text-sm mt-2">{error}</Text>
      )}
    </Box>
  );
}