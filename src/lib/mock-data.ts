// Datos simulados dominicanos para SchoolPay RD.

export type EstudianteEstado = "Activo" | "Inactivo" | "Retirado" | "Pendiente";
export type TipoEstudiante = "Nuevo ingreso" | "Reingreso" | "Becado" | "Regular";
export type MensualidadEstado = "Pendiente" | "Pagado" | "Vencido" | "Parcial" | "Anulado";
export type PagoEstado = "Pendiente de validación" | "Validado" | "Rechazado";
export type MetodoPago = "Efectivo" | "Transferencia" | "Depósito" | "Tarjeta simulada";
export type NivelRiesgo = "Bajo" | "Medio" | "Alto" | "Crítico";

export interface Estudiante {
  id: string; codigo: string; nombre: string; curso: string; seccion: string;
  fechaNacimiento: string; edad: number; estado: EstudianteEstado; tutorId: string;
  tipo: TipoEstudiante; transporte: boolean; balance: number;
}
export interface Tutor {
  id: string; nombre: string; cedula: string; telefono: string; whatsapp: string;
  email: string; direccion: string;
  parentesco: "Madre" | "Padre" | "Tutor" | "Abuelo/a" | "Otro";
  estado: "Activo" | "Inactivo";
}
export interface Curso {
  id: string; nivel: "Inicial" | "Primaria" | "Secundaria"; grado: string; seccion: string;
  profesor: string; capacidad: number; mensualidad: number; estado: "Activo" | "Inactivo";
}
export interface Concepto {
  id: string; nombre: string; monto: number;
  aplicaA: "Todos" | "Curso específico" | "Estudiante específico";
  frecuencia: "Único" | "Mensual" | "Trimestral" | "Anual";
  estado: "Activo" | "Inactivo";
}
export interface Mensualidad {
  id: string; estudianteId: string; cursoId: string; conceptoId: string;
  mes: string; anio: number; base: number; descuento: number; mora: number;
  total: number; fechaLimite: string; estado: MensualidadEstado;
}
export interface Pago {
  id: string; recibo: string; estudianteId: string; tutorId: string;
  concepto: string; monto: number; metodo: MetodoPago;
  banco?: string; referencia?: string; fecha: string; estado: PagoEstado;
}
export interface Acuerdo {
  id: string; estudianteId: string; tutorId: string; adeudado: number; acordado: number;
  cuotas: number; cuotasPagadas: number; inicio: string; proximoPago: string;
  estado: "Activo" | "Cumplido" | "Incumplido" | "Cancelado"; notas: string;
}
export interface Inscripcion {
  id: string; estudianteId: string; tipo: "Inscripción" | "Reinscripción";
  anio: string; curso: string;
  documentos: { nombre: string; estado: "Pendiente" | "Recibido" | "Incompleto" | "Revisado" }[];
  monto: number; pagado: boolean;
  estado: "Pendiente" | "En revisión" | "Aprobado" | "Rechazado" | "Completado";
}
export interface Comunicado {
  id: string; titulo: string; mensaje: string; fecha: string;
  tipo: "Aviso general" | "Cobro" | "Reunión" | "Actividad" | "Suspensión de docencia" | "Emergencia" | "Recordatorio";
  destinatarios: string; estado: "Borrador" | "Publicado" | "Archivado";
}
export interface Ruta {
  id: string; nombre: string; chofer: string; telefono: string; vehiculo: string;
  placa: string; zona: string; estudiantes: string[]; costo: number;
  estado: "Activa" | "Inactiva";
}
export interface Gasto {
  id: string; categoria: string; descripcion: string; proveedor: string;
  monto: number; fecha: string; metodo: MetodoPago;
  estado: "Pendiente" | "Pagado" | "Anulado";
}

