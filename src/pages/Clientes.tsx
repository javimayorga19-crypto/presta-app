import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DraggableClientList } from "@/components/clients/DraggableClientList";
import { 
  Plus, 
  Search, 
  Filter,
  MapPin,
  User,
  Phone,
  CreditCard,
  MoreVertical,
  ArrowUpDown
} from "lucide-react";

interface Cliente {
  id: string;
  codigo: string;
  nombre: string;
  cedula: string;
  direccion: string;
  telefono: string;
  ruta: string;
  cobrador: string;
  estado: 'activo' | 'inactivo' | 'moroso';
  clasificacion: 'A' | 'B' | 'C';
  saldoPendiente: number;
  ultimoPago: string;
}

const clientesMock: Cliente[] = [
  {
    id: "1",
    codigo: "CLI001",
    nombre: "María García López",
    cedula: "12345678",
    direccion: "Calle 45 #23-67, Centro",
    telefono: "300-123-4567",
    ruta: "Centro",
    cobrador: "Juan Pérez",
    estado: "activo",
    clasificacion: "A",
    saldoPendiente: 125000,
    ultimoPago: "2024-01-15"
  },
  {
    id: "2",
    codigo: "CLI002", 
    nombre: "Carlos Rodríguez",
    cedula: "87654321",
    direccion: "Carrera 12 #34-56, Norte",
    telefono: "301-987-6543",
    ruta: "Norte",
    cobrador: "Ana Martínez",
    estado: "moroso",
    clasificacion: "B",
    saldoPendiente: 85000,
    ultimoPago: "2024-01-10"
  },
  {
    id: "3",
    codigo: "CLI003",
    nombre: "Laura Fernández",
    cedula: "11223344",
    direccion: "Avenida 80 #12-34, Sur",
    telefono: "302-456-7890",
    ruta: "Sur",
    cobrador: "Pedro González",
    estado: "activo",
    clasificacion: "A",
    saldoPendiente: 200000,
    ultimoPago: "2024-01-18"
  }
];

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroRuta, setFiltroRuta] = useState("todos");

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <Badge className="bg-success/10 text-success border-success/20">Activo</Badge>;
      case 'inactivo':
        return <Badge variant="secondary">Inactivo</Badge>;
      case 'moroso':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Moroso</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getClasificacionColor = (clasificacion: string) => {
    switch (clasificacion) {
      case 'A': return 'text-success font-bold';
      case 'B': return 'text-warning font-bold';
      case 'C': return 'text-destructive font-bold';
      default: return 'text-muted-foreground';
    }
  };

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
          <h1 className="text-3xl font-bold text-foreground">Gestión de Clientes</h1>
          <p className="text-muted-foreground">Administra y organiza tu cartera de clientes</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="lista" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="lista" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Lista de Clientes
          </TabsTrigger>
          <TabsTrigger value="orden-rutas" className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" />
            Orden por Rutas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-6 mt-6">

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, código o cédula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <select className="px-3 py-2 border border-input bg-background rounded-md text-sm">
                <option value="todos">Todas las rutas</option>
                <option value="centro">Centro</option>
                <option value="norte">Norte</option>
                <option value="sur">Sur</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">1,248</p>
                <p className="text-xs text-muted-foreground">Total Clientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-success" />
              <div>
                <p className="text-2xl font-bold">1,156</p>
                <p className="text-xs text-muted-foreground">Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-warning" />
              <div>
                <p className="text-2xl font-bold">67</p>
                <p className="text-xs text-muted-foreground">Morosos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-2xl font-bold">25</p>
                <p className="text-xs text-muted-foreground">Inactivos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clientesMock.map((cliente) => (
              <div key={cliente.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-card to-muted/20 rounded-lg border border-border hover:shadow-card transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{cliente.nombre}</h3>
                      <span className={`text-sm ${getClasificacionColor(cliente.clasificacion)}`}>
                        [{cliente.clasificacion}]
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {cliente.codigo} • {cliente.cedula} • {cliente.telefono}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{cliente.direccion}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(cliente.saldoPendiente)}</p>
                    <p className="text-xs text-muted-foreground">Saldo pendiente</p>
                  </div>

                  <div className="text-center">
                    <Badge variant="outline" className="mb-1">{cliente.ruta}</Badge>
                    <p className="text-xs text-muted-foreground">{cliente.cobrador}</p>
                  </div>

                  <div className="flex flex-col items-center space-y-1">
                    {getEstadoBadge(cliente.estado)}
                    <p className="text-xs text-muted-foreground">Últ: {cliente.ultimoPago}</p>
                  </div>

                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="orden-rutas" className="space-y-6 mt-6">
          <DraggableClientList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Clientes;