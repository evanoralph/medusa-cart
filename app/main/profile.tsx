import { Text } from "@/components/ui/text";
import { useAuth } from "@/providers/auth-provider";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { router } from "expo-router";
import { useGetCustomer } from "@/useQueries/auth";
import { Ionicons } from "@expo/vector-icons";
import { useGetAllOrders } from "@/useQueries/cart";

export default function Profile() {
  const { data: customer } = useGetCustomer();
  const { logout } = useAuth();
  const { data: orders } = useGetAllOrders();
  console.log(orders, 'customer')

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/auth/sign-in");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <Box className="flex-1 p-4">
      <Box className=" items-center gap-2 justify-center">
        <Ionicons name="person" size={40} color="black" />
        <Text className="text-xl mb-4">{customer?.email}</Text>
      </Box>

      <Box className="flex-1">
        <Text className="text-xl mb-4">Orders</Text>
        {orders?.map((order) => (
          <Box key={order.id}>
            <Text>{order.id}</Text>
            <Text>{order.created_at}</Text>
            <Text>{order.total}</Text>
          </Box>
        ))}
      </Box>
      <Button
        onPress={handleLogout}
        className="bg-red-500"
      >
        <ButtonText>Logout</ButtonText>
      </Button>
    </Box>
  );
}
