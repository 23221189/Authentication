import React, { createContext, useContext, useState, useCallback } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ title, message, type = "success", duration = 5000 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="text-[#34a853] text-xl mt-0.5 shrink-0" />;
      case "error":
        return <FaExclamationCircle className="text-red-500 text-xl mt-0.5 shrink-0" />;
      case "info":
        return <FaInfoCircle className="text-blue-500 text-xl mt-0.5 shrink-0" />;
      default:
        return <FaCheckCircle className="text-[#34a853] text-xl mt-0.5 shrink-0" />;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case "success":
        return { bg: "bg-[#e6f4ea]", border: "border-[#a8dab5]", title: "text-[#1e8e3e]", msg: "text-[#3c4043]" };
      case "error":
        return { bg: "bg-red-50", border: "border-red-200", title: "text-red-700", msg: "text-red-600" };
      case "info":
        return { bg: "bg-blue-50", border: "border-blue-200", title: "text-blue-700", msg: "text-blue-600" };
      default:
        return { bg: "bg-[#e6f4ea]", border: "border-[#a8dab5]", title: "text-[#1e8e3e]", msg: "text-[#3c4043]" };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => {
          const colors = getColors(toast.type);
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto ${colors.bg} border ${colors.border} rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-4 pr-10 flex items-start gap-3 max-w-sm relative animate-slideInRight`}
            >
              {getIcon(toast.type)}
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-bold ${colors.title}`}>{toast.title}</h4>
                <p className={`text-xs ${colors.msg} mt-0.5 leading-relaxed font-medium break-words`}>
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className={`absolute top-3 right-3 ${colors.msg} hover:opacity-70 transition-opacity cursor-pointer`}
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};