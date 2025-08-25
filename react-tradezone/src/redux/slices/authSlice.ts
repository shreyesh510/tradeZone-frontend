import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
}

// Get initial state from localStorage
const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      return JSON.parse(savedAuth);
    }
  }
  return {
    isAuthenticated: false,
    user: null,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth', JSON.stringify(state));
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      // Remove from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth');
      }
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
