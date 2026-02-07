import { motion } from "framer-motion";
import { ArrowRight, Zap, Target, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { InsightItem } from "@shared/schema";

interface InsightCardProps {
  insight: InsightItem;
  index: number;
}

export function InsightCard({ insight, index }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
    >
      <Card className="h-full border-slate-800 bg-slate-900 p-6 hover:bg-slate-800/50 transition-colors duration-200 group">
        <h4 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          {insight.title}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/50">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current State</div>
            <div className="text-slate-200 font-medium">{insight.current_state}</div>
          </div>
          
          <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/50">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Industry Benchmark</div>
            <div className="text-slate-400 font-medium">{insight.benchmark}</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs text-blue-400 font-semibold uppercase tracking-wide mb-0.5">Recommendation</div>
              <p className="text-sm text-slate-300 leading-relaxed">{insight.recommendation}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wide mb-0.5">Expected Impact</div>
              <p className="text-sm text-slate-300 leading-relaxed">{insight.expected_impact}</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
