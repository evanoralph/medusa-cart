import { Text } from "@/components/ui/text";
import { View, Image, StyleSheet, Animated, Dimensions, TouchableOpacity } from "react-native";
import ContentBox from "@/components/custom-ui/content-box";
import { useProductById } from "@/useQueries/products";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format-currency";
import { useRef, useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons'; 
import { useAddToCart } from "@/useQueries/products";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = 300;

export default function Product() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: product, isLoading } = useProductById(id as string);
  const { mutate: addToCart } = useAddToCart();

  const scrollY = useRef(new Animated.Value(0)).current;
  const [scrollEnabled, setScrollEnabled] = useState(true);

  console.log(product?.variants?.[0]?.metadata, 'metadata')

  const pledgeProgress = product?.variants?.[0]?.metadata?.pledge_amount || 0; // This would come from your actual data
  const totalPledges = product?.variants?.[0]?.metadata?.pledge_limit || 0; // This would come from your actual data
  const discount = "10% Off";

  const imageScale = scrollY.interpolate({
    inputRange: [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
    outputRange: [2, 1, 1],
    extrapolate: 'clamp',
  });

  const imageTranslateY = scrollY.interpolate({
    inputRange: [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
    outputRange: [-IMAGE_HEIGHT / 2, 0, 0],
    extrapolate: 'clamp',
  });

  const handleAddToCart = async () => {
    if (!product?.variants?.[0]?.id) return;
    
    addToCart(
      { variantId: product.variants[0].id, quantity: 1 },
      {
        onSuccess: () => {
          router.push('/main/cart');
        }
      }
    );
  }

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  return (
    <ContentBox refLayout={null}>
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEnabled={scrollEnabled}
        onScrollBeginDrag={() => setScrollEnabled(true)}
        onScrollEndDrag={() => setScrollEnabled(true)}
        onMomentumScrollEnd={() => setScrollEnabled(true)}
      >
        <View className="flex-1 p-4">
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => router.back()}
            className="absolute top-4 left-4 z-10 bg-white/80 rounded-full p-2"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          {/* Product Image */}
          <Animated.View
            style={[
              styles.imageContainer,
              {
                transform: [
                  { scale: imageScale },
                  { translateY: imageTranslateY }
                ]
              }
            ]}
          >
            <Image
              source={{ uri: product?.thumbnail || '' }}
              style={styles.image}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Product Info */}
          <View className="gap-4">
            <Text className="text-2xl font-semibold">{product?.title}</Text>
            <Text className="text-3xl font-bold text-blue-600">
              {product?.variants?.[0]?.calculated_price?.calculated_amount 
                ? formatCurrency(product.variants[0].calculated_price.calculated_amount)
                : formatCurrency(0)}
            </Text>

            {/* Pledge Progress */}
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-medium">
                  {pledgeProgress}/{totalPledges} pledges
                </Text>
                <View className="bg-pink-50 px-2 py-1 rounded">
                  <Text className="text-pink-500 font-medium">{discount}</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <View 
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${(pledgeProgress / totalPledges) * 100}%` }}
                />
              </View>
            </View>

            {/* Pledge Button */}
            <Button 
              variant="solid"
              className="mt-4 w-full h-12 bg-black"
              onPress={() => {
                handleAddToCart()
              }}
            >
              <Text className="text-white text-base font-semibold">Pledge</Text>
            </Button>
          </View>
        </View>
      </Animated.ScrollView>
    </ContentBox>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    marginBottom: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});
