import { toast } from 'sonner-native';

export const Toast = {
  success: (message: string, description?: string) => {
    toast.success(message, { description });
  },
  
  error: (message: string, description?: string) => {
    toast.error(message, { description });
  },
  
  info: (message: string, description?: string) => {
    toast.info(message, { description });
  },
  
  warning: (message: string, description?: string) => {
    toast.warning(message, { description });
  },
  
  loading: (message: string) => {
    return toast.loading(message);
  },
  
  dismiss: (id?: string | number) => {
    toast.dismiss(id);
  }
};