import { createFileRoute } from "@tanstack/react-router";
import {
  Users, GraduationCap, Wallet, AlertTriangle, ClipboardList, Megaphone,
  TrendingUp, CalendarClock,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Legend,
} from "recharts";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  estudiantes, pagos, mensualidades, comunicados, inscripciones, tutorById,
  ingresosMensuales, morosidadPorMes, formatRD,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — SchoolPay RD" }] }),
  component: Dashboard,
});

function Dashboard() {
  const activos = estudiantes.filter((e) => e.estado === "Activo").length;
  const pendientesInsc = inscripciones.filter((i) => i.estado === "Pendiente").length;
  const enMora = estudiantes.filter((e) => e.balance > 0).length;
  const balancePendiente = estudiantes.reduce((s, e) => s + e.balance, 0);
  const pagosMes = pagos.filter((p) => p.estado === "Validado").reduce((s, p) => s + p.monto, 0);
  const proximos = mensualidades.filter((m) => m.estado === "Pendiente").slice(0, 5);

  const topDeuda = [...estudiantes].sort((a, b) => b.balance - a.balance).slice(0, 5);
  const pagosRecientes = [...pagos].slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Resumen operacional del año escolar 2026-2027"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total estudiantes" value={estudiantes.length} icon={GraduationCap} tone="primary" />
        <StatCard label="Estudiantes activos" value={activos} icon={Users} tone="success" hint={`${Math.round((activos / estudiantes.length) * 100)}% del total`} />
        <StatCard label="Pagos recibidos (Nov)" value={formatRD(pagosMes)} icon={Wallet} tone="success" />
        <StatCard label="Balance pendiente" value={formatRD(balancePendiente)} icon={TrendingUp} tone="warning" />
        <StatCard label="Estudiantes en mora" value={enMora} icon={AlertTriangle} tone="danger" />
        <StatCard label="Inscripciones pendientes" value={pendientesInsc} icon={ClipboardList} tone="info" />
        <StatCard label="Comunicados enviados" value={comunicados.filter((c) => c.estado === "Publicado").length} icon={Megaphone} tone="info" />
        <StatCard label="Cobros próximos a vencer" value={proximos.length} icon={CalendarClock} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Ingresos mensuales</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ingresosMensuales}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v: number) => formatRD(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="ingresos" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="gastos" stroke="var(--chart-5)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Morosidad por mes</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={morosidadPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v: number) => formatRD(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="monto" fill="var(--chart-5)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Pagos recientes</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recibo</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagosRecientes.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.recibo}</TableCell>
                    <TableCell className="text-sm">{tutorById(p.tutorId)?.nombre}</TableCell>
                    <TableCell className="text-sm">{p.metodo}</TableCell>
                    <TableCell className="text-right font-medium">{formatRD(p.monto)}</TableCell>
                    <TableCell><StatusBadge status={p.estado} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Estudiantes con mayor deuda</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topDeuda.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-sm font-medium">{e.nombre}</TableCell>
                    <TableCell className="text-sm">{e.curso} {e.seccion}</TableCell>
                    <TableCell className="text-sm">{tutorById(e.tutorId)?.nombre}</TableCell>
                    <TableCell className="text-right font-semibold text-destructive">{formatRD(e.balance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Alertas de cobros vencidos</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {mensualidades.filter((m) => m.estado === "Vencido").slice(0, 5).map((m) => {
              const est = estudiantes.find((e) => e.id === m.estudianteId)!;
              return (
                <div key={m.id} className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{est.nombre}</p>
                    <p className="text-xs text-muted-foreground">{est.curso} · {m.mes} {m.anio} · vence {m.fechaLimite}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-destructive">{formatRD(m.total)}</p>
                    <StatusBadge status="Vencido" />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Próximos pagos programados</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {proximos.map((m) => {
              const est = estudiantes.find((e) => e.id === m.estudianteId)!;
              return (
                <div key={m.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{est.nombre}</p>
                    <p className="text-xs text-muted-foreground">{est.curso} · {m.mes} {m.anio} · vence {m.fechaLimite}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{formatRD(m.total)}</p>
                    <StatusBadge status={m.estado} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
