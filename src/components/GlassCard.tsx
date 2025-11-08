import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export const GlassCard = ({ children, className, glow = false }: GlassCardProps) => {
  return (
    <div
      className={cn(
        "glass rounded-xl p-6 transition-all duration-300",
        glow && "glow-hover",
        className
      )}
    >
      {children}
    </div>
  );
};
