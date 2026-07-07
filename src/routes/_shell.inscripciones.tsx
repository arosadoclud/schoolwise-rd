import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { inscripciones, estudianteById, formatRD } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/inscripciones")({
  head: () => ({ meta: [{ title: "Inscripciones — SchoolPay RD" }] }),
  component: InscripcionesPage,
});

function InscripcionesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Inscripciones y reinscripciones"
        subtitle="Gestione documentos y estado de proceso"
        actions={<Button><Plus className="h-4 w-4" /> Nuevo proceso</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {inscripciones.map((i) => {
          const est = estudianteById(i.estudianteId);
          return (
            <Card key={i.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{est?.nombre}</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">{i.tipo} · {i.anio} · Curso {i.curso}</p>
                  </div>
                  <StatusBadge status={i.estado} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 p-3 text-sm">
                  <span>Monto {i.tipo.toLowerCase()}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{formatRD(i.monto)}</span>
                    <StatusBadge status={i.pagado ? "Pagado" : "Pendiente"} />
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Documentos</p>
                  <ul className="space-y-1.5">
                    {i.documentos.map((d) => (
                      <li key={d.nombre} className="flex items-center justify-between text-sm">
                        <span>{d.nombre}</span>
                        <StatusBadge status={d.estado} />
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
