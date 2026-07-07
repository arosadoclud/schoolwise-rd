import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { configuracionDefault } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/configuracion")({
  head: () => ({ meta: [{ title: "Configuración — SchoolPay RD" }] }),
  component: ConfigPage,
});

function ConfigPage() {
  const [cfg, setCfg] = useState(configuracionDefault);
  const set = <K extends keyof typeof cfg>(k: K, v: (typeof cfg)[K]) => setCfg({ ...cfg, [k]: v });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuración del colegio"
        subtitle="Estos datos se usan en recibos, comunicados y reportes"
        actions={<Button onClick={() => toast.success("Configuración guardada")}>Guardar cambios</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Identidad</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">{cfg.logo}</span>
              <div className="flex-1">
                <Label htmlFor="logo">Logo (siglas)</Label>
                <Input id="logo" value={cfg.logo} onChange={(e) => set("logo", e.target.value)} />
              </div>
            </div>
            <div><Label>Nombre del colegio</Label><Input value={cfg.nombre} onChange={(e) => set("nombre", e.target.value)} /></div>
            <div><Label>RNC</Label><Input value={cfg.rnc} onChange={(e) => set("rnc", e.target.value)} /></div>
            <div><Label>Director/a</Label><Input value={cfg.director} onChange={(e) => set("director", e.target.value)} /></div>
            <div><Label>Año escolar activo</Label><Input value={cfg.anioEscolar} onChange={(e) => set("anioEscolar", e.target.value)} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contacto</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div><Label>Teléfono</Label><Input value={cfg.telefono} onChange={(e) => set("telefono", e.target.value)} /></div>
            <div><Label>WhatsApp</Label><Input value={cfg.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} /></div>
            <div className="sm:col-span-2"><Label>Email</Label><Input value={cfg.email} onChange={(e) => set("email", e.target.value)} /></div>
            <div className="sm:col-span-2"><Label>Dirección</Label><Input value={cfg.direccion} onChange={(e) => set("direccion", e.target.value)} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Cobros y mora</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div><Label>Día límite de pago</Label><Input type="number" value={cfg.diaLimite} onChange={(e) => set("diaLimite", Number(e.target.value))} /></div>
            <div><Label>Porcentaje de mora</Label><Input type="number" value={cfg.moraPorcentaje} onChange={(e) => set("moraPorcentaje", Number(e.target.value))} /></div>
            <div><Label>Banco</Label><Input value={cfg.banco} onChange={(e) => set("banco", e.target.value)} /></div>
            <div><Label>Cuenta</Label><Input value={cfg.cuenta} onChange={(e) => set("cuenta", e.target.value)} /></div>
            <div><Label>Tipo de cuenta</Label><Input value={cfg.tipoCuenta} onChange={(e) => set("tipoCuenta", e.target.value)} /></div>
            <div>
              <Label>Color de marca</Label>
              <div className="flex items-center gap-2">
                <Input type="color" value={cfg.colorMarca} onChange={(e) => set("colorMarca", e.target.value)} className="h-10 w-16 p-1" />
                <Input value={cfg.colorMarca} onChange={(e) => set("colorMarca", e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Textos personalizados</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div><Label>Texto para recibos</Label><Textarea rows={3} value={cfg.reciboTexto} onChange={(e) => set("reciboTexto", e.target.value)} /></div>
            <div><Label>Mensaje de bienvenida para padres</Label><Textarea rows={3} value={cfg.mensajeBienvenida} onChange={(e) => set("mensajeBienvenida", e.target.value)} /></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
