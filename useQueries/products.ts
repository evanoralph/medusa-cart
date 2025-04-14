import { useQuery, useMutation } from "@tanstack/react-query";
import { addToCart, getProductById, getProducts, getCart, removeFromCart } from "@/services/medusa";

export const useProducts = () => {
  return useQuery({ 
    queryKey: ["products"], 
    queryFn: getProducts 
  });
};

export const useProductById = (id: string) => {
  return useQuery({ 
    queryKey: ["product", id], 
    queryFn: () => getProductById(id) 
  });
};

export const useAddToCart = () => {
  return useMutation({
    mutationFn: ({variantId, quantity}: {variantId: string, quantity: number}) => addToCart(variantId, quantity),
    onSuccess: (response) => {
      console.log('success', response)
    },
    onError: () => {
      console.log('error')
    }
  });
}

export const useRemoveFromCart = () => {
  return useMutation({
    mutationFn: (variantId: string) => removeFromCart(variantId),
  });
}

export const getCartData = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: ()=>getCart()
  });
}



