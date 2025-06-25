import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product, User, Category, ContactRequest } from '../types';

interface AppState {
  user: User | null;
  products: Product[];
  categories: Category[];
  favorites: string[];
  contacts: ContactRequest[];
  isLoading: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'ADD_CONTACT'; payload: ContactRequest }
  | { type: 'INCREMENT_VIEWS'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  user: null,
  products: [],
  categories: [
    { id: '1', name: 'Cabelo', slug: 'cabelo', color: '#0D9488' },
    { id: '2', name: 'Pele', slug: 'pele', color: '#059669' },
    { id: '3', name: 'Estética', slug: 'estetica', color: '#0891B2' },
    { id: '4', name: 'Maquiagem', slug: 'maquiagem', color: '#7C3AED' },
    { id: '5', name: 'Perfumaria', slug: 'perfumaria', color: '#DC2626' },
  ],
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
  contacts: [],
  isLoading: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };
    case 'TOGGLE_FAVORITE':
      const newFavorites = state.favorites.includes(action.payload)
        ? state.favorites.filter(id => id !== action.payload)
        : [...state.favorites, action.payload];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return { ...state, favorites: newFavorites };
    case 'ADD_CONTACT':
      return { ...state, contacts: [...state.contacts, action.payload] };
    case 'INCREMENT_VIEWS':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload ? { ...p, views: p.views + 1 } : p
        ),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}