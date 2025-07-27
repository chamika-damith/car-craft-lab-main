import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService, LoginRequest, RegisterRequest, User } from '../lib/authService';
import { useToast } from './use-toast';
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  // Update authentication state when it changes
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };

    // Check auth state on mount and when storage changes
    checkAuth();
    window.addEventListener('storage', checkAuth);
    
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Get current user
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('No user found');
      }
      return currentUser;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthenticated, // Only run query if authenticated
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      setIsAuthenticated(true);
      toast({
        title: 'Success',
        description: 'Login successful!',
      });
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Login failed',
        variant: 'destructive',
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => authService.register(userData),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      setIsAuthenticated(true);
      toast({
        title: 'Success',
        description: 'Registration successful!',
      });
      navigate('/dashboard');
    },
    onError: (error: any) => {
      // Handle validation errors
      if (error.message && error.message.includes('Validation failed')) {
        // Show the first validation error
        const firstError = error.errors?.[0];
        if (firstError) {
          toast({
            title: 'Validation Error',
            description: `${firstError.field}: ${firstError.message}`,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: error.message || 'Registration failed',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Registration failed',
          variant: 'destructive',
        });
      }
    },
  });

  // Logout function
  const logout = () => {
    authService.logout();
    queryClient.clear();
    setIsAuthenticated(false);
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    navigate('/');
  };

  return {
    user,
    isLoadingUser,
    isAuthenticated,
    login: loginMutation.mutate,
    loginLoading: loginMutation.isPending,
    register: registerMutation.mutate,
    registerLoading: registerMutation.isPending,
    logout,
  };
}; 