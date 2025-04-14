import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/services/medusa";
import { formatCurrency } from "@/utils/format-currency";
import { useState, useEffect } from "react";
import CustomInput from "@/components/custom-ui/Input";
import { useStripe } from "@stripe/stripe-react-native";
import { medusa } from "@/services/medusa";
import * as SecureStore from 'expo-secure-store';
import { StoreCartResponse, StoreOrder, StorePaymentSession, StoreCompleteCartResponse, StoreCartShippingOption, StoreCart } from "@medusajs/types";
import { getCartData } from "@/useQueries/products";
import { useCompleteOrder, useInitializePayment, useSetShippingMethod, useUpdateCart, useGetShippingOptions } from "@/useQueries/cart";
import SafetyContainer from "@/components/custom-ui/safety-container";

interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  country_code: string;
  postal_code: string;
  phone: string;
}

export default function Checkout() {
  const router = useRouter();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    "first_name": "Anna",
    "last_name": "Müller",
    "address_1": "45 Hauptstraße",
    "city": "Berlin",
    "country_code": "se",
    "postal_code": "10115",
    "phone": "+49 30 12345678"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedShippingOption, setSelectedShippingOption] = useState<string | null>(null);
  const [cartUpdated, setCartUpdated] = useState<StoreCart | null>(null);

  const { data: cart, isLoading: isCartLoading } = getCartData();
  const { mutate: completeOrder } = useCompleteOrder();
  const { mutate: initializePayment } = useInitializePayment();
  const { mutate: setShippingMethod } = useSetShippingMethod();
  const { mutate: updateCart } = useUpdateCart();
  const { data: shippingOptions } = useGetShippingOptions(cart?.cart?.id || "");

  // Load persisted shipping method on component mount
  useEffect(() => {

    const loadPersistedShippingMethod = async () => {
      try {
        const persistedShippingMethod = await SecureStore.getItemAsync('selected_shipping_method');
        if (persistedShippingMethod) {
          setSelectedShippingOption(persistedShippingMethod);
        }
      } catch (error) {
        console.error('Error loading persisted shipping method:', error);
      }
    };

    loadPersistedShippingMethod();
  }, []);

  // Set initial shipping method if cart already has one
  useEffect(() => {
    if (cart?.cart?.shipping_methods?.[0]?.id) {
      setSelectedShippingOption(cart.cart.shipping_methods[0].id);
      // Persist the shipping methodr
      SecureStore.setItemAsync('selected_shipping_method', cart.cart.shipping_methods[0].id);
    }
  }, [cart?.cart?.shipping_methods]);

  useEffect(() => {
    if (cart?.cart) {
      updateCart({
        cartId: cart.cart.id, items: {
          shipping_address: shippingAddress,
          billing_address: shippingAddress,
        }
      }, {
        onSuccess: (response) => {
          // console.log(response, 'response');
        },
        onError: (error) => {
          console.error("Error updating cart:", error);
        }
      })
    }
  }, [cart]);

  //selected shipping method
  useEffect(() => {
    if (shippingOptions) {
      handleShippingOptionSelect(shippingOptions[0].id);
    }
  }, [shippingOptions]);

  const handleShippingOptionSelect = async (optionId: string) => {
    if (!cart?.cart?.id) return;

    setSelectedShippingOption(optionId);
    // Persist the selected shipping method

    await setShippingMethod({ cartId: cart.cart.id, shippingMethodId: optionId }, {
      onSuccess: (response) => {

        setCartUpdated({ ...response });

        console.log("Shipping method set successfully");
      },
      onError: (error) => {
        console.error("Error setting shipping method:", error);
        setSelectedShippingOption(null);
        // Remove persisted shipping method on error

      }
    });
  };

  const handleCheckout = async () => {
    if (!cart?.cart || !selectedShippingOption) {
      console.error("Cart is undefined or no shipping method selected");
      return;
    }

    setIsLoading(true);
    try {
      // 1. First refresh the cart to ensure we have the latest state
      const { cart: refreshedCart } = await medusa.store.cart.retrieve(cart.cart.id);

      if (!refreshedCart.shipping_methods?.[0]) {
        throw new Error("No shipping method selected");
      }

      console.log(cartUpdated.shipping_methods, 'response');


      // 2. Initialize payment with fresh cart
      await initializePayment({ cart: cartUpdated, paymentProvider: "pp_stripe_stripe" }, {
        onSuccess: async (response) => {
          // 3. Get the updated cart with new payment session
          const { cart: updatedCart } = await medusa.store.cart.retrieve(refreshedCart.id);


          const activePaymentSession = updatedCart?.payment_collection?.payment_sessions?.[0];
          if (!activePaymentSession?.data?.client_secret) {
            throw new Error("No active payment session found");
          }

          // 4. Initialize payment sheet with fresh client secret
          const { error: initError } = await initPaymentSheet({
            merchantDisplayName: "Medusa Store",
            customerId: updatedCart.customer_id || "",
            paymentIntentClientSecret: String(activePaymentSession.data.client_secret),
            allowsDelayedPaymentMethods: true,
            returnURL: "exp://192.168.1.100:8081/--/main",
            defaultBillingDetails: {
              name: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
              address: {
                line1: shippingAddress.address_1,
                city: shippingAddress.city,
                postalCode: shippingAddress.postal_code,
                country: shippingAddress.country_code,
              },
              phone: shippingAddress.phone,
            },
          });

          if (initError) {
            throw initError;
          }

          // 5. Present payment sheet
          const { error: presentError } = await presentPaymentSheet();
          if (presentError) {
            throw presentError;
          }

          // 6. Complete the order
          completeOrder(updatedCart.id, {
            onSuccess: async (response: StoreCompleteCartResponse) => {
              // 7. Clear the cart and navigate to success
              console.log(response, 'response');
              await SecureStore.deleteItemAsync('cart_id');
              //clear cart
              router.push(`/(checkout)/order-info-page/${response.order.id}`);
            },
            onError: (error) => {
              console.error("Error completing order:", error);
              // Handle error appropriately
            }
          });
        },
        onError: (error) => {
          console.error("Error initializing payment:", error);
          // Handle error appropriately
        }
      });
    } catch (error) {
      console.error("Checkout error:", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  if (isCartLoading) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </Box>
    );
  }

  if (!cart?.cart || !cart.cart.items || cart.cart.items.length === 0) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Text>Your cart is empty</Text>
        <Button onPress={() => router.push("/")} className="mt-4">
          <Text>Continue Shopping</Text>
        </Button>
      </Box>
    );
  }

  return (
    <SafetyContainer>
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-6">Checkout</Text>

        {/* Shipping Information */}
        <Box className="mb-6">
          <Text className="text-xl font-semibold mb-4">Shipping Information</Text>
          <View className="space-y-2">
            <Text className="text-base">
              <Text className="font-medium">Name: </Text>
              {`${shippingAddress.first_name} ${shippingAddress.last_name}`}
            </Text>
            <Text className="text-base">
              <Text className="font-medium">Address: </Text>
              {shippingAddress.address_1}
            </Text>
            <Text className="text-base">
              <Text className="font-medium">City: </Text>
              {shippingAddress.city}
            </Text>
            <Text className="text-base">
              <Text className="font-medium">Postal Code: </Text>
              {shippingAddress.postal_code}
            </Text>
            <Text className="text-base">
              <Text className="font-medium">Phone: </Text>
              {shippingAddress.phone}
            </Text>
          </View>
        </Box>

        {/* Shipping Options */}
        <Box className="mb-6">
          <Text className="text-xl font-semibold mb-4">Shipping Options</Text>
          {shippingOptions?.map((option: StoreCartShippingOption) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => handleShippingOptionSelect(option.id)}
              className={`flex-row items-center justify-between p-4 mb-2 rounded-lg border ${selectedShippingOption === option.id ? 'border-black' : 'border-gray-200'
                }`}
            >
              <View className="flex-1">
                <Text className="font-medium">{option.name}</Text>
                <Text className="text-gray-600">
                  {option.data?.min_days ? `Estimated delivery: ${option.data.min_days}-${option.data.max_days} days` : 'Standard delivery'}
                </Text>
              </View>
              <Text className="font-medium">
                {option.amount ? formatCurrency(option.amount) : 'Free'}
              </Text>
            </TouchableOpacity>
          ))}
        </Box>

        {/* Order Summary */}
        <Box className="mb-6">
          <Text className="text-xl font-semibold mb-4">Order Summary</Text>
          {cart.cart.items?.map((item) => (
            <View key={item.id} className="flex-row justify-between mb-2">
              <Text>{item.title} x {item.quantity}</Text>
              <Text>{formatCurrency(item.unit_price * item.quantity)}</Text>
            </View>
          ))}
          <View className="border-t border-gray-200 mt-4 pt-4">
            <View className="flex-row justify-between mb-2">
              <Text>Subtotal</Text>
              <Text>{formatCurrency(cart.cart.subtotal)}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text>Shipping</Text>
              <Text>{formatCurrency(cart.cart.shipping_total)}</Text>
            </View>
            <View className="flex-row justify-between font-bold">
              <Text className="font-bold">Total</Text>
              <Text className="font-bold">{formatCurrency(cart.cart.total)}</Text>
            </View>
          </View>
        </Box>

        {/* Checkout Button */}
        <Button
          onPress={handleCheckout}
          disabled={isLoading || !selectedShippingOption}
          className="bg-black"
        >
          <Text className="text-white text-lg font-semibold">
            {isLoading ? "Processing..." : "Complete Purchase"}
          </Text>
        </Button>
        <Button onPress={() => router.push("/main/home")}
             className="bg-red-300 mt-4"
        >
          <Text className="text-white text-lg font-semibold">Continue Shopping</Text>
        </Button>
      </ScrollView>
    </SafetyContainer>
  );
}