export const tutores: Tutor[] = [
  { id: "T001", nombre: "María Altagracia Peña", cedula: "001-1234567-8", telefono: "809-555-1201", whatsapp: "809-555-1201", email: "maria.pena@correo.do", direccion: "Calle Duarte #45, Santo Domingo", parentesco: "Madre", estado: "Activo" },
  { id: "T002", nombre: "José Ramón Fernández", cedula: "002-9876543-2", telefono: "829-444-3322", whatsapp: "829-444-3322", email: "jose.fernandez@correo.do", direccion: "Av. 27 de Febrero, Santiago", parentesco: "Padre", estado: "Activo" },
  { id: "T003", nombre: "Carmen Rosa Jiménez", cedula: "003-1122334-4", telefono: "849-222-1188", whatsapp: "849-222-1188", email: "carmen.jimenez@correo.do", direccion: "Calle El Sol #12, La Vega", parentesco: "Madre", estado: "Activo" },
  { id: "T004", nombre: "Pedro Luis Martínez", cedula: "001-5566778-9", telefono: "809-777-9911", whatsapp: "809-777-9911", email: "pedro.martinez@correo.do", direccion: "Calle Mella #78, San Cristóbal", parentesco: "Padre", estado: "Activo" },
  { id: "T005", nombre: "Ana Lucía Mercedes", cedula: "402-3344556-7", telefono: "829-888-4477", whatsapp: "829-888-4477", email: "ana.mercedes@correo.do", direccion: "Calle Central, La Romana", parentesco: "Tutor", estado: "Activo" },
  { id: "T006", nombre: "Ramón Antonio Rosario", cedula: "001-8899001-2", telefono: "809-333-2244", whatsapp: "809-333-2244", email: "ramon.rosario@correo.do", direccion: "Av. Independencia, Santo Domingo", parentesco: "Padre", estado: "Activo" },
  { id: "T007", nombre: "Luisa Marina Batista", cedula: "003-4455667-8", telefono: "849-111-9988", whatsapp: "849-111-9988", email: "luisa.batista@correo.do", direccion: "Calle Sánchez, La Vega", parentesco: "Madre", estado: "Activo" },
  { id: "T008", nombre: "Francisco Javier Núñez", cedula: "402-7788990-1", telefono: "809-666-3311", whatsapp: "809-666-3311", email: "fjavier.nunez@correo.do", direccion: "Calle Duvergé, La Romana", parentesco: "Padre", estado: "Activo" },
  { id: "T009", nombre: "Rosa Elena Guzmán", cedula: "002-1010203-4", telefono: "829-555-8899", whatsapp: "829-555-8899", email: "rosa.guzman@correo.do", direccion: "Av. Estrella Sadhalá, Santiago", parentesco: "Madre", estado: "Activo" },
  { id: "T010", nombre: "Miguel Ángel Reyes", cedula: "001-2020304-5", telefono: "809-999-1122", whatsapp: "809-999-1122", email: "miguel.reyes@correo.do", direccion: "Calle Arzobispo Nouel, Santo Domingo", parentesco: "Tutor", estado: "Activo" },
];

