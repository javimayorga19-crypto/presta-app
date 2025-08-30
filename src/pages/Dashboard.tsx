import { MetricCard } from "@/components/dashboard/MetricCard";
import { TurnoModal } from "@/components/dashboard/TurnoModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  TrendingUp,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Resumen general del sistema de préstamos</p>
        </div>
        <div className="flex space-x-3">
          <TurnoModal 
            trigger={
              <Button variant="outline" size="sm">
                <Clock className="w-4 h-4 mr-2" />
                Abrir Turno
              </Button>
            }
          />
          <Button size="sm" className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Préstamo
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Clientes"
          value="1,248"
          subtitle="Activos"
          icon={<Users className="w-4 h-4" />}
          trend={{ value: 12, isPositive: true }}
          variant="default"
        />
        <MetricCard
          title="Préstamos Activos"
          value="892"
          subtitle="En curso"
          icon={<CreditCard className="w-4 h-4" />}
          trend={{ value: 8, isPositive: true }}
          variant="success"
        />
        <MetricCard
          title="Capital Colocado"
          value="$45,230,000"
          subtitle="Total activo"
          icon={<DollarSign className="w-4 h-4" />}
          trend={{ value: 15, isPositive: true }}
          variant="success"
        />
        <MetricCard
          title="Cobranza Hoy"
          value="$892,450"
          subtitle="Meta: $900,000"
          icon={<TrendingUp className="w-4 h-4" />}
          trend={{ value: -2, isPositive: false }}
          variant="warning"
        />
      </div>

      {/* Second Row Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Préstamos Vencidos"
          value="23"
          subtitle="Requieren atención"
          icon={<AlertTriangle className="w-4 h-4" />}
          variant="destructive"
        />
        <MetricCard
          title="Cobros Completados"
          value="156"
          subtitle="Hoy"
          icon={<CheckCircle className="w-4 h-4" />}
          variant="success"
        />
        <MetricCard
          title="Gastos del Día"
          value="$12,450"
          subtitle="Todas las rutas"
          icon={<DollarSign className="w-4 h-4" />}
          variant="warning"
        />
      </div>

      {/* Activity Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-success/5 rounded-lg border border-success/20">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Pago recibido</p>
                <p className="text-xs text-muted-foreground">María García - $25,000</p>
              </div>
              <span className="text-xs text-muted-foreground">10:30 AM</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nuevo préstamo</p>
                <p className="text-xs text-muted-foreground">Carlos Rodríguez - $150,000</p>
              </div>
              <span className="text-xs text-muted-foreground">09:45 AM</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-warning/5 rounded-lg border border-warning/20">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Pago vencido</p>
                <p className="text-xs text-muted-foreground">Ana López - 3 días</p>
              </div>
              <span className="text-xs text-muted-foreground">08:20 AM</span>
            </div>
          </CardContent>
        </Card>

        {/* Top Rutas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rutas con Mayor Cobranza</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
              <div>
                <p className="font-medium">Ruta Centro</p>
                <p className="text-sm text-muted-foreground">45 clientes</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-success">$245,000</p>
                <p className="text-xs text-muted-foreground">98% cobranza</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-secondary/5 to-secondary/10 rounded-lg">
              <div>
                <p className="font-medium">Ruta Norte</p>
                <p className="text-sm text-muted-foreground">38 clientes</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-success">$198,500</p>
                <p className="text-xs text-muted-foreground">94% cobranza</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-accent/5 to-accent/10 rounded-lg">
              <div>
                <p className="font-medium">Ruta Sur</p>
                <p className="text-sm text-muted-foreground">52 clientes</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-warning">$156,200</p>
                <p className="text-xs text-muted-foreground">85% cobranza</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;