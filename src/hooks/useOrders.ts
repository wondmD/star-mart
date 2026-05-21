import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, CreateOrderRequest } from '@/services/orders';
import { Order } from '@/types';

const ORDERS_QUERY_KEY = ['orders'];

export const useOrders = () => {
  return useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: () => orderService.getOrders(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => orderService.createOrder(data),
    onSuccess: (newOrder) => {
      queryClient.setQueryData(ORDERS_QUERY_KEY, (old: Order[] = []) => [
        ...old,
        newOrder,
      ]);
      queryClient.setQueryData([...ORDERS_QUERY_KEY, newOrder.id], newOrder);
    },
  });
};

export const useUpdateOrderStatus = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: Order['status']) =>
      orderService.updateOrderStatus(orderId, status),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData([...ORDERS_QUERY_KEY, orderId], updatedOrder);
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
  });
};
