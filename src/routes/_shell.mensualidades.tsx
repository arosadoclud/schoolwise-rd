import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mensualidades, estudianteById, cursos, formatRD } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/mensualidades")({
  head: () => ({ meta: [{ title: "Mensualidades — SchoolPay RD" }] }),
  component: MensualidadesPage,
});

function MensualidadesPage() {
  const [mes, setMes] = useState("todos");
  const [curso, setCurso] = useState("todos");
  const [estado, setEstado] = useState("todos");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => mensualidades.filter((m) => {
    if (mes !== "todos" && m.mes !== mes) return false;
    if (estado !== "todos" && m.estado !== estado) return false;
    if (curso !== "todos" && m.cursoId !== curso) return false;
    const e = estudianteById(m.estudianteId);
    if (q && !e?.nombre.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [mes, curso, estado, q]);

  const totales = filtered.reduce(
    (acc, m) => {
      acc.total += m.total;
      if (m.estado === "Pagado") acc.pagado += m.total;
      else acc.pendiente += m.total;
      return acc;
    }, { total: 0, pagado: 0, pendiente: 0 });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mensualidades y cuentas por cobrar"
        subtitle="Genere y consulte los cargos mensuales de todos los estudiantes"
        actions={
          <Button onClick={() => toast.success("Mensualidades del mes generadas para estudiantes activos.")}>
            <Sparkles className="h-4 w-4" /> Generar mensualidades del mes
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-xs uppercase text-muted-foreground">Total facturado</p><p className="mt-2 text-xl font-semibold">{formatRD(totales.total)}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs uppercase text-muted-foreground">Cobrado</p><p className="mt-2 text-xl font-semibold text-success">{formatRD(totales.pagado)}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs uppercase text-muted-foreground">Pendiente</p><p className="mt-2 text-xl font-semibold text-destructive">{formatRD(totales.pendiente)}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <Input placeholder="Buscar estudiante…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
          <Select value={mes} onValueChange={setMes}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Mes" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los meses</SelectItem>
              {["Septiembre","Octubre","Noviembre"].map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={curso} onValueChange={setCurso}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Curso" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los cursos</SelectItem>
              {cursos.map((c) => <SelectItem key={c.id} value={c.id}>{c.grado} {c.seccion}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={estado} onValueChange={setEstado}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="Pagado">Pagado</SelectItem>
              <SelectItem value="Vencido">Vencido</SelectItem>
              <SelectItem value="Parcial">Parcial</SelectItem>
              <SelectItem value="Anulado">Anulado</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Mes</TableHead>
                <TableHead className="text-right">Base</TableHead>
                <TableHead className="text-right">Descuento</TableHead>
                <TableHead className="text-right">Mora</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Vence</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => {
                const est = estudianteById(m.estudianteId);
                return (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{est?.nombre}</TableCell>
                    <TableCell>{est?.curso} {est?.seccion}</TableCell>
                    <TableCell>{m.mes} {m.anio}</TableCell>
                    <TableCell className="text-right">{formatRD(m.base)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatRD(m.descuento)}</TableCell>
                    <TableCell className="text-right text-destructive">{formatRD(m.mora)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatRD(m.total)}</TableCell>
                    <TableCell className="text-sm">{m.fechaLimite}</TableCell>
                    <TableCell><StatusBadge status={m.estado} /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
