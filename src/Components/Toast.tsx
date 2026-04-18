import { useEffect } from "react";
import { IoCheckmarkCircle, IoClose } from "react-icons/io5";
import { FiTrash2, FiEdit3 } from "react-icons/fi";

export type ToastType = "success" | "delete" | "update";

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

const Toast = ({ message, type, isVisible, onClose }: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const config = {
    success: {
      icon: <IoCheckmarkCircle className="text-lg" />,
      bg: "bg-emerald-500/15",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      bar: "bg-emerald-500",
    },
    delete: {
      icon: <FiTrash2 className="text-lg" />,
      bg: "bg-red-500/15",
      border: "border-red-500/30",
      text: "text-red-400",
      bar: "bg-red-500",
    },
    update: {
      icon: <FiEdit3 className="text-lg" />,
      bg: "bg-blue-500/15",
      border: "border-blue-500/30",
      text: "text-blue-400",
      bar: "bg-blue-500",
    },
  }[type];

  return (
    <div className="fixed top-20 right-4 z-[200] toast-enter">
      <div
        className={`relative overflow-hidden flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-2xl shadow-black/30 ${config.bg} ${config.border} glass`}
      >
        <div className={config.text}>{config.icon}</div>
        <p className="text-sm font-medium text-text-main">{message}</p>
        <button
          onClick={onClose}
          className="ml-3 text-text-muted hover:text-text-main transition-colors cursor-pointer"
        >
          <IoClose className="text-base" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 h-[2px]">
          <div
            className={`h-full ${config.bar} rounded-full`}
            style={{ animation: "shrink 3s linear forwards" }}
          />
        </div>
        <style>{`
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Toast;