export const cursos: Curso[] = [
  { id: "C01", nivel: "Inicial", grado: "Pre-Kínder", seccion: "A", profesor: "Prof. Yesenia Cruz", capacidad: 20, mensualidad: 4500, estado: "Activo" },
  { id: "C02", nivel: "Inicial", grado: "Kínder", seccion: "A", profesor: "Prof. Marlene Ortiz", capacidad: 22, mensualidad: 4800, estado: "Activo" },
  { id: "C03", nivel: "Primaria", grado: "1ro", seccion: "A", profesor: "Prof. Julio Cabrera", capacidad: 28, mensualidad: 5500, estado: "Activo" },
  { id: "C04", nivel: "Primaria", grado: "2do", seccion: "A", profesor: "Prof. Isabel Duarte", capacidad: 28, mensualidad: 5500, estado: "Activo" },
  { id: "C05", nivel: "Primaria", grado: "3ro", seccion: "A", profesor: "Prof. Rafael Santana", capacidad: 30, mensualidad: 5800, estado: "Activo" },
  { id: "C06", nivel: "Primaria", grado: "4to", seccion: "A", profesor: "Prof. Wanda Alcántara", capacidad: 30, mensualidad: 5800, estado: "Activo" },
  { id: "C07", nivel: "Primaria", grado: "5to", seccion: "A", profesor: "Prof. Nelson Beltré", capacidad: 30, mensualidad: 6000, estado: "Activo" },
  { id: "C08", nivel: "Primaria", grado: "6to", seccion: "A", profesor: "Prof. Idalia Vásquez", capacidad: 30, mensualidad: 6000, estado: "Activo" },
  { id: "C09", nivel: "Secundaria", grado: "1ro Sec.", seccion: "A", profesor: "Prof. Hilario Peguero", capacidad: 32, mensualidad: 7000, estado: "Activo" },
  { id: "C10", nivel: "Secundaria", grado: "2do Sec.", seccion: "A", profesor: "Prof. Sonia Espinal", capacidad: 32, mensualidad: 7000, estado: "Activo" },
];

const nombresEst = [
  "Carlos Alberto Pérez", "Sofía Isabel Ramírez", "Luis Miguel Torres", "Andrea Camila Rosario",
  "Diego Alejandro Vargas", "Valentina Sofía Cruz", "Juan Pablo Guzmán", "Isabella Marie Núñez",
  "Mateo Nicolás Batista", "Camila Antonia Ortiz", "Sebastián José Mercedes", "Emma Lucía Reyes",
  "Alejandro Rafael Cabrera", "Victoria Elena Peña", "Samuel David Fernández", "Ariana Michelle Duarte",
  "Adrián Emilio Jiménez", "Gabriela Nicole Alcántara", "Nicolás Andrés Santana", "Renata Sophia Beltré",
  "Iván Manuel Vásquez", "Paula Antonia Peguero", "Emilio José Espinal", "Alessia Marie Rosario",
  "Marcos Antonio Guzmán", "Amaia Isabella Núñez", "Ángel Gabriel Batista", "Julieta Sofía Ortiz",
];

function generarEstudiantes(): Estudiante[] {
  const arr: Estudiante[] = [];
  const estados: EstudianteEstado[] = ["Activo","Activo","Activo","Activo","Activo","Pendiente","Inactivo"];
  const tipos: TipoEstudiante[] = ["Regular","Regular","Regular","Nuevo ingreso","Reingreso","Becado"];
  for (let i = 0; i < 28; i++) {
    const curso = cursos[i % cursos.length];
    const tutor = tutores[i % tutores.length];
    const edad = curso.nivel === "Inicial" ? 4 + (i % 2) : curso.nivel === "Primaria" ? 6 + (i % 6) : 12 + (i % 3);
    const anioNac = 2026 - edad;
    const fecha = `${anioNac}-0${(i % 9) + 1}-1${i % 9}`;
    const balance = i % 4 === 0 ? curso.mensualidad * (1 + (i % 3)) : i % 5 === 0 ? curso.mensualidad : 0;
    arr.push({
      id: `E${String(i + 1).padStart(3, "0")}`,
      codigo: `SP-2026-${String(1000 + i)}`,
      nombre: nombresEst[i % nombresEst.length],
      curso: curso.grado, seccion: curso.seccion,
      fechaNacimiento: fecha, edad,
      estado: estados[i % estados.length],
      tutorId: tutor.id, tipo: tipos[i % tipos.length],
      transporte: i % 3 === 0, balance,
    });
  }
  return arr;
}
export const estudiantes: Estudiante[] = generarEstudiantes();

