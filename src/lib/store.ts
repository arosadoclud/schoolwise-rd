// Estado local compartido (persistido en localStorage) para el MVP.
// No hay backend: todo vive en memoria y se sincroniza con localStorage.
import { useSyncExternalStore } from "react";
import {
  estudiantes as seedEstudiantes,
  pagos as seedPagos,
  mensualidades as seedMensualidades,
  cursos,
  type Estudiante,
  type Pago,
  type Mensualidad,
  type PagoEstado,
  type MetodoPago,
} from "./mock-data";

const STORAGE_KEY = "schoolpay-rd-state-v1";

export interface AppState {
  estudiantes: Estudiante[];
  pagos: Pago[];
  mensualidades: Mensualidad[];
}

function seedState(): AppState {
  return {
    estudiantes: seedEstudiantes.map((e) => ({ ...e })),
    pagos: seedPagos.map((p) => ({ ...p })),
    mensualidades: seedMensualidades.map((m) => ({ ...m })),
  };
}

const serverState: AppState = seedState();
let state: AppState = serverState;
let hydrated = false;

const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* almacenamiento no disponible */
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      if (parsed?.estudiantes && parsed?.pagos && parsed?.mensualidades) {
        state = parsed;
      }
    }
  } catch {
    /* json inválido: usar semilla */
  }
}

hydrate();

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function setState(next: AppState) {
  state = next;
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot() {
  return state;
}
function getServerSnapshot() {
  return serverState;
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// ---------- Helpers de ID ----------
function maxNum(ids: string[], prefixLen = 1): number {
  const nums = ids
    .map((id) => parseInt(id.replace(/\D/g, ""), 10))
    .filter((n) => !Number.isNaN(n));
  return nums.length ? Math.max(...nums) : 0;
}

function nextEstudianteId(): string {
  const max = maxNum(state.estudiantes.map((e) => e.id));
  return `E${String(max + 1).padStart(3, "0")}`;
}

function nextCodigo(): string {
  const nums = state.estudiantes
    .map((e) => parseInt(e.codigo.split("-").pop() ?? "", 10))
    .filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 999;
  return `SP-2026-${max + 1}`;
}

// ---------- Estudiantes ----------
export type EstudianteInput = Omit<Estudiante, "id" | "codigo">;

export function addEstudiante(data: EstudianteInput): Estudiante {
  const nuevo: Estudiante = { ...data, id: nextEstudianteId(), codigo: nextCodigo() };
  setState({ ...state, estudiantes: [nuevo, ...state.estudiantes] });
  return nuevo;
}

export function updateEstudiante(id: string, data: Partial<Estudiante>) {
  setState({
    ...state,
    estudiantes: state.estudiantes.map((e) => (e.id === id ? { ...e, ...data } : e)),
  });
}

export function deleteEstudiante(id: string) {
  setState({ ...state, estudiantes: state.estudiantes.filter((e) => e.id !== id) });
}

// ---------- Pagos ----------
export interface PagoInput {
  estudianteId: string;
  concepto: string;
  monto: number;
  metodo: MetodoPago;
  banco?: string;
  referencia?: string;
  estado?: PagoEstado;
}

export function addPago(data: PagoInput): Pago {
  const est = state.estudiantes.find((e) => e.id === data.estudianteId);
  const idNum = maxNum(state.pagos.map((p) => p.id)) + 1;
  const reciboNum = maxNum(state.pagos.map((p) => p.recibo)) + 1;
  const estado: PagoEstado = data.estado ?? "Validado";
  const pago: Pago = {
    id: `P${String(idNum).padStart(4, "0")}`,
    recibo: `REC-${reciboNum}`,
    estudianteId: data.estudianteId,
    tutorId: est?.tutorId ?? "",
    concepto: data.concepto,
    monto: data.monto,
    metodo: data.metodo,
    banco: data.banco || undefined,
    referencia: data.referencia || undefined,
    fecha: new Date().toISOString().slice(0, 10),
    estado,
  };

  let estudiantes = state.estudiantes;
  if (estado === "Validado" && est) {
    estudiantes = estudiantes.map((e) =>
      e.id === est.id ? { ...e, balance: Math.max(0, e.balance - data.monto) } : e,
    );
  }

  setState({ ...state, pagos: [pago, ...state.pagos], estudiantes });
  return pago;
}

// ---------- Mensualidades ----------
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function mesActual(): { mes: string; anio: number; mesIndex: number } {
  const d = new Date();
  return { mes: MESES[d.getMonth()], anio: d.getFullYear(), mesIndex: d.getMonth() };
}

export function generarMensualidadesDelMes(): { creadas: number; mes: string; anio: number } {
  const { mes, anio, mesIndex } = mesActual();
  const activos = state.estudiantes.filter((e) => e.estado === "Activo");
  const nuevas: Mensualidad[] = [];

  activos.forEach((e) => {
    const yaTiene = state.mensualidades.some(
      (m) => m.estudianteId === e.id && m.mes === mes && m.anio === anio && m.conceptoId === "K01",
    );
    if (yaTiene) return;
    const curso = cursos.find((c) => c.grado === e.curso) ?? cursos[0];
    const base = curso.mensualidad;
    const descuento = e.tipo === "Becado" ? Math.round(base * 0.3) : 0;
    const total = base - descuento;
    nuevas.push({
      id: `M-${mes}-${anio}-${e.id}`,
      estudianteId: e.id,
      cursoId: curso.id,
      conceptoId: "K01",
      mes,
      anio,
      base,
      descuento,
      mora: 0,
      total,
      fechaLimite: `${anio}-${String(mesIndex + 1).padStart(2, "0")}-10`,
      estado: "Pendiente",
    });
  });

  if (nuevas.length) {
    const idsNuevos = new Set(nuevas.map((n) => n.estudianteId));
    const estudiantes = state.estudiantes.map((e) => {
      if (!idsNuevos.has(e.id)) return e;
      const nueva = nuevas.find((n) => n.estudianteId === e.id)!;
      return { ...e, balance: e.balance + nueva.total };
    });
    setState({ ...state, mensualidades: [...nuevas, ...state.mensualidades], estudiantes });
  }

  return { creadas: nuevas.length, mes, anio };
}

// ---------- Lookups ----------
export function findEstudiante(estudiantes: Estudiante[], id: string) {
  return estudiantes.find((e) => e.id === id);
}
