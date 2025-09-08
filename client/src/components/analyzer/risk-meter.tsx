import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

interface RiskMeterProps {
  score: number;
  verdict: "Safe" | "Warning" | "High Risk";
  url: string;
  timestamp: string;
}

export default function RiskMeter({ score, verdict, url, timestamp }: RiskMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = score / 30;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= score) {
          setAnimatedScore(score);
          clearInterval(interval);
        } else {
          setAnimatedScore(Math.round(current));
        }
      }, 50);
      
      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(timer);
  }, [score]);

  const getVerdictColor = () => {
    switch (verdict) {
      case "Safe": return "success";
      case "Warning": return "warning";
      case "High Risk": return "destructive";
      default: return "secondary";
    }
  };

  const getVerdictIcon = () => {
    switch (verdict) {
      case "Safe": return <ShieldCheck className="w-4 h-4" />;
      case "Warning": return <ShieldAlert className="w-4 h-4" />;
      case "High Risk": return <ShieldX className="w-4 h-4" />;
      default: return <ShieldCheck className="w-4 h-4" />;
    }
  };

  // Create data for the pie chart
  const chartData = [
    {
      name: 'Risk',
      value: animatedScore,
      color: verdict === "Safe" ? "#10b981" : verdict === "Warning" ? "#f59e0b" : "#ef4444"
    },
    {
      name: 'Remaining',
      value: 100 - animatedScore,
      color: "rgba(156, 163, 175, 0.2)"
    }
  ];

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return timestamp;
    }
  };

  return (
    <Card className="glass-card" data-testid="risk-meter">
      <CardContent className="p-8 text-center">
        <h3 className="text-lg font-semibold mb-6">Risk Assessment</h3>
        
        {/* Risk Meter Visualization */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Score Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div 
                className="text-3xl font-bold text-primary"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                data-testid="risk-score"
              >
                {animatedScore}
              </motion.div>
              <div className="text-sm text-muted-foreground">Risk Score</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Badge 
              variant={getVerdictColor() as any}
              className="inline-flex items-center px-4 py-2 text-sm font-medium"
              data-testid="verdict-badge"
            >
              {getVerdictIcon()}
              <span className="ml-2">{verdict}</span>
            </Badge>
          </motion.div>
          
          <motion.p 
            className="text-sm text-muted-foreground break-all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            data-testid="analysis-url"
          >
            {url}
          </motion.p>
          
          <motion.p 
            className="text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            data-testid="analysis-time"
          >
            Analyzed at {formatTimestamp(timestamp)}
          </motion.p>
        </div>
      </CardContent>
    </Card>
  );
}