export const conceptos: Concepto[] = [
  { id: "K01", nombre: "Mensualidad", monto: 5500, aplicaA: "Todos", frecuencia: "Mensual", estado: "Activo" },
  { id: "K02", nombre: "Inscripción", monto: 8000, aplicaA: "Todos", frecuencia: "Único", estado: "Activo" },
  { id: "K03", nombre: "Reinscripción", monto: 5000, aplicaA: "Todos", frecuencia: "Anual", estado: "Activo" },
  { id: "K04", nombre: "Materiales", monto: 3500, aplicaA: "Todos", frecuencia: "Anual", estado: "Activo" },
  { id: "K05", nombre: "Uniforme", monto: 4200, aplicaA: "Todos", frecuencia: "Único", estado: "Activo" },
  { id: "K06", nombre: "Transporte escolar", monto: 3000, aplicaA: "Estudiante específico", frecuencia: "Mensual", estado: "Activo" },
  { id: "K07", nombre: "Actividad especial", monto: 1500, aplicaA: "Curso específico", frecuencia: "Único", estado: "Activo" },
  { id: "K08", nombre: "Graduación", monto: 6500, aplicaA: "Curso específico", frecuencia: "Único", estado: "Activo" },
  { id: "K09", nombre: "Seguro escolar", monto: 1200, aplicaA: "Todos", frecuencia: "Anual", estado: "Activo" },
  { id: "K10", nombre: "Mora", monto: 500, aplicaA: "Todos", frecuencia: "Mensual", estado: "Activo" },
];

const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre"];

function generarMensualidades(): Mensualidad[] {
  const arr: Mensualidad[] = [];
  estudiantes.slice(0, 20).forEach((e, idx) => {
    const curso = cursos.find((c) => c.grado === e.curso) ?? cursos[0];
    for (let m = 0; m < 3; m++) {
      const estado: MensualidadEstado = m === 0 ? "Pagado" : m === 1 ? (idx % 2 === 0 ? "Pendiente" : "Pagado") : (idx % 3 === 0 ? "Vencido" : "Pendiente");
      const desc = e.tipo === "Becado" ? curso.mensualidad * 0.3 : 0;
      const mora = estado === "Vencido" ? 500 : 0;
      arr.push({
        id: `M${idx}-${m}`, estudianteId: e.id, cursoId: curso.id, conceptoId: "K01",
        mes: meses[m + 8], anio: 2026,
        base: curso.mensualidad, descuento: desc, mora,
        total: curso.mensualidad - desc + mora,
        fechaLimite: `2026-${String(m + 9).padStart(2, "0")}-10`,
        estado,
      });
    }
  });
  return arr;
}
export const mensualidades: Mensualidad[] = generarMensualidades();

export const pagos: Pago[] = estudiantes.slice(0, 15).map((e, i) => {
  const metodos: MetodoPago[] = ["Efectivo","Transferencia","Depósito","Tarjeta simulada"];
  const estados: PagoEstado[] = ["Validado","Validado","Validado","Pendiente de validación"];
  return {
    id: `P${String(i + 1).padStart(4, "0")}`,
    recibo: `REC-${String(2500 + i)}`,
    estudianteId: e.id, tutorId: e.tutorId,
    concepto: "Mensualidad Noviembre",
    monto: 5500 + (i % 3) * 500,
    metodo: metodos[i % 4],
    banco: i % 2 === 0 ? "Banco Popular" : "BanReservas",
    referencia: `TX${100000 + i}`,
    fecha: `2026-11-${String((i % 20) + 1).padStart(2, "0")}`,
    estado: estados[i % 4],
  };
});

export const acuerdos: Acuerdo[] = estudiantes.filter((e) => e.balance > 10000).slice(0, 4).map((e, i) => ({
  id: `A00${i + 1}`, estudianteId: e.id, tutorId: e.tutorId,
  adeudado: e.balance, acordado: e.balance, cuotas: 3, cuotasPagadas: i,
  inicio: "2026-10-01", proximoPago: "2026-12-01",
  estado: i === 3 ? "Cumplido" : "Activo" as const,
  notas: "Acuerdo firmado por el tutor.",
}));

