import { useQuery, useMutation } from "@tanstack/react-query";
import { getPaymentProviders, completeOrder, initializePayment, setShippingMethod, updateCart, getShippingOptions, retrieveOrder, getAllOrders } from "@/services/medusa";

export const usePaymentProviders = () => {
  return useQuery({ queryKey: ["payment-providers"], queryFn: getPaymentProviders });
}


export const useCompleteOrder = () => {
  return useMutation({
    mutationFn: (cartId: string) => completeOrder(cartId),
    onSuccess: (response) => {
      console.log(response, 'response');
    },
    onError: (error) => {
      console.log(error, 'error');
    }
  });
}

export const useInitializePayment = () => {
  return useMutation({
    mutationFn: ({cart, paymentProvider}: {cart: any, paymentProvider: string}) => initializePayment(cart, paymentProvider),
    onSuccess: (response) => {
    },
    onError: (error) => {
      console.log(error, 'error');
    }
  });
}

export const useSetShippingMethod = () => {
  return useMutation({
    mutationFn: ({cartId, shippingMethodId}: {cartId: string, shippingMethodId: string}) => setShippingMethod(cartId, shippingMethodId),
    onSuccess: (response) => {
      console.log(response, 'response');
    },
    onError: (error) => {
      console.log(error, 'error');
    }
  });
}

export const useUpdateCart = () => {
  return useMutation({
    mutationFn: ({cartId, items}: {cartId: string, items: any}) => updateCart(cartId, items),
    onSuccess: (response) => {
   
    },
    onError: (error) => {
      console.log(error, 'error');
    }
  });
}

export const useGetShippingOptions = (cartId: string) => {
  return useQuery({
    queryKey: ["shipping-options", cartId],
    queryFn: () => getShippingOptions(cartId),
  });
}

export const useRetrieveOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["retrieve-order", orderId],
    queryFn: () => retrieveOrder(orderId),
  });
}

export const useGetAllOrders = () => {
  return useQuery({
    queryKey: ["all-orders"],
    queryFn: () => getAllOrders(),
  });
}