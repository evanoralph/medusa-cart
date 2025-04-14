import React, { useState } from 'react';
import { Text } from "@/components/ui/text";
import { View, Image, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from "react-native";
import ContentBox from "@/components/custom-ui/content-box";
import { isError, useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/utils/format-currency";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import { getCartData } from '@/useQueries/products';
import * as SecureStore from 'expo-secure-store';
import { StoreCartLineItem } from "@medusajs/types";
import { useFocusEffect } from 'expo-router';
import { useRemoveFromCart } from '@/useQueries/products';

interface Cart {
  id: string;
  items: StoreCartLineItem[];
  item_subtotal: number;
  shipping_total: number;
  total: number;
  currency_code: string;
  region: {
    currency_code: string;
    name: string;
  };
}

export default function Cart() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { data: cartData, refetch, isLoading, isError } = getCartData();
  const cart = cartData?.cart as Cart | undefined;
  const { mutate: removeFromCart } = useRemoveFromCart();


  const handleRemoveFromCart = (variantId: string) => {
    Alert.alert('Remove from cart', 'Are you sure you want to remove this item from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', onPress: () => {
        removeFromCart(variantId, {
          onSuccess: () => {
            refetch();
          },
          onError: () => {
            console.log('error');
          }
        });
      } }
    ]);

  }

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [])
  );
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().then(() => {
      setRefreshing(false);
    });
  }, []);

  if (!cart) {
    return (
      <ContentBox refLayout={null}>
        <View className="items-center justify-center py-8">
          <Ionicons name="cart-outline" size={64} color="#9CA3AF" />
          <Text className="text-lg text-gray-500 mt-4">Loading cart...</Text>
        </View>
      </ContentBox>
    );
  }
  

  if (isLoading) {
    return (
      <ContentBox refLayout={null}>
        <View className="items-center justify-center py-8">
          <Ionicons name="cart-outline" size={64} color="#9CA3AF" />
          <Text className="text-lg text-gray-500 mt-4">Loading cart...</Text>
        </View>
      </ContentBox>
    );
  }

  return (
    <ContentBox refLayout={null}>
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#000000']}
            tintColor="#000000"
          />
        }
      >
        <View className="p-4">
          <Text className="text-2xl font-bold mb-4">Your Cart</Text>
          
          {!cart.items || cart.items.length === 0 || isError ? (
            <View className="items-center justify-center py-8">
              <Ionicons name="cart-outline" size={64} color="#9CA3AF" />
              <Text className="text-lg text-gray-500 mt-4">Your cart is empty</Text>
              <Button 
                variant="solid"
                className="mt-4 bg-black"
                onPress={() => router.push('/')}
              >
                <Text className="text-white">Continue Shopping</Text>
              </Button>
            </View>
          ) : (
            <>
              {cart.items.map((item: StoreCartLineItem) => (
                <Box key={item.id} className="flex-row items-center p-4 border-b border-gray-200">
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
                    {item.metadata?.pledge_discount && <Text className="text-gray-600">
                     discount amount: {formatCurrency(item.metadata?.discount_amount)}
                    </Text>}
                  </View>
                  <TouchableOpacity className="p-2" onPress={() => handleRemoveFromCart(item.id || '')}>
                    <Ionicons name="trash-outline" size={24} color="#EF4444" />
                  </TouchableOpacity>
                </Box>
              ))}

              <View className="mt-6 p-4 bg-gray-50 rounded-lg">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-lg">Subtotal</Text>
                  <Text className="text-lg font-bold">{formatCurrency(cart.item_subtotal)}</Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-lg">Shipping</Text>
                  <Text className="text-lg">{formatCurrency(cart.shipping_total)}</Text>
                </View>
                <View className="flex-row justify-between mt-4 pt-4 border-t border-gray-200">
                  <Text className="text-xl font-bold">Total</Text>
                  <Text className="text-xl font-bold">{formatCurrency(cart.total)}</Text>
                </View>
              </View>

              <Button 
                variant="solid"
                className="mt-6 bg-black"
                onPress={() => {
                  // Handle checkout
                  router.push('/(checkout)');
                }}
              >
                <Text className="text-white text-lg font-semibold">Proceed to Checkout</Text>
              </Button>
            </>
          )}
        </View>
      </ScrollView>
    </ContentBox>
  );
}

const styles = StyleSheet.create({
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
});
