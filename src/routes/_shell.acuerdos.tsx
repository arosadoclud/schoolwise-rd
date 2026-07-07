import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { acuerdos, estudianteById, tutorById, formatRD } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/acuerdos")({
  head: () => ({ meta: [{ title: "Acuerdos de pago — SchoolPay RD" }] }),
  component: AcuerdosPage,
});

function AcuerdosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Acuerdos de pago"
        subtitle="Planes de pago activos con tutores"
        actions={<Button><Plus className="h-4 w-4" /> Nuevo acuerdo</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {acuerdos.map((a) => {
          const est = estudianteById(a.estudianteId);
          const tutor = tutorById(a.tutorId);
          const progreso = Math.round((a.cuotasPagadas / a.cuotas) * 100);
          return (
            <Card key={a.id}>
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold">{est?.nombre}</p>
                    <p className="text-xs text-muted-foreground">{est?.curso} {est?.seccion} · Tutor: {tutor?.nombre}</p>
                  </div>
                  <StatusBadge status={a.estado} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs text-muted-foreground">Monto acordado</p><p className="font-semibold">{formatRD(a.acordado)}</p></div>
                  <div><p className="text-xs text-muted-foreground">Cuotas</p><p className="font-semibold">{a.cuotasPagadas} / {a.cuotas}</p></div>
                  <div><p className="text-xs text-muted-foreground">Inicio</p><p>{a.inicio}</p></div>
                  <div><p className="text-xs text-muted-foreground">Próximo pago</p><p>{a.proximoPago}</p></div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-medium">{progreso}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${progreso}%` }} /></div>
                </div>
                <p className="text-xs text-muted-foreground border-t border-border pt-3">Notas: {a.notas}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
