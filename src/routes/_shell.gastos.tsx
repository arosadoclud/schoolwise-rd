import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { gastos, pagos, formatRD } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/gastos")({
  head: () => ({ meta: [{ title: "Gastos — SchoolPay RD" }] }),
  component: GastosPage,
});

function GastosPage() {
  const totalGastos = gastos.reduce((s, g) => s + g.monto, 0);
  const totalIngresos = pagos.reduce((s, p) => s + p.monto, 0);
  const neto = totalIngresos - totalGastos;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gastos del colegio"
        subtitle="Registro operativo mensual"
        actions={<Button><Plus className="h-4 w-4" /> Nuevo gasto</Button>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-xs uppercase text-muted-foreground">Ingresos del mes</p><p className="mt-2 text-xl font-semibold text-success">{formatRD(totalIngresos)}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs uppercase text-muted-foreground">Gastos del mes</p><p className="mt-2 text-xl font-semibold text-destructive">{formatRD(totalGastos)}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs uppercase text-muted-foreground">Balance neto</p><p className={`mt-2 text-xl font-semibold ${neto >= 0 ? "text-success" : "text-destructive"}`}>{formatRD(neto)}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Detalle de gastos</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoría</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Método</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gastos.map((g) => (
                <TableRow key={g.id}>
                  <TableCell><span className="rounded-md bg-muted px-2 py-0.5 text-xs">{g.categoria}</span></TableCell>
                  <TableCell className="font-medium">{g.descripcion}</TableCell>
                  <TableCell className="text-sm">{g.proveedor}</TableCell>
                  <TableCell>{g.fecha}</TableCell>
                  <TableCell className="text-sm">{g.metodo}</TableCell>
                  <TableCell className="text-right font-semibold">{formatRD(g.monto)}</TableCell>
                  <TableCell><StatusBadge status={g.estado} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
