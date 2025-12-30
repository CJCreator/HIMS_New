import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

export const trackWebVitals = () => {
  onCLS(sendToAnalytics);
  onFCP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
};

const sendToAnalytics = (metric: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric.name, metric.value);
  }
  
  // Send to analytics service in production
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics
    // gtag('event', metric.name, {
    //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    //   event_label: metric.id,
    //   non_interaction: true,
    // });
  }
};