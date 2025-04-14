import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { ProductTypes } from "@medusajs/types";
import { Image } from "@/components/ui/image";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

interface ProductListItemProps {
  product: ProductTypes.ProductDTO;
}


export default function ProductListItem({ product }: ProductListItemProps) {
  const router = useRouter();
  const getCheapestVariant = () => {
    const cheapestVariant = product.variants.reduce((min, variant) => {
      return Math.min(min, variant.calculated_price.calculated_amount);
    }, Infinity);
    return cheapestVariant;
  } 


  return <Pressable onPress={() => router.push(`/main/home/product/${product.id}`)}>
    <Box className="w-full border-2 border-gray-300 rounded-lg p-2 items-center ">
      <Image source={{ uri: product.thumbnail || "" }} size="lg" alt={product.title} />
      <Text>{product.title}</Text>
      <Text>price Starts at ${getCheapestVariant()}</Text>
  </Box>
  </Pressable>
}