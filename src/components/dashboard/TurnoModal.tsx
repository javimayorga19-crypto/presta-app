import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Calculator, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TurnoModalProps {
  trigger: React.ReactNode;
}

export const TurnoModal = ({ trigger }: TurnoModalProps) => {
  const [open, setOpen] = useState(false);
  const [montoInicial, setMontoInicial] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const { toast } = useToast();

  const handleAbrirTurno = () => {
    if (!montoInicial || parseFloat(montoInicial) <= 0) {
      toast({
        title: "Error",
        description: "Debe ingresar un monto inicial válido",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Turno Abierto",
      description: `Turno iniciado con ${formatCurrency(parseFloat(montoInicial))}`,
      variant: "default"
    });
    
    setOpen(false);
    setMontoInicial("");
    setObservaciones("");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary" />
            <span>Abrir Turno de Cobranza</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Info del cobrador */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Juan Pérez</p>
                  <p className="text-sm text-muted-foreground">Cobrador - Ruta Centro</p>
                </div>
                <Badge className="bg-success/10 text-success border-success/20">
                  Activo
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Monto inicial */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Monto Inicial de Caja</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="0"
                value={montoInicial}
                onChange={(e) => setMontoInicial(e.target.value)}
                className="pl-9"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Dinero inicial para cambios y gastos menores
            </p>
          </div>

          {/* Resumen del día anterior */}
          <Card className="bg-gradient-to-r from-secondary/5 to-secondary/10 border-secondary/20">
            <CardContent className="pt-4">
              <h4 className="font-medium mb-3 flex items-center space-x-2">
                <Calculator className="w-4 h-4" />
                <span>Resumen Día Anterior</span>
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Recaudo</p>
                  <p className="font-semibold text-success">{formatCurrency(245000)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gastos</p>
                  <p className="font-semibold text-destructive">{formatCurrency(15000)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Clientes Visitados</p>
                  <p className="font-semibold">42</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Eficiencia</p>
                  <p className="font-semibold text-primary">98.5%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observaciones */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Observaciones (Opcional)</label>
            <textarea
              placeholder="Notas sobre el turno..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full p-3 border border-input bg-background rounded-md text-sm resize-none h-20"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleAbrirTurno}
              className="flex-1 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Abrir Turno
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};