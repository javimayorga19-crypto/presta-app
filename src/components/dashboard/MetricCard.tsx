import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

export const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend,
  variant = 'default' 
}: MetricCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-gradient-to-br from-success/5 to-success/10 border-success/20';
      case 'warning':
        return 'bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20';
      case 'destructive':
        return 'bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20';
      default:
        return 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'destructive': return 'text-destructive';
      default: return 'text-primary';
    }
  };

  return (
    <Card className={cn("transition-all duration-300 hover:shadow-card", getVariantStyles())}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className={cn("p-2 rounded-lg", getIconColor())}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span className={cn(
              "font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};