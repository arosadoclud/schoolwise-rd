import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "muted";

const styles: Record<Tone, string> = {
  success: "bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-success border-[color-mix(in_oklab,var(--success)_35%,transparent)]",
  warning: "bg-[color-mix(in_oklab,var(--warning)_20%,transparent)] text-[color:var(--warning-foreground)] border-[color-mix(in_oklab,var(--warning)_50%,transparent)]",
  danger: "bg-[color-mix(in_oklab,var(--destructive)_15%,transparent)] text-destructive border-[color-mix(in_oklab,var(--destructive)_35%,transparent)]",
  info: "bg-[color-mix(in_oklab,var(--info)_15%,transparent)] text-info border-[color-mix(in_oklab,var(--info)_35%,transparent)]",
  muted: "bg-muted text-muted-foreground border-border",
};

const mapping: Record<string, Tone> = {
  // Estudiante
  Activo: "success", Inactivo: "muted", Retirado: "danger", Pendiente: "warning",
  // Pago / Mensualidad
  Pagado: "success", Vencido: "danger", Parcial: "warning", Anulado: "muted",
  Validado: "success", Rechazado: "danger", "Pendiente de validación": "warning",
  // Inscripciones
  Aprobado: "success", "En revisión": "info", Rechazada: "danger", Completado: "success",
  Recibido: "success", Incompleto: "warning", Revisado: "info",
  // Comunicados
  Publicado: "success", Borrador: "muted", Archivado: "muted",
  // Riesgo
  Bajo: "success", Medio: "info", Alto: "warning", Crítico: "danger",
  // Rutas / genérico
  Activa: "success", Inactiva: "muted", Cumplido: "success", Incumplido: "danger", Cancelado: "muted",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = mapping[status] ?? "muted";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        styles[tone],
        className,
      )}
    >
      {status}
    </span>
  );
}
