import { createFileRoute } from "@tanstack/react-router";
import { Plus, Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cursos, estudiantes, formatRD } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/cursos")({
  head: () => ({ meta: [{ title: "Cursos y secciones — SchoolPay RD" }] }),
  component: CursosPage,
});

function CursosPage() {
  const inscritosPorCurso = (grado: string) => estudiantes.filter((e) => e.curso === grado).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cursos y secciones"
        subtitle="Gestione los cursos activos del año escolar"
        actions={<Button><Plus className="h-4 w-4" /> Nuevo curso</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cursos.map((c) => {
          const inscritos = inscritosPorCurso(c.grado);
          const ocupacion = Math.round((inscritos / c.capacidad) * 100);
          return (
            <Card key={c.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.nivel}</p>
                    <CardTitle className="mt-1 text-lg">{c.grado} — Sección {c.seccion}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">{c.profesor}</p>
                  </div>
                  <StatusBadge status={c.estado} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><Users className="h-4 w-4" /> Inscritos</span>
                  <span className="font-medium">{inscritos} / {c.capacidad}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, ocupacion)}%` }} />
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
                  <span className="text-muted-foreground">Mensualidad base</span>
                  <span className="font-semibold">{formatRD(c.mensualidad)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader><CardTitle>Vista de tabla</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nivel</TableHead>
                <TableHead>Grado</TableHead>
                <TableHead>Sección</TableHead>
                <TableHead>Profesor titular</TableHead>
                <TableHead>Inscritos</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead className="text-right">Mensualidad</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cursos.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.nivel}</TableCell>
                  <TableCell className="font-medium">{c.grado}</TableCell>
                  <TableCell>{c.seccion}</TableCell>
                  <TableCell>{c.profesor}</TableCell>
                  <TableCell>{inscritosPorCurso(c.grado)}</TableCell>
                  <TableCell>{c.capacidad}</TableCell>
                  <TableCell className="text-right">{formatRD(c.mensualidad)}</TableCell>
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
