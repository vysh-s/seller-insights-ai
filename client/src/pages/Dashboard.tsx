import { useState, useEffect } from "react";
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useSellers, useSellerMetrics, useSellerInsights } from "@/hooks/use-sellers";
import { MetricCard } from "@/components/MetricCard";
import { InsightCard } from "@/components/InsightCard";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Helper to format currency
const formatCurrency = (val: number) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

// Helper to format percentage
const formatPercent = (val: number) => 
  new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1 }).format(val / 100);

export default function Dashboard() {
  const { data: sellers, isLoading: isLoadingSellers } = useSellers();
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);

  // Auto-select first seller on load
  useEffect(() => {
    if (sellers && sellers.length > 0 && !selectedSellerId) {
      setSelectedSellerId(sellers[0].seller_id);
    }
  }, [sellers, selectedSellerId]);

  const { data: metrics, isLoading: isLoadingMetrics } = useSellerMetrics(selectedSellerId);
  const { data: insights, isLoading: isLoadingInsights } = useSellerInsights(selectedSellerId);

  const isLoading = isLoadingSellers || (selectedSellerId && (isLoadingMetrics || isLoadingInsights));

  // Determine health color
  const getHealthColor = (status: "excellent" | "good" | "concerning" = "good") => {
    switch (status) {
      case "excellent": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "good": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "concerning": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      default: return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  if (isLoadingSellers) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-400 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800/50 pb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-display bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Seller Insights AI
            </h1>
            <p className="mt-2 text-slate-400 text-lg">
              Real-time performance analytics & actionable intelligence
            </p>
          </div>

          <div className="w-full md:w-72">
            <Select 
              value={selectedSellerId || ""} 
              onValueChange={setSelectedSellerId}
              disabled={isLoadingSellers}
            >
              <SelectTrigger className="h-12 bg-slate-900 border-slate-700 hover:border-slate-600 focus:ring-primary/20 transition-all text-base">
                <SelectValue placeholder="Select a seller..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                {sellers?.map((seller) => (
                  <SelectItem 
                    key={seller.seller_id} 
                    value={seller.seller_id}
                    className="focus:bg-slate-800 focus:text-white"
                  >
                    {seller.business_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSellerId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Metrics Grid */}
              {metrics && (
                <section>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard 
                      label="Total Revenue" 
                      value={formatCurrency(metrics.total_revenue)} 
                      icon={DollarSign}
                      iconColor="text-emerald-400"
                      delay={0}
                    />
                    <MetricCard 
                      label="Completion Rate" 
                      value={formatPercent(metrics.completion_rate)} 
                      icon={CheckCircle2}
                      iconColor="text-blue-400"
                      delay={0.1}
                    />
                    <MetricCard 
                      label="Repeat Customer Rate" 
                      value={formatPercent(metrics.repeat_customer_rate)} 
                      icon={Users}
                      iconColor="text-indigo-400"
                      delay={0.2}
                    />
                    <MetricCard 
                      label="Cancellation Rate" 
                      value={formatPercent(metrics.cancellation_rate)} 
                      icon={AlertTriangle}
                      iconColor="text-amber-400"
                      delay={0.3}
                    />
                  </div>
                </section>
              )}

              {/* Insights Section */}
              {insights && (
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                  
                  {/* Left Column: Key Finding & Priority Action */}
                  <div className="lg:col-span-4 space-y-6">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Card className="bg-gradient-to-br from-slate-900 to-slate-900/50 border-slate-800 p-6 overflow-hidden relative">
                        {/* Decorative background glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-primary" />
                              AI Analysis
                            </h3>
                            <Badge variant="outline" className={cn("uppercase tracking-wider font-semibold py-1 px-3", getHealthColor(insights.overall_health))}>
                              {insights.overall_health} Health
                            </Badge>
                          </div>

                          <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                              {insights.key_finding}
                            </h2>
                          </div>

                          <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors duration-500" />
                            <div className="relative z-10">
                              <div className="flex items-center gap-2 text-emerald-400 font-semibold uppercase tracking-wider text-xs mb-2">
                                <TrendingUp className="w-4 h-4" />
                                Priority Action
                              </div>
                              <p className="text-slate-200 font-medium text-lg leading-relaxed">
                                {insights.priority_action}
                              </p>
                              <div className="mt-4 flex items-center text-emerald-400/80 text-sm font-medium group-hover:text-emerald-400 transition-colors cursor-pointer">
                                Apply Recommendation <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </div>

                  {/* Right Column: Detailed Insights List */}
                  <div className="lg:col-span-8">
                    <div className="space-y-4">
                      {insights.insights.map((item, idx) => (
                        <InsightCard key={idx} insight={item} index={idx} />
                      ))}
                    </div>
                  </div>

                </section>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
