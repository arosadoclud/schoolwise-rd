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
import { cursos, formatRD } from "@/lib/mock-data";
import { useAppState, findEstudiante, generarMensualidadesDelMes, mesActual } from "@/lib/store";

export const Route = createFileRoute("/_shell/mensualidades")({
  head: () => ({ meta: [{ title: "Mensualidades — SchoolPay RD" }] }),
  component: MensualidadesPage,
});

function MensualidadesPage() {
  const { mensualidades, estudiantes } = useAppState();
  const [mes, setMes] = useState("todos");
  const [curso, setCurso] = useState("todos");
  const [estado, setEstado] = useState("todos");
  const [q, setQ] = useState("");

  const mesesDisponibles = useMemo(() => {
    const set = new Set(mensualidades.map((m) => m.mes));
    set.add(mesActual().mes);
    return Array.from(set);
  }, [mensualidades]);

  const filtered = useMemo(() => mensualidades.filter((m) => {
    if (mes !== "todos" && m.mes !== mes) return false;
    if (estado !== "todos" && m.estado !== estado) return false;
    if (curso !== "todos" && m.cursoId !== curso) return false;
    const e = findEstudiante(estudiantes, m.estudianteId);
    if (q && !e?.nombre.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [mensualidades, estudiantes, mes, curso, estado, q]);

  const totales = filtered.reduce(
    (acc, m) => {
      acc.total += m.total;
      if (m.estado === "Pagado") acc.pagado += m.total;
      else acc.pendiente += m.total;
      return acc;
    }, { total: 0, pagado: 0, pendiente: 0 });

  function generar() {
    const { creadas, mes: mesGen, anio } = generarMensualidadesDelMes();
    if (creadas > 0) {
      toast.success(`Se generaron ${creadas} mensualidades de ${mesGen} ${anio} para estudiantes activos.`);
      setMes(mesGen);
    } else {
      toast.info(`Todos los estudiantes activos ya tienen su mensualidad de ${mesGen} ${anio}.`);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mensualidades y cuentas por cobrar"
        subtitle="Genere y consulte los cargos mensuales de todos los estudiantes"
        actions={
          <Button onClick={generar} data-testid="generar-mensualidades-btn">
            <Sparkles className="h-4 w-4" /> Generar mensualidades del mes
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-xs uppercase text-muted-foreground">Total facturado</p><p className="mt-2 text-xl font-semibold" data-testid="total-facturado">{formatRD(totales.total)}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs uppercase text-muted-foreground">Cobrado</p><p className="mt-2 text-xl font-semibold text-success">{formatRD(totales.pagado)}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs uppercase text-muted-foreground">Pendiente</p><p className="mt-2 text-xl font-semibold text-destructive">{formatRD(totales.pendiente)}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <Input placeholder="Buscar estudiante…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" data-testid="buscar-mensualidad-input" />
          <Select value={mes} onValueChange={setMes}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Mes" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los meses</SelectItem>
              {mesesDisponibles.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
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
            <TableBody data-testid="mensualidades-tbody">
              {filtered.map((m) => {
                const est = findEstudiante(estudiantes, m.estudianteId);
                return (
                  <TableRow key={m.id} data-testid={`mensualidad-row-${m.id}`}>
                    <TableCell className="font-medium">{est?.nombre ?? "—"}</TableCell>
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
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={9} className="py-8 text-center text-sm text-muted-foreground">Sin resultados.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
