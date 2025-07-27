import { useQuery } from '@tanstack/react-query';
import { servicesApi, Service, ServiceFilters } from '../lib/servicesApi';

export const useServices = (filters: ServiceFilters = {}) => {
  return useQuery({
    queryKey: ['services', filters],
    queryFn: () => servicesApi.getServices(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useService = (id: string) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => servicesApi.getServiceById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useServicesByCategory = (category: string) => {
  return useQuery({
    queryKey: ['services', 'category', category],
    queryFn: () => servicesApi.getServicesByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => servicesApi.getCategories(),
    staleTime: Infinity, // Categories don't change
  });
}; 