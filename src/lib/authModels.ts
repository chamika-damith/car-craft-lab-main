export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// LocalStorage keys
const USER_KEY = 'carcraft_user';
const USERS_KEY = 'carcraft_users';

// User management functions
export const saveUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

export const logoutUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUsers = (): User[] => {
  const usersStr = localStorage.getItem(USERS_KEY);
  return usersStr ? JSON.parse(usersStr) : [];
};

export const registerUser = (userData: Omit<User, 'id' | 'createdAt'>): User => {
  const users = getUsers();
  
  // Check if user already exists
  const existingUser = users.find(user => user.email === userData.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  // Create new user
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  // Add to users list
  users.push(newUser);
  saveUsers(users);
  
  // Set as current user
  saveUser(newUser);
  
  return newUser;
};

export const loginUser = (email: string, password: string): User => {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // In a real app, you'd hash the password and compare hashes
  // For demo purposes, we'll just check if the email exists
  // You can add a simple password check here if needed
  
  // Set as current user
  saveUser(user);
  
  return user;
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
