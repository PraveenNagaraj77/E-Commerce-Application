
import { useToast } from "@/hooks/use-toast";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

const toastConfig = {
  success: {
    icon: CheckCircle2,
    iconClass: "bg-emerald-50 text-emerald-600",
  },
  primary: {
    icon: CheckCircle2,
    iconClass: "bg-emerald-50 text-emerald-600",
  },
  destructive: {
    icon: AlertCircle,
    iconClass: "bg-red-50 text-red-600",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "bg-amber-50 text-amber-600",
  },
  default: {
    icon: Info,
    iconClass: "bg-gray-100 text-gray-600",
  },
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider duration={4000}>
      {toasts.map(({ id, title, description, action, variant, ...props }) => {
        const config = toastConfig[variant] || toastConfig.default;
        const Icon = config.icon;

        return (
          <Toast key={id} variant={variant} {...props}>
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.iconClass}`}
            >
              <Icon size={19} strokeWidth={2.2} />
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              {title && <ToastTitle>{title}</ToastTitle>}

              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>

            {action}

            <ToastClose />
          </Toast>
        );
      })}

      <ToastViewport />
    </ToastProvider>
  );
}
