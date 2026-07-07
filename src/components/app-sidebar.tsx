import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, GraduationCap, Users, BookOpen, Tags, CalendarClock,
  Receipt, AlertTriangle, Handshake, ClipboardList, Megaphone, CheckSquare,
  Bus, Wallet, TrendingDown, BarChart3, Building2, Settings, LogOut,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/session";

const groups = [
  {
    label: "Operación",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Estudiantes", url: "/estudiantes", icon: GraduationCap },
      { title: "Padres / tutores", url: "/padres", icon: Users },
      { title: "Cursos", url: "/cursos", icon: BookOpen },
      { title: "Asistencia", url: "/asistencia", icon: CheckSquare },
    ],
  },
  {
    label: "Cobros",
    items: [
      { title: "Conceptos de cobro", url: "/conceptos", icon: Tags },
      { title: "Mensualidades", url: "/mensualidades", icon: CalendarClock },
      { title: "Pagos", url: "/pagos", icon: Receipt },
      { title: "Morosidad", url: "/morosidad", icon: AlertTriangle },
      { title: "Acuerdos de pago", url: "/acuerdos", icon: Handshake },
      { title: "Inscripciones", url: "/inscripciones", icon: ClipboardList },
    ],
  },
  {
    label: "Gestión",
    items: [
      { title: "Comunicados", url: "/comunicados", icon: Megaphone },
      { title: "Transporte escolar", url: "/transporte", icon: Bus },
      { title: "Caja del día", url: "/caja", icon: Wallet },
      { title: "Gastos", url: "/gastos", icon: TrendingDown },
      { title: "Reportes", url: "/reportes", icon: BarChart3 },
      { title: "Panel dirección", url: "/direccion", icon: Building2 },
      { title: "Configuración", url: "/configuracion", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();
  const isActive = (url: string) =>
    url === "/dashboard" ? pathname === "/" || pathname === "/dashboard" : pathname.startsWith(url);

  const handleLogout = () => {
    logout();
    navigate({ to: "/login", replace: true });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-3 px-2 py-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
            SP
          </span>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">SchoolPay RD</p>
            <p className="truncate text-[11px] text-sidebar-foreground/60">Gestión escolar</p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel className="text-sidebar-foreground/50">{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => {
                  const active = isActive(item.url);
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className={cn(active && "bg-sidebar-accent text-sidebar-accent-foreground")}
                      >
                        <Link to={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Cerrar sesión" data-testid="logout-button">
              <LogOut className="h-4 w-4" />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
