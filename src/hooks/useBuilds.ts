import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { buildsApi, Build, CreateBuildRequest, UpdateBuildRequest, BuildFilters } from '../lib/buildsApi';
import { useToast } from './use-toast';

export const useBuilds = (userId: string, filters: BuildFilters = {}) => {
  return useQuery({
    queryKey: ['builds', userId, filters],
    queryFn: () => buildsApi.getUserBuilds(userId, filters),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useMyBuilds = (filters: BuildFilters = {}) => {
  return useQuery({
    queryKey: ['my-builds', filters],
    queryFn: () => buildsApi.getMyBuilds(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useBuild = (id: string) => {
  return useQuery({
    queryKey: ['build', id],
    queryFn: () => buildsApi.getBuildById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateBuild = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (buildData: CreateBuildRequest) => buildsApi.createBuild(buildData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-builds'] });
      toast({
        title: 'Success',
        description: 'Build created successfully!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create build',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateBuild = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBuildRequest }) =>
      buildsApi.updateBuild(id, data),
    onSuccess: (updatedBuild) => {
      queryClient.invalidateQueries({ queryKey: ['my-builds'] });
      queryClient.setQueryData(['build', updatedBuild._id], updatedBuild);
      toast({
        title: 'Success',
        description: 'Build updated successfully!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update build',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteBuild = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => buildsApi.deleteBuild(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-builds'] });
      toast({
        title: 'Success',
        description: 'Build deleted successfully!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete build',
        variant: 'destructive',
      });
    },
  });
}; 