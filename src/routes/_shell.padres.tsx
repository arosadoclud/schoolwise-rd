import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { tutores, estudiantes, pagos, comunicados, formatRD } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/padres")({
  head: () => ({ meta: [{ title: "Padres y tutores — SchoolPay RD" }] }),
  component: PadresPage,
});

function PadresPage() {
  const [selected, setSelected] = useState<string>(tutores[0].id);
  const tutor = tutores.find((t) => t.id === selected)!;
  const hijos = estudiantes.filter((e) => e.tutorId === selected);
  const balanceTotal = hijos.reduce((s, e) => s + e.balance, 0);
  const historial = pagos.filter((p) => p.tutorId === selected);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Padres y tutores"
        subtitle={`${tutores.length} tutores registrados`}
        actions={<Button><Plus className="h-4 w-4" /> Nuevo tutor</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Parentesco</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tutores.map((t) => (
                  <TableRow
                    key={t.id}
                    className={`cursor-pointer ${selected === t.id ? "bg-muted/60" : ""}`}
                    onClick={() => setSelected(t.id)}
                  >
                    <TableCell className="font-medium">{t.nombre}<div className="text-xs text-muted-foreground">{t.cedula}</div></TableCell>
                    <TableCell className="text-sm">{t.parentesco}</TableCell>
                    <TableCell><StatusBadge status={t.estado} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{tutor.nombre}</CardTitle>
              <p className="text-sm text-muted-foreground">{tutor.parentesco} · Cédula {tutor.cedula}</p>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /> {tutor.telefono}</div>
              <div className="flex items-center gap-2 text-sm"><MessageCircle className="h-4 w-4 text-muted-foreground" /> {tutor.whatsapp}</div>
              <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /> {tutor.email}</div>
              <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" /> {tutor.direccion}</div>
              <div className="sm:col-span-2 rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Balance total pendiente</p>
                <p className={`text-xl font-semibold ${balanceTotal > 0 ? "text-destructive" : "text-success"}`}>{formatRD(balanceTotal)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Hijos inscritos ({hijos.length})</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {hijos.map((h) => (
                <div key={h.id} className="flex items-center justify-between rounded-md border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">{h.nombre}</p>
                    <p className="text-xs text-muted-foreground">{h.curso} {h.seccion} · {h.codigo}</p>
                  </div>
                  <StatusBadge status={h.estado} />
                </div>
              ))}
              {hijos.length === 0 && <p className="text-sm text-muted-foreground">Sin hijos asociados.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Historial de pagos</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recibo</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historial.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.recibo}</TableCell>
                      <TableCell>{p.concepto}</TableCell>
                      <TableCell>{p.fecha}</TableCell>
                      <TableCell className="text-right">{formatRD(p.monto)}</TableCell>
                      <TableCell><StatusBadge status={p.estado} /></TableCell>
                    </TableRow>
                  ))}
                  {historial.length === 0 && <TableRow><TableCell colSpan={5} className="py-4 text-center text-sm text-muted-foreground">Sin pagos aún.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Comunicados recibidos</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {comunicados.filter((c) => c.estado === "Publicado").slice(0, 3).map((c) => (
                <div key={c.id} className="rounded-md border border-border p-3">
                  <p className="text-sm font-medium">{c.titulo}</p>
                  <p className="text-xs text-muted-foreground">{c.fecha} · {c.tipo}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
