import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { settingsApi } from '../utils/api';

const AppContext = createContext();

const initialState = {
  settings: {
    darkMode: true,
    notifications: true,
    autoSave: true,
    language: 'en',
    timezone: 'UTC',
    dataRetention: '30',
    maxFileSize: '100',
  },
  user: null,
  loading: false,
  error: null,
  notifications: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
      };
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load settings from API
    const loadSettings = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await settingsApi.get();
        dispatch({ type: 'SET_SETTINGS', payload: response.data });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Failed to load settings',
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await settingsApi.update(newSettings);
      dispatch({ type: 'SET_SETTINGS', payload: newSettings });
      addNotification({
        type: 'success',
        message: 'Settings updated successfully',
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to update settings',
      });
      addNotification({
        type: 'error',
        message: 'Failed to update settings',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setUser = (user) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const addNotification = (notification) => {
    const id = Date.now();
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { ...notification, id },
    });
    // Auto remove notification after 5 seconds
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    }, 5000);
  };

  const removeNotification = (id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  const value = {
    ...state,
    updateSettings,
    setUser,
    addNotification,
    removeNotification,
    clearNotifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext; 