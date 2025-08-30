import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Users, 
  CreditCard, 
  BarChart3, 
  Receipt, 
  Settings, 
  Home,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentUser?: {
    name: string;
    role: 'administrador' | 'supervisor' | 'cobrador';
  };
}

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Users, label: "Clientes", path: "/clientes" },
  { icon: CreditCard, label: "Préstamos", path: "/prestamos" },
  { icon: Receipt, label: "Gastos", path: "/gastos" },
  { icon: BarChart3, label: "Reportes", path: "/reportes" },
  { icon: Settings, label: "Configuración", path: "/configuracion" },
];

export const Sidebar = ({ currentUser = { name: "Usuario Demo", role: "administrador" } }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'administrador': return 'text-accent';
      case 'supervisor': return 'text-secondary';
      case 'cobrador': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <aside className={cn(
      "h-screen bg-card border-r border-border flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                RotaLoan
              </h1>
              <p className="text-xs text-muted-foreground">Sistema de Gestión</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="p-2"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentUser.name}</p>
              <p className={cn("text-xs capitalize font-medium", getRoleColor(currentUser.role))}>
                {currentUser.role}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  collapsed ? "px-2" : "px-3",
                  isActive && "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-financial"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start gap-3 h-10 text-destructive hover:text-destructive hover:bg-destructive/10",
            collapsed ? "px-2" : "px-3"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Cerrar Sesión</span>}
        </Button>
      </div>
    </aside>
  );
};