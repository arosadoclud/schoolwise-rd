import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Filter, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { estudiantes, tutorById, cursos, formatRD } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/estudiantes")({
  head: () => ({ meta: [{ title: "Estudiantes — SchoolPay RD" }] }),
  component: EstudiantesPage,
});

function EstudiantesPage() {
  const [q, setQ] = useState("");
  const [curso, setCurso] = useState<string>("todos");
  const [estado, setEstado] = useState<string>("todos");

  const filtered = useMemo(() => estudiantes.filter((e) => {
    if (curso !== "todos" && e.curso !== curso) return false;
    if (estado !== "todos" && e.estado !== estado) return false;
    if (q && !`${e.nombre} ${e.codigo}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [q, curso, estado]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Estudiantes"
        subtitle={`${estudiantes.length} estudiantes registrados`}
        actions={<Button><Plus className="h-4 w-4" /> Nuevo estudiante</Button>}
      />

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nombre o código…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
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
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
              <SelectItem value="Retirado">Retirado</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
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
            <TableBody>
              {filtered.map((e) => {
                const tutor = tutorById(e.tutorId);
                return (
                  <TableRow key={e.id}>
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
                    <TableCell className={`text-right font-medium ${e.balance > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                      {formatRD(e.balance)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" aria-label="Editar"><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" aria-label="Eliminar"><Trash2 className="h-4 w-4" /></Button>
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
    </div>
  );
}
