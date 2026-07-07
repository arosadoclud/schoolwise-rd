import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Filter, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cursos, tutores, tutorById, formatRD, type Estudiante, type EstudianteEstado, type TipoEstudiante } from "@/lib/mock-data";
import { useAppState, addEstudiante, updateEstudiante, deleteEstudiante, type EstudianteInput } from "@/lib/store";

export const Route = createFileRoute("/_shell/estudiantes")({
  head: () => ({ meta: [{ title: "Estudiantes — SchoolPay RD" }] }),
  component: EstudiantesPage,
});

const ESTADOS: EstudianteEstado[] = ["Activo", "Inactivo", "Retirado", "Pendiente"];
const TIPOS: TipoEstudiante[] = ["Regular", "Nuevo ingreso", "Reingreso", "Becado"];

function emptyForm(): EstudianteInput {
  return {
    nombre: "", curso: cursos[0].grado, seccion: cursos[0].seccion,
    fechaNacimiento: "", edad: 6, estado: "Activo", tutorId: tutores[0].id,
    tipo: "Regular", transporte: false, balance: 0,
  };
}

function EstudiantesPage() {
  const { estudiantes } = useAppState();
  const [q, setQ] = useState("");
  const [curso, setCurso] = useState<string>("todos");
  const [estado, setEstado] = useState<string>("todos");

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EstudianteInput>(emptyForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => estudiantes.filter((e) => {
    if (curso !== "todos" && e.curso !== curso) return false;
    if (estado !== "todos" && e.estado !== estado) return false;
    if (q && !`${e.nombre} ${e.codigo}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [estudiantes, q, curso, estado]);

  const deleteTarget = estudiantes.find((e) => e.id === deleteId);

  function openNew() {
    setEditingId(null);
    setForm(emptyForm());
    setFormOpen(true);
  }

  function openEdit(e: Estudiante) {
    setEditingId(e.id);
    const { id: _id, codigo: _codigo, ...rest } = e;
    setForm(rest);
    setFormOpen(true);
  }

  function set<K extends keyof EstudianteInput>(key: K, value: EstudianteInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!form.nombre.trim()) {
      toast.error("El nombre del estudiante es obligatorio.");
      return;
    }
    if (editingId) {
      updateEstudiante(editingId, form);
      toast.success("Estudiante actualizado.");
    } else {
      const nuevo = addEstudiante(form);
      toast.success(`Estudiante ${nuevo.nombre} agregado (${nuevo.codigo}).`);
    }
    setFormOpen(false);
  }

  function confirmDelete() {
    if (deleteId) {
      const nombre = deleteTarget?.nombre;
      deleteEstudiante(deleteId);
      toast.success(`Estudiante ${nombre ?? ""} eliminado.`);
    }
    setDeleteId(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Estudiantes"
        subtitle={`${estudiantes.length} estudiantes registrados`}
        actions={<Button onClick={openNew} data-testid="nuevo-estudiante-btn"><Plus className="h-4 w-4" /> Nuevo estudiante</Button>}
      />

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nombre o código…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" data-testid="buscar-estudiante-input" />
          </div>
          <Select value={curso} onValueChange={setCurso}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Curso" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los cursos</SelectItem>
              {cursos.map((c) => <SelectItem key={c.id} value={c.grado}>{c.grado} {c.seccion}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={estado} onValueChange={setEstado}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              {ESTADOS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline"><Filter className="h-4 w-4" /> Más filtros</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Edad</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Transporte</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody data-testid="estudiantes-tbody">
              {filtered.map((e) => {
                const tutor = tutorById(e.tutorId);
                return (
                  <TableRow key={e.id} data-testid={`estudiante-row-${e.id}`}>
                    <TableCell className="font-mono text-xs">{e.codigo}</TableCell>
                    <TableCell className="font-medium">{e.nombre}</TableCell>
                    <TableCell>{e.curso} {e.seccion}</TableCell>
                    <TableCell>{e.edad}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{e.tipo}</TableCell>
                    <TableCell className="text-sm">
                      <div>{tutor?.nombre}</div>
                      <div className="text-xs text-muted-foreground">{tutor?.telefono}</div>
                    </TableCell>
                    <TableCell>{e.transporte ? "Sí" : "No"}</TableCell>
                    <TableCell><StatusBadge status={e.estado} /></TableCell>
                    <TableCell className={`text-right font-medium ${e.balance > 0 ? "text-destructive" : "text-muted-foreground"}`} data-testid={`estudiante-balance-${e.id}`}>
                      {formatRD(e.balance)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" aria-label="Editar" onClick={() => openEdit(e)} data-testid={`editar-estudiante-${e.id}`}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" aria-label="Eliminar" onClick={() => setDeleteId(e.id)} data-testid={`eliminar-estudiante-${e.id}`}><Trash2 className="h-4 w-4" /></Button>
                      </div>
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

      {/* Modal crear / editar */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg" data-testid="estudiante-form-dialog">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar estudiante" : "Nuevo estudiante"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Actualice los datos del estudiante." : "Complete los datos para registrar el estudiante."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="est-nombre">Nombre completo</Label>
              <Input id="est-nombre" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} required data-testid="form-nombre" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Curso</Label>
                <Select value={form.curso} onValueChange={(v) => { const c = cursos.find((x) => x.grado === v); set("curso", v); if (c) set("seccion", c.seccion); }}>
                  <SelectTrigger data-testid="form-curso"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {cursos.map((c) => <SelectItem key={c.id} value={c.grado}>{c.grado} {c.seccion}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="est-seccion">Sección</Label>
                <Input id="est-seccion" value={form.seccion} onChange={(e) => set("seccion", e.target.value)} data-testid="form-seccion" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="est-edad">Edad</Label>
                <Input id="est-edad" type="number" min={2} max={25} value={form.edad} onChange={(e) => set("edad", Number(e.target.value))} data-testid="form-edad" />
              </div>
              <div>
                <Label htmlFor="est-balance">Balance (RD$)</Label>
                <Input id="est-balance" type="number" min={0} value={form.balance} onChange={(e) => set("balance", Number(e.target.value))} data-testid="form-balance" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Tipo</Label>
                <Select value={form.tipo} onValueChange={(v) => set("tipo", v as TipoEstudiante)}>
                  <SelectTrigger data-testid="form-tipo"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIPOS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Estado</Label>
                <Select value={form.estado} onValueChange={(v) => set("estado", v as EstudianteEstado)}>
                  <SelectTrigger data-testid="form-estado"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Tutor</Label>
              <Select value={form.tutorId} onValueChange={(v) => set("tutorId", v)}>
                <SelectTrigger data-testid="form-tutor"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {tutores.map((t) => <SelectItem key={t.id} value={t.id}>{t.nombre} — {t.parentesco}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <Label htmlFor="est-transporte" className="cursor-pointer">Usa transporte escolar</Label>
                <p className="text-xs text-muted-foreground">Ruta asignada según la zona.</p>
              </div>
              <Switch id="est-transporte" checked={form.transporte} onCheckedChange={(v) => set("transporte", v)} data-testid="form-transporte" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
              <Button type="submit" data-testid="guardar-estudiante-btn">{editingId ? "Guardar cambios" : "Agregar estudiante"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmación de eliminación */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent data-testid="eliminar-estudiante-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar estudiante?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará a <span className="font-medium text-foreground">{deleteTarget?.nombre}</span> de la lista. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="cancelar-eliminar-btn">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" data-testid="confirmar-eliminar-btn">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
