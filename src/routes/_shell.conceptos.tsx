import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { conceptos, formatRD } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/conceptos")({
  head: () => ({ meta: [{ title: "Conceptos de cobro — SchoolPay RD" }] }),
  component: ConceptosPage,
});

function ConceptosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Conceptos de cobro"
        subtitle="Defina los cargos que se aplican a estudiantes y cursos"
        actions={<Button><Plus className="h-4 w-4" /> Nuevo concepto</Button>}
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Aplica a</TableHead>
                <TableHead>Frecuencia</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conceptos.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.nombre}</TableCell>
                  <TableCell className="text-right">{formatRD(c.monto)}</TableCell>
                  <TableCell>{c.aplicaA}</TableCell>
                  <TableCell>{c.frecuencia}</TableCell>
                  <TableCell><StatusBadge status={c.estado} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
