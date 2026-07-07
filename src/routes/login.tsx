import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión — SchoolPay RD" },
      { name: "description", content: "Acceda a SchoolPay RD, la plataforma de gestión para colegios dominicanos." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@schoolpayrd.com");
  const [password, setPassword] = useState("Admin123!");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email === "admin@schoolpayrd.com" && password === "Admin123!") {
      navigate({ to: "/dashboard" });
    } else {
      setError("Credenciales inválidas. Use las credenciales demo.");
    }
  }

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="hidden bg-sidebar text-sidebar-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sidebar-primary font-bold text-sidebar-primary-foreground">SP</span>
          <div>
            <p className="text-lg font-semibold">SchoolPay RD</p>
            <p className="text-xs text-sidebar-foreground/60">Gestión escolar</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-semibold leading-tight">
            La plataforma de cobros y gestión para colegios dominicanos.
          </h2>
          <p className="text-sm text-sidebar-foreground/70">
            Controle mensualidades, morosidad, inscripciones, transporte y comunicados desde un solo panel.
            Diseñado para colegios privados, estancias infantiles, centros de tareas y academias.
          </p>
          <ul className="space-y-2 text-sm text-sidebar-foreground/80">
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-sidebar-primary" /> Recibos e informes listos para imprimir</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-sidebar-primary" /> Cobros y morosidad automatizados</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-sidebar-primary" /> Comunicados por WhatsApp para tutores</li>
          </ul>
        </div>

        <p className="text-xs text-sidebar-foreground/50">© 2026 SchoolPay RD. Hecho en República Dominicana.</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">SP</span>
            <div>
              <p className="text-lg font-semibold text-foreground">SchoolPay RD</p>
              <p className="text-xs text-muted-foreground">Gestión escolar</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              <GraduationCap className="h-3.5 w-3.5 text-primary" /> Acceso administrativo
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Ingrese a su panel</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Use las credenciales demo precargadas para explorar la plataforma.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full" size="lg">Iniciar sesión</Button>
          </form>

          <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/50 p-4 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Credenciales demo</p>
            <p className="mt-1">Email: <span className="font-mono">admin@schoolpayrd.com</span></p>
            <p>Password: <span className="font-mono">Admin123!</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
