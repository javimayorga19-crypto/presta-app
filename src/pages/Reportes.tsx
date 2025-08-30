import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  MapPin,
  PieChart,
  FileText
} from "lucide-react";

const Reportes = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reportes y Análisis</h1>
          <p className="text-muted-foreground">Analiza el rendimiento y genera reportes detallados</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Filtrar Fechas
          </Button>
          <Button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
            <Download className="w-4 h-4 mr-2" />
            Exportar Todo
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Fecha Inicio</label>
              <Input type="date" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Fecha Fin</label>
              <Input type="date" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Ruta</label>
              <select className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm">
                <option value="todas">Todas las rutas</option>
                <option value="centro">Centro</option>
                <option value="norte">Norte</option>
                <option value="sur">Sur</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button>Generar Reporte</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="financiero" className="space-y-4">
        <TabsList>
          <TabsTrigger value="financiero">Financiero</TabsTrigger>
          <TabsTrigger value="cobranza">Cobranza</TabsTrigger>
          <TabsTrigger value="rutas">Por Rutas</TabsTrigger>
          <TabsTrigger value="mora">Cartera en Mora</TabsTrigger>
        </TabsList>

        {/* Reporte Financiero */}
        <TabsContent value="financiero">
          <div className="space-y-6">
            {/* KPIs Financieros */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Ingresos del Mes</p>
                      <p className="text-2xl font-bold text-success">{formatCurrency(15420000)}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-success" />
                        <span className="text-xs text-success">+12.5%</span>
                      </div>
                    </div>
                    <DollarSign className="w-8 h-8 text-success" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Capital Colocado</p>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(45230000)}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-primary" />
                        <span className="text-xs text-primary">+8.3%</span>
                      </div>
                    </div>
                    <BarChart3 className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Gastos del Mes</p>
                      <p className="text-2xl font-bold text-warning">{formatCurrency(2340000)}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <TrendingDown className="w-3 h-3 text-destructive" />
                        <span className="text-xs text-destructive">+5.2%</span>
                      </div>
                    </div>
                    <TrendingDown className="w-8 h-8 text-warning" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Utilidad Neta</p>
                      <p className="text-2xl font-bold text-secondary">{formatCurrency(13080000)}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-success" />
                        <span className="text-xs text-success">+15.1%</span>
                      </div>
                    </div>
                    <PieChart className="w-8 h-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos Financieros */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Evolución Mensual de Ingresos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">Gráfico de barras - Ingresos por mes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Gastos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-warning/5 to-warning/10 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="w-16 h-16 text-warning mx-auto mb-4" />
                      <p className="text-muted-foreground">Gráfico circular - Categorías de gastos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Reporte de Cobranza */}
        <TabsContent value="cobranza">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-success">Eficiencia de Cobranza</h3>
                    <p className="text-3xl font-bold text-success mt-2">94.2%</p>
                    <p className="text-sm text-muted-foreground mt-1">Meta: 95%</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-primary">Recaudo Diario Promedio</h3>
                    <p className="text-3xl font-bold text-primary mt-2">{formatCurrency(892450)}</p>
                    <p className="text-sm text-muted-foreground mt-1">Últimos 30 días</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-warning">Clientes Atendidos</h3>
                    <p className="text-3xl font-bold text-warning mt-2">156</p>
                    <p className="text-sm text-muted-foreground mt-1">Promedio diario</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabla de Rendimiento por Cobrador */}
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento por Cobrador</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { nombre: "Juan Pérez", ruta: "Centro", cobranza: 98.5, recaudo: 245000, clientes: 45 },
                    { nombre: "Ana Martínez", ruta: "Norte", cobranza: 94.2, recaudo: 198500, clientes: 38 },
                    { nombre: "Pedro González", ruta: "Sur", cobranza: 89.1, recaudo: 156200, clientes: 52 }
                  ].map((cobrador, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-card to-muted/20 rounded-lg border border-border">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{cobrador.nombre}</h3>
                          <p className="text-sm text-muted-foreground">Ruta {cobrador.ruta}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-8 text-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Eficiencia</p>
                          <p className={`font-bold ${cobrador.cobranza >= 95 ? 'text-success' : cobrador.cobranza >= 90 ? 'text-warning' : 'text-destructive'}`}>
                            {cobrador.cobranza}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Recaudo</p>
                          <p className="font-bold">{formatCurrency(cobrador.recaudo)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Clientes</p>
                          <p className="font-bold">{cobrador.clientes}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reporte por Rutas */}
        <TabsContent value="rutas">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { ruta: "Centro", clientes: 45, prestamos: 38, recaudo: 245000, eficiencia: 98.5 },
                { ruta: "Norte", clientes: 38, prestamos: 32, recaudo: 198500, eficiencia: 94.2 },
                { ruta: "Sur", clientes: 52, prestamos: 41, recaudo: 156200, eficiencia: 89.1 }
              ].map((ruta, index) => (
                <Card key={index} className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5" />
                      <span>Ruta {ruta.ruta}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Clientes</p>
                        <p className="text-xl font-bold">{ruta.clientes}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Préstamos</p>
                        <p className="text-xl font-bold">{ruta.prestamos}</p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Recaudo del Mes</p>
                      <p className="text-2xl font-bold text-success">{formatCurrency(ruta.recaudo)}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Eficiencia</p>
                      <p className={`text-xl font-bold ${ruta.eficiencia >= 95 ? 'text-success' : ruta.eficiencia >= 90 ? 'text-warning' : 'text-destructive'}`}>
                        {ruta.eficiencia}%
                      </p>
                    </div>

                    <Button variant="outline" className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Reporte Detallado
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Reporte de Mora */}
        <TabsContent value="mora">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-sm text-muted-foreground">Cartera Vencida</h3>
                    <p className="text-2xl font-bold text-destructive">{formatCurrency(2350000)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-sm text-muted-foreground">Clientes en Mora</h3>
                    <p className="text-2xl font-bold text-warning">23</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-sm text-muted-foreground">Días Prom. Mora</h3>
                    <p className="text-2xl font-bold text-primary">8.5</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-sm text-muted-foreground">% de Mora</h3>
                    <p className="text-2xl font-bold text-secondary">5.2%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Clientes con Pagos Vencidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { cliente: "Carlos Rodríguez", codigo: "CLI002", dias: 5, monto: 85000, ruta: "Norte" },
                    { cliente: "María Jiménez", codigo: "CLI045", dias: 12, monto: 65000, ruta: "Sur" },
                    { cliente: "Luis Torres", codigo: "CLI078", dias: 8, monto: 125000, ruta: "Centro" }
                  ].map((cliente, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-destructive/5 to-destructive/10 rounded-lg border border-destructive/20">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-destructive" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{cliente.cliente}</h3>
                          <p className="text-sm text-muted-foreground">{cliente.codigo} • Ruta {cliente.ruta}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8 text-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Días Vencido</p>
                          <p className="font-bold text-destructive">{cliente.dias} días</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Monto Vencido</p>
                          <p className="font-bold text-destructive">{formatCurrency(cliente.monto)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reportes;