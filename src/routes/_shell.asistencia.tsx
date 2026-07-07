import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/stat-card";
import { CheckCircle2, XCircle, Clock, ShieldCheck } from "lucide-react";
import { estudiantes, cursos } from "@/lib/mock-data";

type Marca = "Presente" | "Ausente" | "Tarde" | "Excusado";

export const Route = createFileRoute("/_shell/asistencia")({
  head: () => ({ meta: [{ title: "Asistencia — SchoolPay RD" }] }),
  component: AsistenciaPage,
});

function AsistenciaPage() {
  const [curso, setCurso] = useState(cursos[2].grado);
  const lista = useMemo(() => estudiantes.filter((e) => e.curso === curso && e.estado === "Activo"), [curso]);
  const [marcas, setMarcas] = useState<Record<string, Marca>>({});

  const resumen = useMemo(() => {
    const r = { Presente: 0, Ausente: 0, Tarde: 0, Excusado: 0 };
    lista.forEach((e) => { r[marcas[e.id] ?? "Presente"] += 1; });
    return r;
  }, [marcas, lista]);
  const porcentaje = lista.length ? Math.round(((resumen.Presente + resumen.Tarde) / lista.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Asistencia" subtitle="Marque asistencia por curso" />

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <Select value={curso} onValueChange={setCurso}>
            <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {cursos.map((c) => <SelectItem key={c.id} value={c.grado}>{c.grado} {c.seccion} — {c.profesor}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">Fecha: {new Date().toLocaleDateString("es-DO")}</span>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Presentes" value={resumen.Presente} icon={CheckCircle2} tone="success" />
        <StatCard label="Ausentes" value={resumen.Ausente} icon={XCircle} tone="danger" />
        <StatCard label="Tardanzas" value={resumen.Tarde} icon={Clock} tone="warning" />
        <StatCard label="% Asistencia" value={`${porcentaje}%`} icon={ShieldCheck} tone="info" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                <TableHead>Código</TableHead>
                <TableHead className="text-right">Marca</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lista.map((e) => {
                const val = marcas[e.id] ?? "Presente";
                return (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.nombre}</TableCell>
                    <TableCell className="font-mono text-xs">{e.codigo}</TableCell>
                    <TableCell className="text-right">
                      <Select value={val} onValueChange={(v) => setMarcas((m) => ({ ...m, [e.id]: v as Marca }))}>
                        <SelectTrigger className="ml-auto w-[150px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Presente">Presente</SelectItem>
                          <SelectItem value="Ausente">Ausente</SelectItem>
                          <SelectItem value="Tarde">Tarde</SelectItem>
                          <SelectItem value="Excusado">Excusado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
              {lista.length === 0 && <TableRow><TableCell colSpan={3} className="py-6 text-center text-sm text-muted-foreground">Sin estudiantes activos en este curso.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
