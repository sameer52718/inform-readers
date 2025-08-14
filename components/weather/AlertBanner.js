import { AlertTriangle, Info, CheckCircle } from "lucide-react";

export default function AlertBanner({ type = "info", title, message, className = "" }) {
  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "success":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      default:
        return "bg-red-50 border-red-200 text-red-800";
    }
  };

  return (
    <div className={`border-l-4 p-3 ${getStyles()} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-2">
          {title && <h4 className="text-sm font-medium">{title}</h4>}
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}
