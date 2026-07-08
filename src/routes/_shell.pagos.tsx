import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Printer, X, MoreHorizontal, Check, Ban, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { tutorById, conceptos, configuracionDefault, formatRD, type MetodoPago, type PagoEstado, type Pago } from "@/lib/mock-data";
import { useAppState, addPago, findEstudiante, validarPago, rechazarPago, anularPago, type PagoInput } from "@/lib/store";

export const Route = createFileRoute("/_shell/pagos")({
  head: () => ({ meta: [{ title: "Pagos — SchoolPay RD" }] }),
  component: PagosPage,
});

const METODOS: MetodoPago[] = ["Efectivo", "Transferencia", "Depósito", "Tarjeta simulada"];
const ESTADOS_NUEVO: PagoEstado[] = ["Validado", "Pendiente de validación"];

function emptyPago(): PagoInput {
  return { estudianteId: "", concepto: conceptos[0].nombre, monto: conceptos[0].monto, metodo: "Efectivo", banco: "", referencia: "", estado: "Validado" };
}

// Marca de validez del recibo según el estado del pago.
function reciboMarca(estado: PagoEstado): { valido: boolean; titulo: string; nota?: string } {
  switch (estado) {
    case "Validado":
      return { valido: true, titulo: "Recibo válido" };
    case "Pendiente de validación":
      return { valido: false, titulo: "Pago pendiente de validación", nota: "No válido como recibo" };
    case "Rechazado":
      return { valido: false, titulo: "Pago rechazado", nota: "No válido como recibo" };
    case "Anulado":
      return { valido: false, titulo: "Pago anulado", nota: "No válido como recibo" };
  }
}

