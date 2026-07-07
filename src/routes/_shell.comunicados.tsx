import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Copy, Eye } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { comunicados } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/comunicados")({
  head: () => ({ meta: [{ title: "Comunicados — SchoolPay RD" }] }),
  component: ComunicadosPage,
});

function ComunicadosPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const c = comunicados.find((x) => x.id === preview);

  function copiar(msg: string) {
    navigator.clipboard.writeText(msg).catch(() => {});
    toast.success("Comunicado copiado para WhatsApp.");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comunicados"
        subtitle="Mensajes enviados a padres y tutores"
        actions={<Button><Plus className="h-4 w-4" /> Nuevo comunicado</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {comunicados.map((c) => (
          <Card key={c.id}>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-base font-semibold text-foreground">{c.titulo}</p>
                  <p className="text-xs text-muted-foreground">{c.fecha} · {c.tipo} · {c.destinatarios}</p>
                </div>
                <StatusBadge status={c.estado} />
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{c.mensaje}</p>
              <div className="flex justify-end gap-2 border-t border-border pt-3">
                <Button size="sm" variant="outline" onClick={() => setPreview(c.id)}><Eye className="h-4 w-4" /> Vista previa</Button>
                <Button size="sm" onClick={() => copiar(c.mensaje)}><Copy className="h-4 w-4" /> Copiar WhatsApp</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{c?.titulo}</DialogTitle></DialogHeader>
          {c && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <StatusBadge status={c.tipo} /> <span>{c.fecha}</span> · <span>{c.destinatarios}</span>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm leading-relaxed">{c.mensaje}</div>
              <Button className="w-full" onClick={() => copiar(c.mensaje)}><Copy className="h-4 w-4" /> Copiar para WhatsApp</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
