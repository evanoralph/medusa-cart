import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { router, useRouter } from "expo-router";
import SafetyContainer from "@/components/custom-ui/safety-container";  
import ContentBox from "@/components/custom-ui/content-box";
import MedusaLogo from "@/assets/images/app-logo/medusa-logo.png";
import { Image, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";
import { loginCustomer } from "@/services/medusa";

export default function Home() {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -20,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

  useEffect(() => {
    // Add a small delay to ensure the layout is mounted
    const timer = setTimeout(() => {
      router.push("/auth/sign-in");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return <Box className="flex-1 bg-slate-300">
    <SafetyContainer >
      
      <Box className="w-full h-full justify-center items-center"> 
        <Text className="text-2xl text-red-500">Welcome to Medusa</Text>
        <Animated.View
          style={{
            transform: [
              { scale: scaleAnim },
              { translateY: bounceAnim }
            ]
          }}
        >
          <Image source={MedusaLogo} resizeMode="contain" alt="Medusa Logo" className="w-[300px]" />
        </Animated.View>
      </Box>
    </SafetyContainer>
  </Box>;
}


