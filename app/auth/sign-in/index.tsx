import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ImageBackground, ActivityIndicator } from "react-native";
import CustomInput from "@/components/custom-ui/Input";
import ContentBox from "@/components/custom-ui/content-box";
import MedusaPattern from "@/assets/images/bg/medusa-pattern.png";
import { useState } from "react";
import SafetyContainer from "@/components/custom-ui/safety-container";
import { VStack } from "@/components/ui/vstack";
import { Button as ButtonUI, ButtonText } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { router } from "expo-router";
import CustomButton from "@/components/custom-ui/button";
import { Link } from "expo-router";
import MedusaLogoM from "@/assets/images/app-logo/medusa-logo-m.png";
import { Image } from "@/components/ui/image";
import { loginCustomer } from "@/services/medusa";
import { useMeCustomer, useMedusa } from "medusa-react";
export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setError(null);
  }

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setError(null);
  }

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await loginCustomer(email, password);
      await login(token as string);
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  }

  return <ImageBackground source={MedusaPattern} className="flex-1 w-full justify-center items-center">
    <SafetyContainer>
      <Box className="flex-1 justify-center items-center">
        <Box className="w-[90%] h-[50%] rounded-xl p-6 self-center bg-[rgba(0,0,0,0.7)]">
          <Image source={MedusaLogoM} className="w-20 h-20 self-center" />
          <Text className="text-2xl text-center font-heading text-white">Medusa</Text>
          <VStack className="gap-4 mt-4">
            <CustomInput 
              placeholder="Email" 
              value={email} 
              onChangeText={handleEmailChange}
            />
            <CustomInput 
              secureTextEntry 
              placeholder="Password" 
              value={password} 
              onChangeText={handlePasswordChange}
            />
            {error && (
              <Text className="text-red-500 text-center">{error}</Text>
            )}
          </VStack>
          <CustomButton 
            className="mt-4 w-full h-[50px] rounded-xl bg-white"
            onPress={handleSignIn}
            isDisabled={isLoading}
            isLoading={isLoading}
          >
            <ButtonText className="text-black text-center">Sign In</ButtonText>
          </CustomButton>
          <Text className="text-white text-center mt-4">Don't have an account? <Link href="/auth/sign-up">Sign Up</Link></Text>
        </Box>
      </Box>
    </SafetyContainer>
  </ImageBackground>
}