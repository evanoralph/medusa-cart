import SafetyContainer from "@/components/custom-ui/safety-container";
import { Text } from "@/components/ui/text";
import { useProducts } from "@/useQueries/products";
import { FlatList, View, LayoutChangeEvent } from "react-native";
import ProductListItem from "@/components/ProductListItem";
import ContentBox from "@/components/custom-ui/content-box";
import Input from "@/components/custom-ui/Input";
import CustomInput from "@/components/custom-ui/Input";
import { useEffect, useRef, useState } from "react";
import { ProductTypes } from "@medusajs/types";
import { Box } from "@/components/ui/box";


export default function Main() {
  const [search, setSearch] = useState("");
  const { data: products = [] } = useProducts();
  const [layout, setLayout] = useState<{ width: number } | null>(null);
  const contentBoxRef = useRef<View>(null);

 

  useEffect(() => {

  }, [])

  useEffect(() => {
    if (contentBoxRef.current) {
      contentBoxRef.current.measure((x, y, width, height, pageX, pageY) => {
        setLayout({ width });
      });
    }
  }, [contentBoxRef.current]);

  return <SafetyContainer>
    <ContentBox refLayout={contentBoxRef}>
      {/* Search Bar */}
      <CustomInput placeholder="Search" value={search} onChangeText={setSearch} />

      <FlatList
        numColumns={2}
        contentContainerStyle={{ gap: 10, paddingHorizontal: 5 }}
        columnWrapperStyle={{ gap: 10 }}
        data={products}
        renderItem={({ item, index }) => {
          if(index === products.length - 1 && index % 2 === 0) {
            return (
              <Box style={{ width: layout ? (layout.width / 2) - 25 : '50%' }}>
                <ProductListItem product={item as unknown as ProductTypes.ProductDTO} />
              </Box>
            )
          }
          return (
            <Box className="flex-1">
              <ProductListItem product={item as unknown as ProductTypes.ProductDTO} />
            </Box>
          )
        }}
      />
    </ContentBox>
  </SafetyContainer>;
}
