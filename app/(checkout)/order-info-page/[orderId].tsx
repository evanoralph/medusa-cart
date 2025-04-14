import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import { Button } from "@/components/ui/button";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/utils/format-currency";
import { medusa } from "@/services/medusa";
import Ionicons from '@expo/vector-icons/Ionicons';
import { StoreOrder } from "@medusajs/types";
import { useRetrieveOrder } from "@/useQueries/cart";
import SafetyContainer from "@/components/custom-ui/safety-container";

export default function OrderInfoPage() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const { data: order, isLoading } = useRetrieveOrder(orderId as string);

  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Text>Loading order information...</Text>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Text>Order not found</Text>
        <Button onPress={() => router.push("/")} className="mt-4">
          <Text>Continue Shopping</Text>
        </Button>
      </Box>
    );
  }

  const orderData = order as StoreOrder;

  return (
    <SafetyContainer> 
    <ScrollView className="flex-1 p-4">
      {/* Order Status */}
      <Box className="mb-6">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold">Order #{orderData.display_id}</Text>
          <View className="flex-row items-center">
            <Ionicons 
              name={orderData.status === "completed" ? "checkmark-circle" : "time"} 
              size={24} 
              color={orderData.status === "completed" ? "#10B981" : "#F59E0B"} 
            />
            <Text className="ml-2 text-lg font-medium">
              {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
            </Text>
          </View>
        </View>
        <Text className="text-gray-600 mt-2">
          Ordered on {new Date(orderData.created_at).toLocaleDateString()}
        </Text>
      </Box>

      {/* Order Items */}
      <Box className="mb-6">
        <Text className="text-xl font-semibold mb-4">Order Items</Text>
        {orderData.items?.map((item) => (
          <View key={item.id} className="flex-row items-center mb-4">
            <Image
              source={{ uri: item.thumbnail || '' }}
              style={styles.thumbnail}
            />
            <View className="flex-1 ml-4">
              <Text className="text-lg font-semibold">{item.title}</Text>
              <Text className="text-gray-600">
                {formatCurrency(item.unit_price)} x {item.quantity}
              </Text>
              <Text className="text-lg font-bold mt-1">
                {formatCurrency(item.unit_price * item.quantity)}
              </Text>
            </View>
          </View>
        ))}
      </Box>

      {/* Shipping Information */}
      <Box className="mb-6">
        <Text className="text-xl font-semibold mb-4">Shipping Information</Text>
        <View className="bg-gray-50 p-4 rounded-lg">
          <Text className="font-medium">
            {orderData.shipping_address?.first_name} {orderData.shipping_address?.last_name}
          </Text>
          <Text>{orderData.shipping_address?.address_1}</Text>
          <Text>
            {orderData.shipping_address?.city}, {orderData.shipping_address?.postal_code}
          </Text>
          <Text>{orderData.shipping_address?.country_code}</Text>
          <Text className="mt-2">Phone: {orderData.shipping_address?.phone}</Text>
        </View>
      </Box>

      {/* Order Summary */}
      <Box className="mb-6">
        <Text className="text-xl font-semibold mb-4">Order Summary</Text>
        <View className="bg-gray-50 p-4 rounded-lg">
          <View className="flex-row justify-between mb-2">
            <Text>Subtotal</Text>
            <Text>{formatCurrency(orderData.subtotal)}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text>Shipping</Text>
            <Text>{formatCurrency(orderData.shipping_total)}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text>Tax</Text>
            <Text>{formatCurrency(orderData.tax_total)}</Text>
          </View>
          <View className="flex-row justify-between font-bold mt-4 pt-4 border-t border-gray-200">
            <Text>Total</Text>
            <Text>{formatCurrency(orderData.total)}</Text>
          </View>
        </View>
      </Box>

      {/* Actions */}
      <Button
        onPress={() => router.push("/main/home")}
        className="bg-black"
      >
        <Text className="text-white text-lg font-semibold">
          Back to Home
        </Text>
      </Button>
    </ScrollView>
    </SafetyContainer>
  );
}

const styles = StyleSheet.create({
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
});
