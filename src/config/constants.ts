/**
 * Application Constants
 * Centralized configuration values for the application
 */

// API Configuration
export const API = {
  BASE_URL: import.meta.env.VITE_BASE_API_URL || '',
  ENDPOINTS: {
    AGENTS: '/agents',
    AGENT_LOGS: '/agent-logs',
    AGENT_INVOKE: '/agent-invoke',
    TOOLS: '/tools',
    LLMS: '/get-llms',
  },
  TIMEOUT: 60000, // 60 seconds
}

// Authentication Configuration
export const AUTH = {
  STORAGE_KEYS: {
    LAST_USER: 'lastAuthedUser',
  },
  ROUTES: {
    LOGIN: '/auth',
    HOME: '/',
  },
}

// UI Configuration
export const UI = {
  TOAST_DURATION: 5000, // 5 seconds
  ANIMATION_DURATION: 300, // 300ms
  LOADING_DELAY: 1000, // 1 second minimum loading time
}

// Feature Flags
export const FEATURES = {
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_EXPERIMENTAL: import.meta.env.VITE_ENABLE_EXPERIMENTAL === 'true',
}

// Environment Detection
export const ENV = {
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
}

// Default LLM
export const DEFAULT_LLM = import.meta.env.VITE_DEFAULT_LLM || 'deepseek/deepseek-prover-v2:free'
