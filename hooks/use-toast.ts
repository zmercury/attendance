import { useToast as useToastOriginal } from "../components/ui/use-toast"

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}

export const useToast = () => {
  const { toast } = useToastOriginal()

  return {
    toast,
    success: (options: Omit<ToastOptions, "variant">) =>
      toast({
        ...options,
        variant: "success",
      }),
    error: (options: Omit<ToastOptions, "variant">) =>
      toast({
        ...options,
        variant: "destructive",
      }),
    default: (options: Omit<ToastOptions, "variant">) =>
      toast({
        ...options,
        variant: "default",
      }),
  }
}
