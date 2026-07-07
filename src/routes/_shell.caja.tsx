import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Building2, Landmark, CreditCard, Receipt, AlertTriangle, TrendingDown, PiggyBank } from "lucide-react";
import { pagos, gastos, formatRD } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/caja")({
  head: () => ({ meta: [{ title: "Caja del día — SchoolPay RD" }] }),
  component: CajaPage,
});

function CajaPage() {
  const efectivo = pagos.filter((p) => p.metodo === "Efectivo").reduce((s, p) => s + p.monto, 0);
  const transferencia = pagos.filter((p) => p.metodo === "Transferencia").reduce((s, p) => s + p.monto, 0);
  const deposito = pagos.filter((p) => p.metodo === "Depósito").reduce((s, p) => s + p.monto, 0);
  const tarjeta = pagos.filter((p) => p.metodo === "Tarjeta simulada").reduce((s, p) => s + p.monto, 0);
  const total = efectivo + transferencia + deposito + tarjeta;
  const pendientes = pagos.filter((p) => p.estado === "Pendiente de validación").length;
  const gastosMenores = gastos.filter((g) => g.categoria === "Materiales" || g.categoria === "Limpieza").reduce((s, g) => s + g.monto, 0);
  const neto = total - gastosMenores;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Caja del día"
        subtitle={new Date().toLocaleDateString("es-DO", { dateStyle: "full" })}
        actions={<Button onClick={() => toast.success("Caja cerrada correctamente.", { description: `Neto: ${formatRD(neto)}` })}><Lock className="h-4 w-4" /> Cerrar caja</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Efectivo" value={formatRD(efectivo)} icon={Wallet} tone="success" />
        <StatCard label="Transferencia" value={formatRD(transferencia)} icon={Building2} tone="primary" />
        <StatCard label="Depósito" value={formatRD(deposito)} icon={Landmark} tone="info" />
        <StatCard label="Tarjeta simulada" value={formatRD(tarjeta)} icon={CreditCard} tone="info" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total cobrado" value={formatRD(total)} icon={PiggyBank} tone="success" />
        <StatCard label="Recibos emitidos" value={pagos.length} icon={Receipt} tone="primary" />
        <StatCard label="Pagos por validar" value={pendientes} icon={AlertTriangle} tone="warning" />
        <StatCard label="Gastos menores" value={formatRD(gastosMenores)} icon={TrendingDown} tone="danger" />
      </div>

      <Card>
        <CardHeader><CardTitle>Resumen del día</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2 text-sm">
            <span className="text-muted-foreground">Ingresos totales</span>
            <span className="font-semibold">{formatRD(total)}</span>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-2 text-sm">
            <span className="text-muted-foreground">(-) Gastos menores</span>
            <span className="font-semibold text-destructive">-{formatRD(gastosMenores)}</span>
          </div>
          <div className="flex items-center justify-between pt-2 text-base">
            <span className="font-semibold">Resultado neto</span>
            <span className={`text-xl font-bold ${neto >= 0 ? "text-success" : "text-destructive"}`}>{formatRD(neto)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