export const inscripciones: Inscripcion[] = estudiantes.slice(0, 8).map((e, i) => ({
  id: `I00${i + 1}`, estudianteId: e.id,
  tipo: i % 2 === 0 ? "Inscripción" : "Reinscripción",
  anio: "2026-2027", curso: e.curso,
  documentos: [
    { nombre: "Acta de nacimiento", estado: i % 3 === 0 ? "Pendiente" : "Recibido" },
    { nombre: "Fotos 2x2", estado: "Recibido" },
    { nombre: "Récord de notas", estado: i % 2 === 0 ? "Recibido" : "Pendiente" },
    { nombre: "Certificado médico", estado: "Pendiente" },
    { nombre: "Copia cédula tutor", estado: "Recibido" },
    { nombre: "Formulario de inscripción", estado: "Revisado" },
  ],
  monto: i % 2 === 0 ? 8000 : 5000, pagado: i % 3 !== 0,
  estado: i % 5 === 0 ? "Aprobado" : i % 4 === 0 ? "En revisión" : "Pendiente",
}));

export const comunicados: Comunicado[] = [
  { id: "CM01", titulo: "Recordatorio de mensualidad de Noviembre", mensaje: "Estimados padres, les recordamos que la fecha límite de pago de la mensualidad es el día 10 de cada mes. Gracias por su puntualidad.", fecha: "2026-11-02", tipo: "Cobro", destinatarios: "Todos", estado: "Publicado" },
  { id: "CM02", titulo: "Reunión de padres 3er grado", mensaje: "Convocamos a los padres de 3ro de Primaria a la reunión del viernes 21 a las 5:00 PM en el salón principal.", fecha: "2026-11-15", tipo: "Reunión", destinatarios: "Curso 3ro Primaria", estado: "Publicado" },
  { id: "CM03", titulo: "Suspensión de docencia por lluvias", mensaje: "Debido a las condiciones climáticas, se suspende la docencia mañana. Cuídense mucho.", fecha: "2026-10-28", tipo: "Suspensión de docencia", destinatarios: "Todos", estado: "Publicado" },
  { id: "CM04", titulo: "Festival de talentos", mensaje: "Los invitamos al festival de talentos el sábado 6 de diciembre a las 10:00 AM.", fecha: "2026-11-20", tipo: "Actividad", destinatarios: "Todos", estado: "Borrador" },
  { id: "CM05", titulo: "Aviso a padres en mora", mensaje: "Hola, le recordamos que su hijo(a) tiene un balance pendiente. Puede realizar su pago por transferencia y enviar el comprobante. Gracias.", fecha: "2026-11-05", tipo: "Cobro", destinatarios: "Padres en mora", estado: "Publicado" },
];

export const rutas: Ruta[] = [
  { id: "R1", nombre: "Ruta Norte", chofer: "Domingo Encarnación", telefono: "809-555-7710", vehiculo: "Toyota Hiace", placa: "A123456", zona: "Los Alcarrizos", estudiantes: estudiantes.filter((e) => e.transporte).slice(0, 4).map((e) => e.id), costo: 3000, estado: "Activa" },
  { id: "R2", nombre: "Ruta Este", chofer: "Rafael Mateo", telefono: "829-444-1122", vehiculo: "Nissan Urvan", placa: "B778899", zona: "San Isidro", estudiantes: estudiantes.filter((e) => e.transporte).slice(4, 8).map((e) => e.id), costo: 3000, estado: "Activa" },
  { id: "R3", nombre: "Ruta Oeste", chofer: "Miguel Sosa", telefono: "849-222-3344", vehiculo: "Toyota Coaster", placa: "C112233", zona: "Herrera", estudiantes: estudiantes.filter((e) => e.transporte).slice(8).map((e) => e.id), costo: 3500, estado: "Activa" },
];

