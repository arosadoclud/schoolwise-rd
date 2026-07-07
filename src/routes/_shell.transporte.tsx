import { createFileRoute } from "@tanstack/react-router";
import { Plus, Bus, Phone } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { rutas, estudianteById, formatRD } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/transporte")({
  head: () => ({ meta: [{ title: "Transporte escolar — SchoolPay RD" }] }),
  component: TransportePage,
});

function TransportePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transporte escolar"
        subtitle={`${rutas.length} rutas configuradas`}
        actions={<Button><Plus className="h-4 w-4" /> Nueva ruta</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {rutas.map((r) => {
          const balancePend = r.estudiantes.length * r.costo * 0.3;
          return (
            <Card key={r.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Bus className="h-4 w-4" /></span>
                      <CardTitle className="text-lg">{r.nombre}</CardTitle>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">Zona: {r.zona}</p>
                  </div>
                  <StatusBadge status={r.estado} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-muted-foreground">Chofer</p><p className="font-medium">{r.chofer}</p></div>
                  <div><p className="text-xs text-muted-foreground">Contacto</p><p className="flex items-center gap-1 font-medium"><Phone className="h-3.5 w-3.5" /> {r.telefono}</p></div>
                  <div><p className="text-xs text-muted-foreground">Vehículo</p><p className="font-medium">{r.vehiculo}</p></div>
                  <div><p className="text-xs text-muted-foreground">Placa</p><p className="font-mono">{r.placa}</p></div>
                </div>
                <div className="rounded-md border border-border bg-muted/40 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Costo mensual</span>
                    <span className="font-semibold">{formatRD(r.costo)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Balance de transporte pendiente</span>
                    <span className="font-semibold text-destructive">{formatRD(balancePend)}</span>
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">Estudiantes asignados ({r.estudiantes.length})</p>
                  <ul className="space-y-1 text-sm">
                    {r.estudiantes.map((id) => {
                      const e = estudianteById(id);
                      return <li key={id} className="flex items-center justify-between"><span>{e?.nombre}</span><span className="text-xs text-muted-foreground">{e?.curso}</span></li>;
                    })}
                    {r.estudiantes.length === 0 && <li className="text-xs text-muted-foreground">Sin asignaciones.</li>}
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
