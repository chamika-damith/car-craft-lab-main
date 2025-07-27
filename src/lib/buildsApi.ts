import { apiRequest, ApiResponse } from './api';
import { Service } from './servicesApi';

// Build types
export interface SelectedService {
  service: string | Service;
  quantity: number;
  customNotes?: string;
}

export interface Build {
  _id: string;
  user: string;
  name: string;
  description?: string;
  carModel: string;
  carYear: number;
  carMake: string;
  selectedServices: SelectedService[];
  totalPrice: number;
  estimatedDuration: number;
  status: 'draft' | 'saved' | 'in-progress' | 'completed' | 'cancelled';
  isPublic: boolean;
  images?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBuildRequest {
  name: string;
  description?: string;
  carModel: string;
  carYear: number;
  carMake: string;
  selectedServices: SelectedService[];
  isPublic?: boolean;
  tags?: string[];
  images?: string[];
}

export interface UpdateBuildRequest {
  name?: string;
  description?: string;
  status?: string;
  isPublic?: boolean;
  tags?: string[];
  images?: string[];
}

export interface BuildFilters {
  page?: number;
  limit?: number;
  status?: string;
  public?: boolean;
}

// Builds API functions
export const buildsApi = {
  // Create a new build
  async createBuild(buildData: CreateBuildRequest): Promise<Build> {
    const response = await apiRequest<ApiResponse<{ build: Build }>>('/builds', {
      method: 'POST',
      body: JSON.stringify(buildData),
    });
    return response.data.build;
  },

  // Get builds by user ID
  async getUserBuilds(userId: string, filters: BuildFilters = {}): Promise<{
    builds: Build[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const endpoint = `/builds/${userId}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiRequest<ApiResponse<{
      builds: Build[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>>(endpoint);
    
    return response.data;
  },

  // Get build by ID
  async getBuildById(id: string): Promise<Build> {
    const response = await apiRequest<ApiResponse<{ build: Build }>>(`/builds/build/${id}`);
    return response.data.build;
  },

  // Update build
  async updateBuild(id: string, updateData: UpdateBuildRequest): Promise<Build> {
    const response = await apiRequest<ApiResponse<{ build: Build }>>(`/builds/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    return response.data.build;
  },

  // Delete build
  async deleteBuild(id: string): Promise<void> {
    await apiRequest(`/builds/${id}`, {
      method: 'DELETE',
    });
  },

  // Get current user's builds
  async getMyBuilds(filters: BuildFilters = {}): Promise<{
    builds: Build[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> {
    // Get current user from localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('User not authenticated');
    }

    try {
      const user = JSON.parse(userStr);
      if (!user._id) {
        throw new Error('User ID not found');
      }

      return this.getUserBuilds(user._id, filters);
    } catch (error) {
      throw new Error('Invalid user data');
    }
  },

  // Format total price for display
  formatTotalPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  },

  // Get status display text
  getStatusDisplay(status: string): string {
    const statusMap: Record<string, string> = {
      draft: 'Draft',
      saved: 'Saved',
      'in-progress': 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return statusMap[status] || status;
  },

  // Get status color for UI
  getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      saved: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  },
}; 