export const gastos: Gasto[] = [
  { id: "G001", categoria: "Nómina", descripcion: "Pago de nómina docente Noviembre", proveedor: "Interno", monto: 185000, fecha: "2026-11-05", metodo: "Transferencia", estado: "Pagado" },
  { id: "G002", categoria: "Servicios", descripcion: "Electricidad", proveedor: "Edeeste", monto: 24500, fecha: "2026-11-08", metodo: "Transferencia", estado: "Pagado" },
  { id: "G003", categoria: "Servicios", descripcion: "Internet fibra óptica", proveedor: "Altice", monto: 4500, fecha: "2026-11-10", metodo: "Tarjeta simulada", estado: "Pagado" },
  { id: "G004", categoria: "Materiales", descripcion: "Compra de tinta y papel", proveedor: "Librería Cuesta", monto: 8200, fecha: "2026-11-12", metodo: "Efectivo", estado: "Pagado" },
  { id: "G005", categoria: "Alquiler", descripcion: "Alquiler local", proveedor: "Inversiones RM", monto: 45000, fecha: "2026-11-01", metodo: "Transferencia", estado: "Pagado" },
  { id: "G006", categoria: "Mantenimiento", descripcion: "Reparación aire acondicionado", proveedor: "Servicios FríoTech", monto: 6800, fecha: "2026-11-14", metodo: "Efectivo", estado: "Pendiente" },
  { id: "G007", categoria: "Limpieza", descripcion: "Insumos de limpieza", proveedor: "Distribuidora La Sirena", monto: 5400, fecha: "2026-11-16", metodo: "Depósito", estado: "Pagado" },
];

export const ingresosMensuales = [
  { mes: "May", ingresos: 285000, gastos: 220000 },
  { mes: "Jun", ingresos: 302000, gastos: 235000 },
  { mes: "Jul", ingresos: 195000, gastos: 180000 },
  { mes: "Ago", ingresos: 340000, gastos: 260000 },
  { mes: "Sep", ingresos: 365000, gastos: 275000 },
  { mes: "Oct", ingresos: 358000, gastos: 268000 },
  { mes: "Nov", ingresos: 312000, gastos: 279000 },
];

export const morosidadPorMes = [
  { mes: "Jul", monto: 42000 },
  { mes: "Ago", monto: 51000 },
  { mes: "Sep", monto: 68000 },
  { mes: "Oct", monto: 74000 },
  { mes: "Nov", monto: 92000 },
];

export function nivelRiesgo(dias: number): NivelRiesgo {
  if (dias >= 90) return "Crítico";
  if (dias >= 60) return "Alto";
  if (dias >= 30) return "Medio";
  return "Bajo";
}

export function estudianteById(id: string) { return estudiantes.find((e) => e.id === id); }
export function tutorById(id: string) { return tutores.find((t) => t.id === id); }
export function cursoByGrado(grado: string) { return cursos.find((c) => c.grado === grado); }

export const configuracionDefault = {
  nombre: "Colegio Luz del Saber",
  logo: "LS",
  rnc: "1-30-12345-6",
  telefono: "809-555-0100",
  whatsapp: "809-555-0100",
  email: "info@colegioluzdelsaber.do",
  direccion: "Av. Independencia #234, Santo Domingo, RD",
  director: "Lic. Miriam Santana",
  anioEscolar: "2026-2027",
  diaLimite: 10,
  moraPorcentaje: 5,
  colorMarca: "#0891b2",
  banco: "Banco Popular",
  cuenta: "728-45123-9",
  tipoCuenta: "Corriente",
  reciboTexto: "Gracias por su pago puntual. Este recibo es válido como comprobante escolar.",
  mensajeBienvenida: "Bienvenidos a la plataforma de padres del Colegio Luz del Saber.",
};
export type Configuracion = typeof configuracionDefault;

export function formatRD(n: number): string {
  return "RD$" + new Intl.NumberFormat("es-DO", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}
