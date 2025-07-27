import { apiRequest, ApiResponse, PaginatedResponse } from './api';

// Service types
export interface Service {
  _id: string;
  name: string;
  description: string;
  category: 'exterior' | 'interior' | 'performance' | 'audio' | 'lighting' | 'wheels' | 'other';
  price: number;
  duration: number;
  image?: string;
  isAvailable: boolean;
  features: string[];
  requirements: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Services API functions
export const servicesApi = {
  // Get all services with optional filters
  async getServices(filters: ServiceFilters = {}): Promise<PaginatedResponse<Service>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const endpoint = `/services${params.toString() ? `?${params.toString()}` : ''}`;
    return await apiRequest<PaginatedResponse<Service>>(endpoint);
  },

  // Get service by ID
  async getServiceById(id: string): Promise<Service> {
    const response = await apiRequest<ApiResponse<{ service: Service }>>(`/services/${id}`);
    return response.data.service;
  },

  // Get services by category
  async getServicesByCategory(category: string): Promise<{ services: Service[]; category: string }> {
    const response = await apiRequest<ApiResponse<{ services: Service[]; category: string }>>(
      `/services/category/${category}`
    );
    return response.data;
  },

  // Get all available categories
  getCategories(): string[] {
    return ['exterior', 'interior', 'performance', 'audio', 'lighting', 'wheels', 'other'];
  },

  // Format price for display
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  },

  // Format duration for display
  formatDuration(duration: number): string {
    if (duration < 1) {
      return `${Math.round(duration * 60)} minutes`;
    } else if (duration === 1) {
      return '1 hour';
    } else if (duration < 24) {
      return `${duration} hours`;
    } else {
      const days = Math.floor(duration / 24);
      const hours = duration % 24;
      if (hours === 0) {
        return `${days} day${days > 1 ? 's' : ''}`;
      } else {
        return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`;
      }
    }
  },
}; 