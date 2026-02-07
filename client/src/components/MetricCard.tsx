import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral"; // Optional: for future use
  delay?: number;
  className?: string;
  iconColor?: string;
}

export function MetricCard({ 
  label, 
  value, 
  icon: Icon, 
  delay = 0,
  className,
  iconColor = "text-primary"
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className={cn(
        "relative overflow-hidden border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 hover:border-slate-700 transition-colors group",
        className
      )}>
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Icon className="w-24 h-24 text-slate-500 transform rotate-12 translate-x-4 -translate-y-4" />
        </div>
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className={cn("p-2 rounded-lg bg-slate-950 border border-slate-800", iconColor)}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-400 font-sans tracking-wide uppercase">
              {label}
            </span>
          </div>
          
          <div className="mt-2">
            <h3 className="text-3xl font-bold text-white font-display tracking-tight">
              {value}
            </h3>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
