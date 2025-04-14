import { useQuery } from "@tanstack/react-query";
import { getCustomer } from "@/services/medusa";

export const useGetCustomer = () => {
  return useQuery({
    queryKey: ["customer"],
    queryFn: getCustomer,
  });
};
