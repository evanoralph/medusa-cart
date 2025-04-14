import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { ImageBackground } from "react-native";
import CustomInput from "@/components/custom-ui/Input";
import MedusaPattern from "@/assets/images/bg/medusa-pattern.png";
import { useState } from "react";
import SafetyContainer from "@/components/custom-ui/safety-container";
import { VStack } from "@/components/ui/vstack";
import { ButtonText } from "@/components/ui/button";
import { router } from "expo-router";
import CustomButton from "@/components/custom-ui/button";
import { Link } from "expo-router";
import MedusaLogoM from "@/assets/images/app-logo/medusa-logo-m.png";
import { Image } from "@/components/ui/image";
import { registerCustomer } from "@/services/medusa";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setError(null);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setError(null);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setError(null);
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await registerCustomer(email, password);
      router.replace("/auth/sign-in");
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground source={MedusaPattern} className="flex-1 w-full justify-center items-center">
      <SafetyContainer>
        <Box className="flex-1 justify-center items-center">
          <Box className="w-[90%] h-[60%] rounded-xl p-6 self-center bg-[rgba(0,0,0,0.7)]">
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
              <CustomInput 
                secureTextEntry 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChangeText={handleConfirmPasswordChange}
              />
              {error && (
                <Text className="text-red-500 text-center">{error}</Text>
              )}
            </VStack>
            <CustomButton 
              className="mt-4 w-full h-[50px] rounded-xl bg-white"
              onPress={handleSignUp}
              isDisabled={isLoading}
              isLoading={isLoading}
            >
              <ButtonText className="text-black text-center">Sign Up</ButtonText>
            </CustomButton>
            <Text className="text-white text-center mt-4">
              Already have an account? <Link href="/auth/sign-in">Sign In</Link>
            </Text>
          </Box>
        </Box>
      </SafetyContainer>
    </ImageBackground>
  );
}