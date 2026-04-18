import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color: string;
  delay?: number;
}

const StatCard = ({ icon, label, value, color, delay = 0 }: StatCardProps) => {
  return (
    <div
      className="relative group flex items-center gap-4 p-4 rounded-2xl bg-surface-card border border-border hover:border-border-hover transition-all duration-500 card-hover overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500 ${color}`}
      />

      <div
        className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-15`}
        style={{
          background: `linear-gradient(135deg, ${color === "bg-primary" ? "rgba(249,115,22,0.15)" : color === "bg-info" ? "rgba(59,130,246,0.15)" : color === "bg-success" ? "rgba(34,197,94,0.15)" : "rgba(168,85,247,0.15)"}, transparent)`,
        }}
      >
        <span className={color === "bg-primary" ? "text-primary" : color === "bg-info" ? "text-info" : color === "bg-success" ? "text-success" : "text-purple-400"}>
          {icon}
        </span>
      </div>

      <div className="relative">
        <p className="text-2xl font-bold text-text-main">{value}</p>
        <p className="text-xs text-text-muted mt-0.5">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
