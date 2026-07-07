import { createFileRoute } from "@tanstack/react-router";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { pagos, estudiantes, cursos, ingresosMensuales, morosidadPorMes, formatRD } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/reportes")({
  head: () => ({ meta: [{ title: "Reportes — SchoolPay RD" }] }),
  component: ReportesPage,
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function ReportesPage() {
  const morosidadPorCurso = cursos.map((c) => ({
    curso: `${c.grado}${c.seccion}`,
    monto: estudiantes.filter((e) => e.curso === c.grado).reduce((s, e) => s + e.balance, 0),
  }));

  const metodos = ["Efectivo","Transferencia","Depósito","Tarjeta simulada"].map((m) => ({
    name: m,
    value: pagos.filter((p) => p.metodo === m).reduce((s, p) => s + p.monto, 0),
  }));

  const becados = estudiantes.filter((e) => e.tipo === "Becado");

  return (
    <div className="space-y-6">
      <PageHeader title="Reportes" subtitle="Visualice los indicadores clave del colegio" />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Ingresos vs gastos</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ingresosMensuales}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip formatter={(v: number) => formatRD(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend />
                <Line dataKey="ingresos" stroke="var(--chart-1)" strokeWidth={2} />
                <Line dataKey="gastos" stroke="var(--chart-5)" strokeWidth={2} />
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
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip formatter={(v: number) => formatRD(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="monto" fill="var(--chart-5)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Morosidad por curso</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={morosidadPorCurso}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="curso" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip formatter={(v: number) => formatRD(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="monto" fill="var(--chart-2)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pagos por método</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={metodos} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {metodos.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatRD(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Estudiantes becados</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Curso</TableHead><TableHead>Tipo</TableHead><TableHead className="text-right">Balance</TableHead></TableRow></TableHeader>
            <TableBody>
              {becados.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.nombre}</TableCell>
                  <TableCell>{e.curso} {e.seccion}</TableCell>
                  <TableCell>{e.tipo}</TableCell>
                  <TableCell className="text-right">{formatRD(e.balance)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