function PagosPage() {
  const { pagos, estudiantes } = useAppState();
  const [reciboId, setReciboId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<PagoInput>(emptyPago());
  const [confirm, setConfirm] = useState<{ id: string; accion: "Rechazar" | "Anular" } | null>(null);

  const cfg = configuracionDefault;
  const pago = pagos.find((p) => p.id === reciboId);
  const est = pago ? findEstudiante(estudiantes, pago.estudianteId) : null;
  const tutor = pago ? tutorById(pago.tutorId) : null;
  const marca = pago ? reciboMarca(pago.estado) : null;

  const activos = useMemo(() => estudiantes.filter((e) => e.estado !== "Retirado"), [estudiantes]);
  const seleccionado = findEstudiante(estudiantes, form.estudianteId);
  const confirmPago = confirm ? pagos.find((p) => p.id === confirm.id) : null;

  function set<K extends keyof PagoInput>(key: K, value: PagoInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function openNew() {
    setForm(emptyPago());
    setFormOpen(true);
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!form.estudianteId) { toast.error("Seleccione un estudiante."); return; }
    if (!form.monto || form.monto <= 0) { toast.error("Ingrese un monto válido."); return; }
    const nuevo = addPago(form);
    if (nuevo.estado === "Validado") {
      toast.success(`Pago ${nuevo.recibo} validado por ${formatRD(nuevo.monto)}. Balance actualizado.`);
      setReciboId(nuevo.id);
    } else {
      toast.info(`Pago ${nuevo.recibo} creado como pendiente de validación.`);
    }
    setFormOpen(false);
  }

  function doValidar(p: Pago) {
    validarPago(p.id);
    toast.success(`Pago ${p.recibo} validado. Balance del estudiante actualizado.`);
  }

  function doConfirm() {
    if (!confirm) return;
    const p = pagos.find((x) => x.id === confirm.id);
    if (p) {
      if (confirm.accion === "Rechazar") {
        rechazarPago(p.id);
        toast.success(`Pago ${p.recibo} rechazado.`);
      } else {
        anularPago(p.id);
        toast.success(`Pago ${p.recibo} anulado. Balance revertido si aplicaba.`);
      }
    }
    setConfirm(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pagos"
        subtitle="Registre pagos, valide comprobantes y emita recibos"
        actions={<Button onClick={openNew} data-testid="registrar-pago-btn"><Plus className="h-4 w-4" /> Registrar pago</Button>}
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recibo</TableHead>
                <TableHead>Estudiante</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Referencia</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Estado / Historial</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody data-testid="pagos-tbody">
              {pagos.map((p) => {
                return (
                  <TableRow key={p.id} data-testid={`pago-row-${p.id}`}>
                    <TableCell className="font-mono text-xs">{p.recibo}</TableCell>
                    <TableCell className="font-medium">{findEstudiante(estudiantes, p.estudianteId)?.nombre ?? "—"}</TableCell>
                    <TableCell>{p.concepto}</TableCell>
                    <TableCell>{p.metodo}</TableCell>
                    <TableCell className="font-mono text-xs">{p.referencia ?? "—"}</TableCell>
                    <TableCell>{p.fecha}</TableCell>
                    <TableCell className="text-right font-semibold">{formatRD(p.monto)}</TableCell>
                    <TableCell>
                      <StatusBadge status={p.estado} />
                      {p.historial && p.historial.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-x-2 text-[11px] text-muted-foreground" data-testid={`pago-historial-${p.id}`}>
                          {p.historial.map((h, i) => (
                            <span key={i}>{h.tipo} · {h.fecha}</span>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="outline" onClick={() => setReciboId(p.id)} data-testid={`ver-recibo-${p.id}`} title={p.estado === "Validado" ? "Ver recibo" : "Ver comprobante (no válido como recibo)"}>
                          <Printer className="h-4 w-4" /> Recibo
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" aria-label="Acciones" data-testid={`acciones-pago-${p.id}`}><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {p.estado !== "Validado" && p.estado !== "Anulado" && (
                              <DropdownMenuItem onClick={() => doValidar(p)} data-testid={`validar-pago-${p.id}`}>
                                <Check className="h-4 w-4" /> Validar pago
                              </DropdownMenuItem>
                            )}
                            {p.estado === "Pendiente de validación" && (
                              <DropdownMenuItem onClick={() => setConfirm({ id: p.id, accion: "Rechazar" })} data-testid={`rechazar-pago-${p.id}`}>
                                <XCircle className="h-4 w-4" /> Rechazar pago
                              </DropdownMenuItem>
                            )}
                            {p.estado === "Validado" && (
                              <>
                                <DropdownMenuItem onClick={() => setReciboId(p.id)}>
                                  <Printer className="h-4 w-4" /> Imprimir recibo
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setConfirm({ id: p.id, accion: "Anular" })} className="text-destructive focus:text-destructive" data-testid={`anular-pago-${p.id}`}>
                                  <Ban className="h-4 w-4" /> Anular pago
                                </DropdownMenuItem>
                              </>
                            )}
                            {p.estado === "Anulado" && (
                              <DropdownMenuItem disabled>Pago anulado</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal registrar pago */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg" data-testid="pago-form-dialog">
          <DialogHeader>
            <DialogTitle>Registrar pago</DialogTitle>
            <DialogDescription>Un pago validado reduce el balance del estudiante; uno pendiente queda a la espera de validación.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label>Estudiante</Label>
              <Select value={form.estudianteId} onValueChange={(v) => set("estudianteId", v)}>
                <SelectTrigger data-testid="pago-estudiante"><SelectValue placeholder="Seleccione un estudiante" /></SelectTrigger>
                <SelectContent>
                  {activos.map((e) => <SelectItem key={e.id} value={e.id}>{e.nombre} — {e.codigo}</SelectItem>)}
                </SelectContent>
              </Select>
              {seleccionado && (
                <p className="mt-1 text-xs text-muted-foreground" data-testid="pago-balance-actual">
                  Balance actual: <span className={seleccionado.balance > 0 ? "font-medium text-destructive" : "font-medium text-success"}>{formatRD(seleccionado.balance)}</span>
                </p>
              )}
            </div>
            <div>
              <Label>Concepto</Label>
              <Select value={form.concepto} onValueChange={(v) => { const c = conceptos.find((x) => x.nombre === v); set("concepto", v); if (c) set("monto", c.monto); }}>
                <SelectTrigger data-testid="pago-concepto"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {conceptos.map((c) => <SelectItem key={c.id} value={c.nombre}>{c.nombre} ({formatRD(c.monto)})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Método de pago</Label>
                <Select value={form.metodo} onValueChange={(v) => set("metodo", v as MetodoPago)}>
                  <SelectTrigger data-testid="pago-metodo"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {METODOS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pago-monto">Monto (RD$)</Label>
                <Input id="pago-monto" type="number" min={1} value={form.monto} onChange={(e) => set("monto", Number(e.target.value))} data-testid="pago-monto" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="pago-banco">Banco (opcional)</Label>
                <Input id="pago-banco" value={form.banco} onChange={(e) => set("banco", e.target.value)} placeholder="Banco Popular…" data-testid="pago-banco" />
              </div>
              <div>
                <Label htmlFor="pago-referencia">Referencia (opcional)</Label>
                <Input id="pago-referencia" value={form.referencia} onChange={(e) => set("referencia", e.target.value)} placeholder="TX…" data-testid="pago-referencia" />
              </div>
            </div>
            <div>
              <Label>Estado inicial</Label>
              <Select value={form.estado} onValueChange={(v) => set("estado", v as PagoEstado)}>
                <SelectTrigger data-testid="pago-estado"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ESTADOS_NUEVO.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
              <Button type="submit" data-testid="guardar-pago-btn">Guardar pago</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmación rechazar / anular */}
      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent data-testid="confirmar-accion-pago-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>{confirm?.accion === "Anular" ? "¿Anular este pago?" : "¿Rechazar este pago?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.accion === "Anular"
                ? <>Se anulará el pago <span className="font-medium text-foreground">{confirmPago?.recibo}</span> y, si estaba validado, se revertirá el balance del estudiante.</>
                : <>Se rechazará el pago <span className="font-medium text-foreground">{confirmPago?.recibo}</span>. Esta acción no afecta el balance del estudiante.</>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="cancelar-accion-pago-btn">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={doConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" data-testid="confirmar-accion-pago-btn">
              {confirm?.accion === "Anular" ? "Anular" : "Rechazar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Recibo */}
      <Dialog open={!!pago} onOpenChange={(o) => !o && setReciboId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="sr-only">Recibo de pago</DialogTitle>
          </DialogHeader>
          {pago && est && marca && (
            <div className="rounded-lg border border-border bg-card p-6 print:border-0 print:shadow-none">
              {!marca.valido && (
                <div className="mb-4 flex items-center gap-2 rounded-md border border-[color-mix(in_oklab,var(--warning)_50%,transparent)] bg-[color-mix(in_oklab,var(--warning)_15%,transparent)] px-3 py-2 text-sm" data-testid="recibo-marca-invalido">
                  <AlertTriangle className="h-4 w-4 text-[color:var(--warning-foreground)]" />
                  <div>
                    <p className="font-medium text-[color:var(--warning-foreground)]">{marca.titulo}</p>
                    <p className="text-xs text-muted-foreground">{marca.nota}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">{cfg.logo}</span>
                    <div>
                      <p className="text-base font-semibold">{cfg.nombre}</p>
                      <p className="text-xs text-muted-foreground">RNC {cfg.rnc}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{cfg.direccion}</p>
                  <p className="text-xs text-muted-foreground">Tel: {cfg.telefono}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase text-muted-foreground">Recibo</p>
                  <p className="font-mono text-sm font-semibold">{pago.recibo}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{pago.fecha}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-xs text-muted-foreground">Estudiante</span><div className="font-medium">{est.nombre}</div></div>
                <div><span className="text-xs text-muted-foreground">Código</span><div className="font-mono">{est.codigo}</div></div>
                <div><span className="text-xs text-muted-foreground">Curso</span><div>{est.curso} {est.seccion}</div></div>
                <div><span className="text-xs text-muted-foreground">Tutor</span><div>{tutor?.nombre}</div></div>
              </div>

              <table className="mt-4 w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                    <th className="py-2">Concepto</th>
                    <th className="py-2 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-2">{pago.concepto}</td>
                    <td className="py-2 text-right">{formatRD(pago.monto)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold">Total</td>
                    <td className="py-3 text-right text-lg font-semibold">{formatRD(pago.monto)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-xs text-muted-foreground">Método</span><div>{pago.metodo}</div></div>
                <div><span className="text-xs text-muted-foreground">Referencia</span><div className="font-mono">{pago.referencia ?? "—"}</div></div>
                <div><span className="text-xs text-muted-foreground">Balance restante</span><div className="font-medium text-success">{formatRD(est.balance)}</div></div>
                <div><span className="text-xs text-muted-foreground">Cajero</span><div>Administración</div></div>
              </div>

              <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">{cfg.reciboTexto}</p>

              <div className="mt-4 flex justify-end gap-2 print:hidden">
                <Button variant="outline" onClick={() => setReciboId(null)}><X className="h-4 w-4" /> Cerrar</Button>
                <Button onClick={() => window.print()} disabled={!marca.valido} data-testid="imprimir-recibo-btn"><Printer className="h-4 w-4" /> Imprimir</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
