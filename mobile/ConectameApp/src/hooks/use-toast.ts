import Toast from 'react-native-toast-message';

// Define a type for the toast options, similar to the original project's ToastProps
interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive'; // Extend with more variants as needed
}

// Custom hook to mimic the original useToast interface
export function useToast() {
  const toast = ({ title, description, variant = 'default' }: ToastOptions) => {
    // Map custom variants to react-native-toast-message types
    const type = variant === 'destructive' ? 'error' : 'success'; // Or 'info', 'warning'

    Toast.show({
      type: type, // 'success', 'error', 'info', 'any_custom_type'
      text1: title,
      text2: description,
      // You can add more customization here if needed, like visibilityTime, topOffset, etc.
    });
  };

  return { toast };
}

// No need for a separate `toast` export like the original, as `Toast.show` is directly available
// but for API consistency, we can export `toast` function directly if needed
export const toast = useToast().toast;
