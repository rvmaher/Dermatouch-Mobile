import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "./api";
import { queryClient } from "./query-client";
import {
  CreateOrderRequest,
  LoginRequest,
  OrdersQueryParams,
  ProductsQueryParams,
  RegisterRequest,
} from "./types";

export { queryClient };

export const queryKeys = {
  auth: {
    profile: ["auth", "profile"] as const,
  },
  products: {
    all: ["products"] as const,
    list: (params?: ProductsQueryParams) =>
      ["products", "list", params] as const,
    detail: (id: number) => ["products", "detail", id] as const,
  },
  categories: {
    all: ["categories"] as const,
    detail: (id: number) => ["categories", "detail", id] as const,
  },
  orders: {
    all: ["orders"] as const,
    list: (params?: OrdersQueryParams) => ["orders", "list", params] as const,
    detail: (id: number) => ["orders", "detail", id] as const,
  },
};

export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: () => apiClient.getProfile(),
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => apiClient.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: RegisterRequest) =>
      apiClient.register(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useProducts = (params?: ProductsQueryParams) => {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => apiClient.getProducts(params),
  });
};

export const useInfiniteProducts = (params?: ProductsQueryParams) => {
  return useInfiniteQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: ({ pageParam = 1 }) =>
      apiClient.getProducts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => apiClient.getProduct(id),
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => apiClient.getCategories(),
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => apiClient.getCategory(id),
    enabled: !!id,
  });
};

export const useOrders = (params?: OrdersQueryParams) => {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => apiClient.getOrders(params),
  });
};

export const useOrder = (id: number) => {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => apiClient.getOrder(id),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: CreateOrderRequest) =>
      apiClient.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
};
