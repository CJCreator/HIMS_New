import { useToast } from '../context/ToastContext';

const icons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const colors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div key={toast.id} className={`${colors[toast.type]} text-white px-4 py-3 rounded shadow-lg flex items-center gap-3 min-w-[300px] animate-slide-in`}>
          <span className="text-xl">{icons[toast.type]}</span>
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="text-white hover:text-gray-200">✕</button>
        </div>
      ))}
    </div>
  );
}
