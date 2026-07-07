import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label, value, icon: Icon, hint, tone = "primary",
}: {
  label: string; value: string | number; icon?: LucideIcon; hint?: string;
  tone?: "primary" | "success" | "warning" | "danger" | "info";
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    success: "bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-success",
    warning: "bg-[color-mix(in_oklab,var(--warning)_25%,transparent)] text-[color:var(--warning-foreground)]",
    danger: "bg-destructive/10 text-destructive",
    info: "bg-[color-mix(in_oklab,var(--info)_15%,transparent)] text-info",
  };
  return (
    <Card className="border-border/70">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
            {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
          </div>
          {Icon ? (
            <span className={cn("inline-flex h-10 w-10 items-center justify-center rounded-lg", tones[tone])}>
              <Icon className="h-5 w-5" />
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
