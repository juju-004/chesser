"use client";

import type { ReactNode } from "react";
import { createContext, useState, useContext } from "react";

// Define the type for the toast function
type ToastFunction = (message: string, status?: "success" | "error", time?: number) => void;

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
  const [alert, setAlert] = useState<{ message: string; status: "success" | "error" } | null>(null);

  // Define the toast function with proper typing
  const toast: ToastFunction = (message, status = "success", time = 3000) => {
    setAlert({ message, status });

    setTimeout(() => {
      setAlert(null);
    }, time);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {alert && (
        <div className="toast toast-top toast-center">
          <div
            className={`alert alert-soft block ${
              alert.status === "success" ? "alert-success" : "alert-error"
            }`}
          >
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
