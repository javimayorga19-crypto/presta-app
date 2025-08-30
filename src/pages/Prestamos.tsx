import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Filter
} from "lucide-react";

interface Prestamo {
  id: string;
  numeroCredito: string;
  cliente: {
    nombre: string;
    codigo: string;
  };
  monto: number;
  saldoPendiente: number;
  cuotas: {
    total: number;
    pagadas: number;
    valor: number;
  };
  frecuencia: 'diario' | 'semanal' | 'quincenal' | 'mensual';
  fechaDesembolso: string;
  fechaVencimiento: string;
  ruta: string;
  estado: 'activo' | 'completado' | 'vencido' | 'restructurado';
  diasVencido: number;
}

const prestamosMock: Prestamo[] = [
  {
    id: "1",
    numeroCredito: "PRE001",
    cliente: { nombre: "María García", codigo: "CLI001" },
    monto: 500000,
    saldoPendiente: 125000,
    cuotas: { total: 30, pagadas: 22, valor: 20000 },
    frecuencia: "diario",
    fechaDesembolso: "2023-12-01",
    fechaVencimiento: "2024-01-30",
    ruta: "Centro",
    estado: "activo",
    diasVencido: 0
  },
  {
    id: "2",
    numeroCredito: "PRE002",
    cliente: { nombre: "Carlos Rodríguez", codigo: "CLI002" },
    monto: 300000,
    saldoPendiente: 85000,
    cuotas: { total: 15, pagadas: 10, valor: 25000 },
    frecuencia: "semanal",
    fechaDesembolso: "2023-11-15",
    fechaVencimiento: "2024-02-15",
    ruta: "Norte",
    estado: "vencido",
    diasVencido: 5
  },
  {
    id: "3",
    numeroCredito: "PRE003",
    cliente: { nombre: "Laura Fernández", codigo: "CLI003" },
    monto: 750000,
    saldoPendiente: 200000,
    cuotas: { total: 20, pagadas: 15, valor: 45000 },
    frecuencia: "quincenal",
    fechaDesembolso: "2023-10-01",
    fechaVencimiento: "2024-03-01",
    ruta: "Sur",
    estado: "activo",
    diasVencido: 0
  }
];

