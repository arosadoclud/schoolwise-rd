import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sparkles, MoreHorizontal, Pencil, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cursos, formatRD, type Mensualidad, type MensualidadEstado } from "@/lib/mock-data";
import { useAppState, findEstudiante, generarMensualidadesDelMes, mesActual, updateMensualidad, marcarMensualidadPagada } from "@/lib/store";

export const Route = createFileRoute("/_shell/mensualidades")({
  head: () => ({ meta: [{ title: "Mensualidades — SchoolPay RD" }] }),
  component: MensualidadesPage,
});

const ESTADOS: MensualidadEstado[] = ["Pendiente", "Pagado", "Vencido", "Parcial", "Anulado"];

interface EditForm {
  base: number;
  descuento: number;
  mora: number;
  fechaLimite: string;
  estado: MensualidadEstado;
}

function MensualidadesPage() {
  const { mensualidades, estudiantes } = useAppState();
  const [mes, setMes] = useState("todos");
  const [curso, setCurso] = useState("todos");
  const [estado, setEstado] = useState("todos");
  const [q, setQ] = useState("");

  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<EditForm>({ base: 0, descuento: 0, mora: 0, fechaLimite: "", estado: "Pendiente" });

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

  const editTarget = mensualidades.find((m) => m.id === editId);
  const totalPreview = form.base - form.descuento + form.mora;

  function generar() {
    const { creadas, mes: mesGen, anio } = generarMensualidadesDelMes();
    if (creadas > 0) {
      toast.success(`Se generaron ${creadas} mensualidades de ${mesGen} ${anio} para estudiantes activos.`);
      setMes(mesGen);
    } else {
      toast.info(`Todos los estudiantes activos ya tienen su mensualidad de ${mesGen} ${anio}.`);
    }
  }

  function openEdit(m: Mensualidad) {
    setEditId(m.id);
    setForm({ base: m.base, descuento: m.descuento, mora: m.mora, fechaLimite: m.fechaLimite, estado: m.estado });
  }

  function setField<K extends keyof EditForm>(key: K, value: EditForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submitEdit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!editId) return;
    updateMensualidad(editId, { base: form.base, descuento: form.descuento, mora: form.mora, fechaLimite: form.fechaLimite, estado: form.estado });
    toast.success("Mensualidad actualizada.");
    setEditId(null);
  }

  function marcarPagada(m: Mensualidad) {
    const pago = marcarMensualidadPagada(m.id);
    const est = findEstudiante(estudiantes, m.estudianteId);
    if (pago) {
      toast.success(`Mensualidad marcada como pagada. Se generó el pago ${pago.recibo} y se redujo el balance de ${est?.nombre ?? "el estudiante"}.`);
    } else {
      toast.info("Esta mensualidad ya está pagada.");
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
              {ESTADOS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
                <TableHead className="text-right">Acciones</TableHead>
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
                    <TableCell className="text-right font-semibold" data-testid={`mensualidad-total-${m.id}`}>{formatRD(m.total)}</TableCell>
                    <TableCell className="text-sm">{m.fechaLimite}</TableCell>
                    <TableCell><StatusBadge status={m.estado} /></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" aria-label="Acciones" data-testid={`acciones-mensualidad-${m.id}`}><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(m)} data-testid={`editar-mensualidad-${m.id}`}>
                            <Pencil className="h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          {m.estado !== "Pagado" && (
                            <DropdownMenuItem onClick={() => marcarPagada(m)} data-testid={`marcar-pagada-${m.id}`}>
                              <CheckCircle2 className="h-4 w-4" /> Marcar como pagada
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={10} className="py-8 text-center text-sm text-muted-foreground">Sin resultados.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal editar mensualidad */}
      <Dialog open={!!editId} onOpenChange={(o) => !o && setEditId(null)}>
        <DialogContent className="max-w-md" data-testid="mensualidad-form-dialog">
          <DialogHeader>
            <DialogTitle>Editar mensualidad</DialogTitle>
            <DialogDescription>
              {editTarget ? `${findEstudiante(estudiantes, editTarget.estudianteId)?.nombre ?? ""} — ${editTarget.mes} ${editTarget.anio}` : ""}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitEdit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="m-base">Monto base (RD$)</Label>
                <Input id="m-base" type="number" min={0} value={form.base} onChange={(e) => setField("base", Number(e.target.value))} data-testid="mensualidad-base" />
              </div>
              <div>
                <Label htmlFor="m-descuento">Descuento (RD$)</Label>
                <Input id="m-descuento" type="number" min={0} value={form.descuento} onChange={(e) => setField("descuento", Number(e.target.value))} data-testid="mensualidad-descuento" />
              </div>
              <div>
                <Label htmlFor="m-mora">Mora (RD$)</Label>
                <Input id="m-mora" type="number" min={0} value={form.mora} onChange={(e) => setField("mora", Number(e.target.value))} data-testid="mensualidad-mora" />
              </div>
              <div>
                <Label htmlFor="m-fecha">Fecha límite</Label>
                <Input id="m-fecha" type="date" value={form.fechaLimite} onChange={(e) => setField("fechaLimite", e.target.value)} data-testid="mensualidad-fecha" />
              </div>
            </div>
            <div>
              <Label>Estado</Label>
              <Select value={form.estado} onValueChange={(v) => setField("estado", v as MensualidadEstado)}>
                <SelectTrigger data-testid="mensualidad-estado"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ESTADOS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2">
              <span className="text-sm text-muted-foreground">Total (base − descuento + mora)</span>
              <span className="text-lg font-semibold" data-testid="mensualidad-total-preview">{formatRD(totalPreview)}</span>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditId(null)}>Cancelar</Button>
              <Button type="submit" data-testid="guardar-mensualidad-btn">Guardar cambios</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
