import { createFileRoute } from "@tanstack/react-router";
import { Copy, History, Handshake, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { estudiantes, tutorById, nivelRiesgo, formatRD } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/morosidad")({
  head: () => ({ meta: [{ title: "Morosidad — SchoolPay RD" }] }),
  component: MorosidadPage,
});

function MorosidadPage() {
  const morosos = estudiantes.filter((e) => e.balance > 0).map((e, i) => ({ ...e, dias: 15 + i * 12, mesesPend: 1 + (i % 3), ultimoPago: `2026-${String(9 + (i % 2)).padStart(2,"0")}-1${i%9}` }));

  function copiarMensaje(nombre: string, monto: number) {
    const msg = `Hola, le recordamos que el estudiante ${nombre} tiene un balance pendiente de ${formatRD(monto)} correspondiente a la mensualidad escolar. Puede realizar su pago por transferencia y enviar el comprobante por esta vía. Gracias.`;
    navigator.clipboard.writeText(msg).catch(() => {});
    toast.success("Mensaje copiado", { description: "Listo para pegar en WhatsApp." });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Morosidad"
        subtitle={`${morosos.length} estudiantes con balance pendiente`}
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead className="text-center">Meses</TableHead>
                <TableHead className="text-right">Adeudado</TableHead>
                <TableHead className="text-center">Días</TableHead>
                <TableHead>Riesgo</TableHead>
                <TableHead>Último pago</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {morosos.map((m) => {
                const tutor = tutorById(m.tutorId);
                return (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.nombre}</TableCell>
                    <TableCell>{m.curso} {m.seccion}</TableCell>
                    <TableCell className="text-sm">{tutor?.nombre}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{tutor?.telefono}<br />{tutor?.whatsapp}</TableCell>
                    <TableCell className="text-center">{m.mesesPend}</TableCell>
                    <TableCell className="text-right font-semibold text-destructive">{formatRD(m.balance)}</TableCell>
                    <TableCell className="text-center">{m.dias}</TableCell>
                    <TableCell><StatusBadge status={nivelRiesgo(m.dias)} /></TableCell>
                    <TableCell className="text-sm">{m.ultimoPago}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" title="Historial" onClick={() => toast("Abriendo historial…")}><History className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" title="Acuerdo de pago" onClick={() => toast("Nuevo acuerdo de pago")}><Handshake className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" title="Copiar mensaje WhatsApp" onClick={() => copiarMensaje(m.nombre, m.balance)}><Copy className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" title="Marcar como contactado" onClick={() => toast.success("Marcado como contactado.")}><CheckCircle2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
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
