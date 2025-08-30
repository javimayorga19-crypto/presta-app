import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Receipt,
  Calendar,
  DollarSign,
  TrendingDown,
  MapPin,
  Filter,
  Download
} from "lucide-react";

interface Gasto {
  id: string;
  concepto: string;
  descripcion: string;
  monto: number;
  fecha: string;
  ruta: string;
  cobrador: string;
  categoria: 'combustible' | 'transporte' | 'alimentacion' | 'mantenimiento' | 'otros';
  comprobante?: string;
}

const gastosMock: Gasto[] = [
  {
    id: "1",
    concepto: "Combustible moto",
    descripcion: "Tanqueada completa para ruta del día",
    monto: 25000,
    fecha: "2024-01-20",
    ruta: "Centro",
    cobrador: "Juan Pérez",
    categoria: "combustible",
    comprobante: "COMP001"
  },
  {
    id: "2",
    concepto: "Almuerzo cobrador",
    descripcion: "Almuerzo durante ruta de cobranza",
    monto: 15000,
    fecha: "2024-01-20",
    ruta: "Norte",
    cobrador: "Ana Martínez",
    categoria: "alimentacion"
  },
  {
    id: "3",
    concepto: "Reparación vehículo",
    descripcion: "Cambio de aceite y filtros",
    monto: 85000,
    fecha: "2024-01-19",
    ruta: "Sur",
    cobrador: "Pedro González",
    categoria: "mantenimiento",
    comprobante: "COMP002"
  }
];

const Gastos = () => {
  const [rutaSeleccionada, setRutaSeleccionada] = useState("todas");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const getCategoriaColor = (categoria: string) => {
    const colors = {
      combustible: 'bg-red-500/10 text-red-600 border-red-500/20',
      transporte: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      alimentacion: 'bg-green-500/10 text-green-600 border-green-500/20',
      mantenimiento: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      otros: 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    };
    
    return colors[categoria as keyof typeof colors] || colors.otros;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const calcularTotalPorRuta = (ruta: string) => {
    return gastosMock
      .filter(g => ruta === "todas" || g.ruta === ruta)
      .reduce((total, gasto) => total + gasto.monto, 0);
  };

  const rutas = ["Centro", "Norte", "Sur"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Gastos</h1>
          <p className="text-muted-foreground">Control de gastos por ruta y cobrador</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Registrar Gasto
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{formatCurrency(calcularTotalPorRuta("todas"))}</p>
                <p className="text-xs text-muted-foreground">Total Gastos Hoy</p>
              </div>
              <TrendingDown className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{formatCurrency(calcularTotalPorRuta("Centro"))}</p>
                <p className="text-xs text-muted-foreground">Ruta Centro</p>
              </div>
              <MapPin className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{formatCurrency(calcularTotalPorRuta("Norte"))}</p>
                <p className="text-xs text-muted-foreground">Ruta Norte</p>
              </div>
              <MapPin className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{formatCurrency(calcularTotalPorRuta("Sur"))}</p>
                <p className="text-xs text-muted-foreground">Ruta Sur</p>
              </div>
              <MapPin className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Fecha Inicio</label>
              <Input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Fecha Fin</label>
              <Input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs por Ruta */}
      <Tabs value={rutaSeleccionada} onValueChange={setRutaSeleccionada}>
        <TabsList className="grid w-auto grid-cols-4">
          <TabsTrigger value="todas">Todas las Rutas</TabsTrigger>
          <TabsTrigger value="centro">Centro</TabsTrigger>
          <TabsTrigger value="norte">Norte</TabsTrigger>
          <TabsTrigger value="sur">Sur</TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Todos los Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gastosMock.map((gasto) => (
                  <GastoCard key={gasto.id} gasto={gasto} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {rutas.map((ruta) => (
          <TabsContent key={ruta.toLowerCase()} value={ruta.toLowerCase()} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Gastos Ruta {ruta}</span>
                  </span>
                  <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                    Total: {formatCurrency(calcularTotalPorRuta(ruta))}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gastosMock
                    .filter(g => g.ruta === ruta)
                    .map((gasto) => (
                      <GastoCard key={gasto.id} gasto={gasto} />
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

const GastoCard = ({ gasto }: { gasto: Gasto }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const getCategoriaColor = (categoria: string) => {
    const colors = {
      combustible: 'bg-red-500/10 text-red-600 border-red-500/20',
      transporte: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      alimentacion: 'bg-green-500/10 text-green-600 border-green-500/20',
      mantenimiento: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      otros: 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    };
    
    return colors[categoria as keyof typeof colors] || colors.otros;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-card to-muted/20 rounded-lg border border-border hover:shadow-card transition-all duration-300">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-destructive/20 to-destructive/30 rounded-full flex items-center justify-center">
          <Receipt className="w-6 h-6 text-destructive" />
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold">{gasto.concepto}</h3>
            <Badge className={getCategoriaColor(gasto.categoria)}>
              {gasto.categoria.charAt(0).toUpperCase() + gasto.categoria.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{gasto.descripcion}</p>
          <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{gasto.fecha}</span>
            </span>
            <span className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{gasto.ruta}</span>
            </span>
            <span>Cobrador: {gasto.cobrador}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-xl font-bold text-destructive">{formatCurrency(gasto.monto)}</p>
          {gasto.comprobante && (
            <p className="text-xs text-muted-foreground">Comp: {gasto.comprobante}</p>
          )}
        </div>
        <Button variant="outline" size="sm">
          Ver Detalles
        </Button>
      </div>
    </div>
  );
};

export default Gastos;