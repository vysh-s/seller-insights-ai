import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// Hook to fetch the list of all sellers
export function useSellers() {
  return useQuery({
    queryKey: [api.sellers.list.path],
    queryFn: async () => {
      const res = await fetch(api.sellers.list.path);
      if (!res.ok) throw new Error("Failed to fetch sellers list");
      return api.sellers.list.responses[200].parse(await res.json());
    },
  });
}

// Hook to fetch a single seller's basic details
export function useSeller(id: string | null) {
  return useQuery({
    queryKey: [api.sellers.get.path, id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("ID required");
      const url = buildUrl(api.sellers.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch seller");
      return api.sellers.get.responses[200].parse(await res.json());
    },
  });
}

// Hook to fetch a seller's metrics
export function useSellerMetrics(id: string | null) {
  return useQuery({
    queryKey: [api.sellers.metrics.path, id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("ID required");
      const url = buildUrl(api.sellers.metrics.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch metrics");
      return api.sellers.metrics.responses[200].parse(await res.json());
    },
  });
}

// Hook to fetch a seller's AI insights
export function useSellerInsights(id: string | null) {
  return useQuery({
    queryKey: [api.sellers.insights.path, id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("ID required");
      const url = buildUrl(api.sellers.insights.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch insights");
      return api.sellers.insights.responses[200].parse(await res.json());
    },
  });
}