const Prestamos = () => {
  const [rutaSeleccionada, setRutaSeleccionada] = useState("todas");

  const getEstadoBadge = (estado: string, diasVencido: number) => {
    switch (estado) {
      case 'activo':
        return <Badge className="bg-success/10 text-success border-success/20">Activo</Badge>;
      case 'completado':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Completado</Badge>;
      case 'vencido':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">
          Vencido {diasVencido}d
        </Badge>;
      case 'restructurado':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Restructurado</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getFrecuenciaBadge = (frecuencia: string) => {
    const colors = {
      diario: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      semanal: 'bg-green-500/10 text-green-600 border-green-500/20',
      quincenal: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      mensual: 'bg-orange-500/10 text-orange-600 border-orange-500/20'
    };
    
    return (
      <Badge className={colors[frecuencia as keyof typeof colors]}>
        {frecuencia.charAt(0).toUpperCase() + frecuencia.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const calcularProgreso = (pagadas: number, total: number) => {
    return Math.round((pagadas / total) * 100);
  };

  const rutas = ["Centro", "Norte", "Sur"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Préstamos</h1>
          <p className="text-muted-foreground">Administra préstamos organizados por rutas</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Préstamo
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">892</p>
                <p className="text-xs text-muted-foreground">Préstamos Activos</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">$45.2M</p>
                <p className="text-xs text-muted-foreground">Capital Colocado</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-muted-foreground">Préstamos Vencidos</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">$892K</p>
                <p className="text-xs text-muted-foreground">Cobranza Hoy</p>
              </div>
              <Clock className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs por Ruta */}
      <Tabs value={rutaSeleccionada} onValueChange={setRutaSeleccionada}>
        <div className="flex items-center justify-between">
          <TabsList className="grid w-auto grid-cols-4">
            <TabsTrigger value="todas">Todas las Rutas</TabsTrigger>
            <TabsTrigger value="centro">Centro</TabsTrigger>
            <TabsTrigger value="norte">Norte</TabsTrigger>
            <TabsTrigger value="sur">Sur</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>

        <TabsContent value="todas" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Todos los Préstamos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prestamosMock.map((prestamo) => (
                  <PrestamoCard key={prestamo.id} prestamo={prestamo} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {rutas.map((ruta) => (
          <TabsContent key={ruta.toLowerCase()} value={ruta.toLowerCase()} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Ruta {ruta}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prestamosMock
                    .filter(p => p.ruta === ruta)
                    .map((prestamo) => (
                      <PrestamoCard key={prestamo.id} prestamo={prestamo} />
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const PrestamoCard = ({ prestamo }: { prestamo: Prestamo }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const calcularProgreso = (pagadas: number, total: number) => {
    return Math.round((pagadas / total) * 100);
  };

  const getEstadoBadge = (estado: string, diasVencido: number) => {
    switch (estado) {
      case 'activo':
        return <Badge className="bg-success/10 text-success border-success/20">Activo</Badge>;
      case 'completado':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Completado</Badge>;
      case 'vencido':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">
          Vencido {diasVencido}d
        </Badge>;
      case 'restructurado':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Restructurado</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getFrecuenciaBadge = (frecuencia: string) => {
    const colors = {
      diario: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      semanal: 'bg-green-500/10 text-green-600 border-green-500/20',
      quincenal: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      mensual: 'bg-orange-500/10 text-orange-600 border-orange-500/20'
    };
    
    return (
      <Badge className={colors[frecuencia as keyof typeof colors]}>
        {frecuencia.charAt(0).toUpperCase() + frecuencia.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="p-6 bg-gradient-to-r from-card to-muted/20 rounded-lg border border-border hover:shadow-card transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-lg">{prestamo.cliente.nombre}</h3>
              <Badge variant="outline">{prestamo.numeroCredito}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Cliente: {prestamo.cliente.codigo} • Ruta: {prestamo.ruta}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {getEstadoBadge(prestamo.estado, prestamo.diasVencido)}
          {getFrecuenciaBadge(prestamo.frecuencia)}
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-primary/5 rounded-lg">
          <p className="text-sm text-muted-foreground">Monto Original</p>
          <p className="font-bold text-lg">{formatCurrency(prestamo.monto)}</p>
        </div>
        <div className="text-center p-3 bg-warning/5 rounded-lg">
          <p className="text-sm text-muted-foreground">Saldo Pendiente</p>
          <p className="font-bold text-lg">{formatCurrency(prestamo.saldoPendiente)}</p>
        </div>
        <div className="text-center p-3 bg-success/5 rounded-lg">
          <p className="text-sm text-muted-foreground">Valor Cuota</p>
          <p className="font-bold text-lg">{formatCurrency(prestamo.cuotas.valor)}</p>
        </div>
        <div className="text-center p-3 bg-secondary/5 rounded-lg">
          <p className="text-sm text-muted-foreground">Progreso</p>
          <p className="font-bold text-lg">
            {prestamo.cuotas.pagadas}/{prestamo.cuotas.total}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Progreso del préstamo</span>
          <span>{calcularProgreso(prestamo.cuotas.pagadas, prestamo.cuotas.total)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-success to-success-glow h-2 rounded-full transition-all duration-300"
            style={{ width: `${calcularProgreso(prestamo.cuotas.pagadas, prestamo.cuotas.total)}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Desembolso: {prestamo.fechaDesembolso}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Vencimiento: {prestamo.fechaVencimiento}</span>
          </span>
        </div>
        <Button variant="outline" size="sm">
          Ver Detalles
        </Button>
      </div>
    </div>
  );
};

export default Prestamos;