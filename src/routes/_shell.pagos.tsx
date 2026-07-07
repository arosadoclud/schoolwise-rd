import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Printer, X } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { pagos, estudianteById, tutorById, configuracionDefault, formatRD } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/pagos")({
  head: () => ({ meta: [{ title: "Pagos — SchoolPay RD" }] }),
  component: PagosPage,
});

function PagosPage() {
  const [reciboId, setReciboId] = useState<string | null>(null);
  const pago = pagos.find((p) => p.id === reciboId);
  const est = pago ? estudianteById(pago.estudianteId) : null;
  const tutor = pago ? tutorById(pago.tutorId) : null;
  const cfg = configuracionDefault;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pagos"
        subtitle="Registre pagos, valide comprobantes y emita recibos"
        actions={<Button><Plus className="h-4 w-4" /> Registrar pago</Button>}
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recibo</TableHead>
                <TableHead>Estudiante</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Banco</TableHead>
                <TableHead>Referencia</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.recibo}</TableCell>
                  <TableCell className="font-medium">{estudianteById(p.estudianteId)?.nombre}</TableCell>
                  <TableCell className="text-sm">{tutorById(p.tutorId)?.nombre}</TableCell>
                  <TableCell>{p.concepto}</TableCell>
                  <TableCell>{p.metodo}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.banco ?? "—"}</TableCell>
                  <TableCell className="font-mono text-xs">{p.referencia ?? "—"}</TableCell>
                  <TableCell>{p.fecha}</TableCell>
                  <TableCell className="text-right font-semibold">{formatRD(p.monto)}</TableCell>
                  <TableCell><StatusBadge status={p.estado} /></TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => setReciboId(p.id)}>
                      <Printer className="h-4 w-4" /> Recibo
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!pago} onOpenChange={(o) => !o && setReciboId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="sr-only">Recibo de pago</DialogTitle>
          </DialogHeader>
          {pago && est && (
            <div className="rounded-lg border border-border bg-card p-6 print:border-0 print:shadow-none">
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
                <Button onClick={() => window.print()}><Printer className="h-4 w-4" /> Imprimir</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
