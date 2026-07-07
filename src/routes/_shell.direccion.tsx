import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Users, Wallet, ClipboardList, Megaphone, Calendar } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { estudiantes, tutorById, pagos, comunicados, inscripciones, formatRD } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/direccion")({
  head: () => ({ meta: [{ title: "Panel dirección — SchoolPay RD" }] }),
  component: DireccionPage,
});

function DireccionPage() {
  const activos = estudiantes.filter((e) => e.estado === "Activo").length;
  const cobrosPendientes = estudiantes.filter((e) => e.balance > 0).reduce((s, e) => s + e.balance, 0);
  const totalPagos = pagos.filter((p) => p.estado === "Validado").reduce((s, p) => s + p.monto, 0);
  const topDeuda = [...estudiantes].filter((e) => e.balance > 0).sort((a,b) => b.balance - a.balance).slice(0, 5);

  const proximas = [
    { fecha: "2026-11-21", titulo: "Reunión de padres 3er grado", tipo: "Reunión" },
    { fecha: "2026-11-28", titulo: "Día de la familia", tipo: "Actividad" },
    { fecha: "2026-12-05", titulo: "Cierre trimestre", tipo: "Académico" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Panel de dirección"
        subtitle="Vista ejecutiva del colegio"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Estudiantes activos" value={activos} icon={Users} tone="primary" />
        <StatCard label="Cobros pendientes" value={formatRD(cobrosPendientes)} icon={Wallet} tone="warning" />
        <StatCard label="Ingresos validados" value={formatRD(totalPagos)} icon={Wallet} tone="success" />
        <StatCard label="Inscripciones pendientes" value={inscripciones.filter((i)=>i.estado==="Pendiente").length} icon={ClipboardList} tone="info" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Padres con mayor deuda</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {topDeuda.map((e) => {
              const tutor = tutorById(e.tutorId);
              return (
                <div key={e.id} className="flex items-center justify-between rounded-md border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">{tutor?.nombre}</p>
                    <p className="text-xs text-muted-foreground">{e.nombre} · {e.curso}</p>
                  </div>
                  <span className="font-semibold text-destructive">{formatRD(e.balance)}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Alertas críticas</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
              <div>
                <p className="text-sm font-medium">{topDeuda.length} tutores con deuda mayor a RD$5,000</p>
                <p className="text-xs text-muted-foreground">Coordine plan de contacto esta semana.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-md border border-[color-mix(in_oklab,var(--warning)_40%,transparent)] bg-[color-mix(in_oklab,var(--warning)_15%,transparent)] p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-[color:var(--warning-foreground)]" />
              <div>
                <p className="text-sm font-medium">{inscripciones.filter((i)=>i.estado!=="Aprobado").length} procesos de inscripción sin cerrar</p>
                <p className="text-xs text-muted-foreground">Revise documentos pendientes.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Comunicados recientes</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {comunicados.slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-start justify-between gap-3 rounded-md border border-border p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.titulo}</p>
                  <p className="text-xs text-muted-foreground">{c.fecha} · {c.tipo}</p>
                </div>
                <StatusBadge status={c.estado} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Próximas reuniones y actividades</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {proximas.map((p) => (
              <div key={p.titulo} className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{p.titulo}</p>
                  <p className="text-xs text-muted-foreground">{p.fecha}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{p.tipo}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
              <Megaphone className="h-3.5 w-3.5" /> Recuerde publicar los comunicados con 3 días de anticipación.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
