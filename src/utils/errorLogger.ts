interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: string;
  [key: string]: any;
}

export const logError = (error: Error, context?: ErrorContext) => {
  const errorLog = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...context
  };
  
  console.error('[Error Log]', errorLog);
  
  // Store in localStorage for debugging
  try {
    const errors = JSON.parse(localStorage.getItem('error_logs') || '[]');
    errors.push(errorLog);
    localStorage.setItem('error_logs', JSON.stringify(errors.slice(-50))); // Keep last 50
  } catch (e) {
    console.error('Failed to store error log', e);
  }
  
  // Send to external service in production
  if (import.meta.env.PROD) {
    // TODO: Integrate with Sentry or similar
    // Sentry.captureException(error, { extra: context });
  }
};

export const clearErrorLogs = () => {
  localStorage.removeItem('error_logs');
};

export const getErrorLogs = (): any[] => {
  try {
    return JSON.parse(localStorage.getItem('error_logs') || '[]');
  } catch {
    return [];
  }
};
