import type { ButtonProps } from "@nuxt/ui";
import { captureMessage } from "@sentry/nuxt";

export const useIToast = () => {
  const defaultNotifiers: Record<string, any> = {
    success: {
      icon: "i-fa6-solid-check",
      color: "success",
    },
    info: {
      icon: "i-fa6-solid-circle-info",
      color: "info",
    },
    warning: {
      icon: "i-fa6-solid-triangle-exclamation",
      color: "warning",
    },
    error: {
      icon: "i-fa6-solid-circle-xmark",
      color: "error",
    },
    delete: {
      icon: "i-fa6-solid-trash",
      color: "primary",
    },
  };

  const toast = useToast();

  const onNotifier = (
    id: string,
    title: string | number,
    description?: string,
    actions?: ButtonProps[],
  ) => {
    if (id === "error") {
      captureMessage(`${title}${description ? ` : ${description}` : ""}`, {
        level: "error",
        extra: {
          route: useRoute().fullPath,
          title,
          description,
        },
        tags: {
          type: "notifier",
        },
      });
    }
    return toast.add({
      icon: defaultNotifiers[id].icon,
      color: defaultNotifiers[id].color,
      title: title.toString(),
      description,
      actions,
      ui: {
        icon: "shrink-0 w-10 h-10",
        title: `text-base font-semibold text-${defaultNotifiers[id].color}-500 dark:text-white`,
      },
    });
  };

  const onSuccess = (
    title: string | number,
    description?: string,
    actions?: ButtonProps[],
  ) => onNotifier("success", title, description, actions);
  const onInfo = (
    title: string | number,
    description?: string,
    actions?: ButtonProps[],
  ) => onNotifier("info", title, description, actions);
  const onWarning = (
    title: string | number,
    description?: string,
    actions?: ButtonProps[],
  ) => onNotifier("warning", title, description, actions);
  const onError = (
    title: string | number,
    description?: string,
    actions?: ButtonProps[],
  ) => onNotifier("error", title, description, actions);
  const onDelete = (
    title: string | number,
    description?: string,
    actions?: ButtonProps[],
  ) => onNotifier("delete", title, description, actions);
  const onCustom = (options: NotificationOptions) => toast.add(options);

  return { onSuccess, onInfo, onWarning, onError, onDelete, onCustom };
};
