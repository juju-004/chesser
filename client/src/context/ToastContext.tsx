"use client";

import type { ReactNode, ReactElement } from "react";
import React, { createContext, useState, useContext } from "react";

// Define the type for the toast function
type ToastFunction = (
  message: string | ReactElement,
  status?: "success" | "error" | "info",
  time?: number
) => void;

// Define the shape of the context value
type ToastContextValue = {
  toast: ToastFunction;
};

// Create the context with the correct type
export const ToastContext = createContext<ToastContextValue | null>(null);

// Define the props for the provider component
type ToastProviderProps = {
  children: ReactNode;
};

export default function ToastProvider({ children }: ToastProviderProps) {
  const [alert, setAlert] = useState<{
    message: string | ReactElement;
    status: "success" | "error" | "info";
  } | null>(null);

  // Define the toast function with proper typing
  const toast: ToastFunction = (message, status = "success", time = 3000) => {
    setAlert({ message, status });

    setTimeout(() => {
      setAlert(null);
    }, time);
  };

  let className = "alert-success";
  switch (alert?.status) {
    case "info":
      className = "alert-info";
      break;
    case "error":
      className = "alert-error";
      break;
    default:
      className = "alert-success";
      break;
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {alert && (
        <div className="toast toast-top toast-center z-[9999]">
          <div className={`alert alert-soft block ${className}`}>
            <span>{alert.message}</span>
          </div>
        </div>
      )}
      {children}
    </ToastContext.Provider>
  );
}

// Custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
