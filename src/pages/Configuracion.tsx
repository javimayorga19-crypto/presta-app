import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings,
  Users,
  Shield,
  DollarSign,
  Clock,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Plus,
  Upload
} from "lucide-react";
import { InitialDataImporter } from "@/components/config/InitialDataImporter";

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'administrador' | 'supervisor' | 'cobrador';
  estado: 'activo' | 'inactivo';
  rutas: string[];
  fechaCreacion: string;
}

interface ConfiguracionPrestamo {
  tipoFrecuencia: 'diario' | 'semanal' | 'quincenal' | 'mensual';
  montoMinimo: number;
  montoMaximo: number;
  tasaInteres: number;
  plazosDisponibles: number[];
}

const usuariosMock: Usuario[] = [
  {
    id: "1",
    nombre: "Juan Pérez",
    email: "juan.perez@empresa.com",
    rol: "cobrador",
    estado: "activo",
    rutas: ["Centro"],
    fechaCreacion: "2023-12-01"
  },
  {
    id: "2",
    nombre: "Ana Martínez",
    email: "ana.martinez@empresa.com",
    rol: "cobrador",
    estado: "activo",
    rutas: ["Norte"],
    fechaCreacion: "2023-11-15"
  },
  {
    id: "3",
    nombre: "Pedro González",
    email: "pedro.gonzalez@empresa.com",
    rol: "supervisor",
    estado: "activo",
    rutas: ["Centro", "Norte", "Sur"],
    fechaCreacion: "2023-10-01"
  }
];

const configuracionPrestamosMock: ConfiguracionPrestamo[] = [
  {
    tipoFrecuencia: "diario",
    montoMinimo: 50000,
    montoMaximo: 1000000,
    tasaInteres: 20,
    plazosDisponibles: [15, 30, 45, 60]
  },
  {
    tipoFrecuencia: "semanal", 
    montoMinimo: 100000,
    montoMaximo: 2000000,
    tasaInteres: 18,
    plazosDisponibles: [4, 8, 12, 16]
  },
  {
    tipoFrecuencia: "quincenal",
    montoMinimo: 200000,
    montoMaximo: 3000000,
    tasaInteres: 15,
    plazosDisponibles: [2, 4, 6, 8]
  },
  {
    tipoFrecuencia: "mensual",
    montoMinimo: 500000,
    montoMaximo: 5000000,
    tasaInteres: 12,
    plazosDisponibles: [3, 6, 9, 12]
  }
];

const Configuracion = () => {
  const getRolColor = (rol: string) => {
    switch (rol) {
      case 'administrador': return 'bg-accent/10 text-accent border-accent/20';
      case 'supervisor': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'cobrador': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getEstadoBadge = (estado: string) => {
    return estado === 'activo' 
      ? <Badge className="bg-success/10 text-success border-success/20">Activo</Badge>
      : <Badge className="bg-destructive/10 text-destructive border-destructive/20">Inactivo</Badge>;
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
          <h1 className="text-3xl font-bold text-foreground">Configuración del Sistema</h1>
          <p className="text-muted-foreground">Gestiona usuarios, roles y parámetros del sistema</p>
        </div>
      </div>

      <Tabs defaultValue="usuarios" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usuarios" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Usuarios</span>
          </TabsTrigger>
          <TabsTrigger value="prestamos" className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Préstamos</span>
          </TabsTrigger>
          <TabsTrigger value="rutas" className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Rutas</span>
          </TabsTrigger>
          <TabsTrigger value="datos" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Datos Iniciales</span>
          </TabsTrigger>
          <TabsTrigger value="sistema" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Sistema</span>
          </TabsTrigger>
        </TabsList>

        {/* Usuarios Tab */}
        <TabsContent value="usuarios">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>
              <Button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Usuario
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Lista de Usuarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usuariosMock.map((usuario) => (
                    <div key={usuario.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-card to-muted/20 rounded-lg border border-border">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{usuario.nombre}</h3>
                            <Badge className={getRolColor(usuario.rol)}>
                              {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}
                            </Badge>
                            {getEstadoBadge(usuario.estado)}
                          </div>
                          <p className="text-sm text-muted-foreground">{usuario.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Rutas: {usuario.rutas.join(", ")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Préstamos Tab */}
        <TabsContent value="prestamos">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Configuración de Préstamos</h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              {configuracionPrestamosMock.map((config, index) => (
                <Card key={index} className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="capitalize">Préstamos {config.tipoFrecuencia}s</span>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Monto Mínimo</p>
                        <p className="font-semibold">{formatCurrency(config.montoMinimo)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Monto Máximo</p>
                        <p className="font-semibold">{formatCurrency(config.montoMaximo)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Tasa de Interés</p>
                      <p className="font-semibold text-lg text-primary">{config.tasaInteres}%</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Plazos Disponibles</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {config.plazosDisponibles.map((plazo) => (
                          <Badge key={plazo} variant="outline" className="text-xs">
                            {plazo} {config.tipoFrecuencia === 'diario' ? 'días' : 
                                   config.tipoFrecuencia === 'semanal' ? 'semanas' :
                                   config.tipoFrecuencia === 'quincenal' ? 'quincenas' : 'meses'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Rutas Tab */}
        <TabsContent value="rutas">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Gestión de Rutas</h2>
              <Button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Ruta
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {["Centro", "Norte", "Sur"].map((ruta, index) => (
                <Card key={index} className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5" />
                        <span>Ruta {ruta}</span>
                      </span>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Clientes</p>
                        <p className="font-semibold text-lg">{Math.floor(Math.random() * 50) + 20}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Préstamos</p>
                        <p className="font-semibold text-lg">{Math.floor(Math.random() * 40) + 15}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Cobrador Asignado</p>
                      <p className="font-semibold">
                        {index === 0 ? "Juan Pérez" : index === 1 ? "Ana Martínez" : "Pedro González"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Estado</p>
                      <Badge className="bg-success/10 text-success border-success/20">
                        Activa
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Datos Iniciales Tab */}
        <TabsContent value="datos">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Importación de Datos Iniciales</h2>
                <p className="text-muted-foreground">
                  Carga datos masivos desde archivos Excel para el inicio de operaciones
                </p>
              </div>
            </div>
            
            <InitialDataImporter />
          </div>
        </TabsContent>

        {/* Sistema Tab */}
        <TabsContent value="sistema">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Configuración del Sistema</h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Seguridad</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Tiempo de sesión (minutos)</label>
                    <Input type="number" defaultValue="60" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Intentos de login fallidos</label>
                    <Input type="number" defaultValue="3" className="mt-1" />
                  </div>
                  <Button variant="outline" className="w-full">
                    Guardar Configuración
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Horarios</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Hora inicio turnos</label>
                    <Input type="time" defaultValue="08:00" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Hora fin turnos</label>
                    <Input type="time" defaultValue="18:00" className="mt-1" />
                  </div>
                  <Button variant="outline" className="w-full">
                    Guardar Horarios
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracion;