/**
 * Centralized logging utility
 * Only logs in development mode to keep production console clean
 */

const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    }
  },

  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },

  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error(...args);
  },

  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args);
    }
  },

  debug: (...args: any[]) => {
    if (isDev) {
      console.debug(...args);
    }
  },
};

export default logger;
