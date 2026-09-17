import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import autoTable from 'jspdf-autotable';
import { PacienteService } from '../../../core/services/paciente.service';
import { CatalogosService } from '../../../core/services/catalogos.service';
import { AuthService } from '../../../core/services/auth.service';
import { HistorialClinicoService } from '../../../core/services/historial-clinico.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { ContactoPacienteService } from '../../../core/services/contacto-paciente.service';
import { AntecedenteMedicoService } from '../../../core/services/antecedente-medico.service';
import { ESTILO_TABLA_PDF, PdfService } from '../../../core/services/pdf.service';
import { Paciente } from '../../../core/models/paciente.models';
import { CatAfeccion, CatGenero, CatParentesco, CatProfesion, Departamento, Municipio } from '../../../core/models/catalogo.models';
import { HistorialClinico } from '../../../core/models/historial-clinico.models';
import { Doctor } from '../../../core/models/doctor.models';
import { ContactoPaciente } from '../../../core/models/contacto-paciente.models';
import { AntecedenteMedico } from '../../../core/models/antecedente-medico.models';
import { ContactosSeccionComponent } from './secciones/contactos-seccion.component';
import { AntecedentesSeccionComponent } from './secciones/antecedentes-seccion.component';
import { HistorialClinicoSeccionComponent } from './secciones/historial-clinico-seccion.component';
import { RecetasSeccionComponent } from './secciones/recetas-seccion.component';
import { CobrosSeccionComponent } from './secciones/cobros-seccion.component';

function calcularEdad(fechaNacimiento: string): number | null {
  if (!fechaNacimiento) {
    return null;
  }
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const aunNoCumple =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
  if (aunNoCumple) {
    edad--;
  }
  return edad;
}

type PestanaExpediente = 'datos' | 'antecedentes' | 'historialClinico' | 'recetas' | 'cobros';

@Component({
  selector: 'app-paciente-detalle',
  imports: [
    RouterLink,
    ContactosSeccionComponent,
    AntecedentesSeccionComponent,
    HistorialClinicoSeccionComponent,
    RecetasSeccionComponent,
    CobrosSeccionComponent
  ],
  templateUrl: './paciente-detalle.component.html'
})
export class PacienteDetalleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly pacienteService = inject(PacienteService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly authService = inject(AuthService);
  private readonly historialClinicoService = inject(HistorialClinicoService);
  private readonly doctorService = inject(DoctorService);
  private readonly contactoPacienteService = inject(ContactoPacienteService);
  private readonly antecedenteMedicoService = inject(AntecedenteMedicoService);
  private readonly pdfService = inject(PdfService);

  protected readonly paciente = signal<Paciente | null>(null);
  protected readonly generos = signal<CatGenero[]>([]);
  protected readonly profesiones = signal<CatProfesion[]>([]);
  protected readonly municipios = signal<Municipio[]>([]);
  protected readonly departamentos = signal<Departamento[]>([]);
  protected readonly doctores = signal<Doctor[]>([]);
  protected readonly parentescos = signal<CatParentesco[]>([]);
  protected readonly afecciones = signal<CatAfeccion[]>([]);
  protected readonly historialParaExportar = signal<HistorialClinico[]>([]);
  protected readonly contactosParaExportar = signal<ContactoPaciente[]>([]);
  protected readonly antecedentesParaExportar = signal<AntecedenteMedico[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly esDoctor = computed(() => this.authService.rol() === 'DOCTOR');
  protected readonly pestanaActiva = signal<PestanaExpediente>('datos');

  protected readonly edad = computed(() => {
    const p = this.paciente();
    return p?.fechaNacimiento ? calcularEdad(p.fechaNacimiento) : null;
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.catalogosService.generos().subscribe((datos) => this.generos.set(datos));
    this.catalogosService.profesiones().subscribe((datos) => this.profesiones.set(datos));
    this.catalogosService.municipios().subscribe((datos) => this.municipios.set(datos));
    this.catalogosService.departamentos().subscribe((datos) => this.departamentos.set(datos));
    this.catalogosService.parentescos().subscribe((datos) => this.parentescos.set(datos));
    this.catalogosService.afecciones().subscribe((datos) => this.afecciones.set(datos));
    this.doctorService.listar().subscribe((datos) => this.doctores.set(datos));

    this.pacienteService.buscarPorId(id).subscribe({
      next: (paciente) => {
        this.paciente.set(paciente);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  cambiarPestana(pestana: PestanaExpediente): void {
    this.pestanaActiva.set(pestana);
  }

  nombreGenero(id: number | null): string {
    if (!id) {
      return '-';
    }
    return this.generos().find((g) => g.idGenero === id)?.nombre ?? '-';
  }

  nombreProfesion(id: number | null): string {
    if (!id) {
      return '-';
    }
    return this.profesiones().find((p) => p.idProfesion === id)?.nombre ?? '-';
  }

  nombreMunicipio(id: number | null): string {
    if (!id) {
      return '-';
    }
    const municipio = this.municipios().find((m) => m.idMunicipio === id);
    if (!municipio) {
      return '-';
    }
    const departamento = this.departamentos().find((d) => d.idDepartamento === municipio.idDepartamento);
    return departamento ? `${municipio.nombre}, ${departamento.nombre}` : municipio.nombre;
  }

  formatoFecha(fecha: string): string {
    if (!fecha) {
      return '-';
    }
    const [fechaParte, horaParte] = fecha.split('T');
    const [anio, mes, dia] = fechaParte.split('-');
    return `${dia}-${mes}-${anio} ${horaParte.slice(0, 5)}`;
  }

  fechaDiaMesAnio(fechaIso: string | null): string {
    if (!fechaIso) {
      return '-';
    }
    const [anio, mes, dia] = fechaIso.split('-');
    return `${dia}-${mes}-${anio}`;
  }

  nombreDoctor(idDoctor: number): string {
    const doctor = this.doctores().find((d) => d.idDoctor === idDoctor);
    return doctor ? `Dr(a). ${doctor.nombre} ${doctor.apellido}` : `#${idDoctor}`;
  }

  nombreParentesco(id: number | null): string {
    if (!id) {
      return '-';
    }
    return this.parentescos().find((p) => p.idParentesco === id)?.nombre ?? '-';
  }

  nombreAfeccion(idAfeccion: number): string {
    return this.afecciones().find((a) => a.idAfeccion === idAfeccion)?.nombreAfeccion ?? `#${idAfeccion}`;
  }

  exportarPdf(): void {
    const p = this.paciente();
    if (!p) {
      return;
    }
    forkJoin({
      historial: this.historialClinicoService.listarPorPaciente(p.idPaciente),
      contactos: this.contactoPacienteService.listarPorPaciente(p.idPaciente),
      antecedentes: this.antecedenteMedicoService.listarPorPaciente(p.idPaciente)
    }).subscribe(({ historial, contactos, antecedentes }) => {
      this.historialParaExportar.set(historial.sort((a, b) => b.fecha.localeCompare(a.fecha)));
      this.contactosParaExportar.set(contactos);
      this.antecedentesParaExportar.set(antecedentes);
      this.generarPdf(p);
    });
  }

  private async generarPdf(p: Paciente): Promise<void> {
    const { doc, primeraLineaY } = await this.pdfService.crearDocumento('Expediente del Paciente');
    let y = primeraLineaY;

    autoTable(doc, {
      ...ESTILO_TABLA_PDF,
      startY: y,
      columnStyles: { 0: { fontStyle: 'bold' }, 2: { fontStyle: 'bold' } },
      body: [
        ['Paciente', `${p.nombre} ${p.apellido}`, 'Edad', String(this.edad() ?? 0)],
        ['Fecha de nacimiento', this.fechaDiaMesAnio(p.fechaNacimiento), 'Género', this.nombreGenero(p.idGenero)],
        ['Profesión', this.nombreProfesion(p.idProfesion), 'Teléfono', p.telefono || '-'],
        ['Correo', p.email || '-', 'Municipio', this.nombreMunicipio(p.idMunicipio)],
        ['Dirección', p.direccion || '-', '', '']
      ]
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Contactos adicionales', 14, y);
    y += 4;

    const contactos = this.contactosParaExportar();
    autoTable(doc, {
      ...ESTILO_TABLA_PDF,
      startY: y,
      head: [['Nombre', 'Teléfono', 'Parentesco']],
      body:
        contactos.length === 0
          ? [['Sin contactos registrados.', '', '']]
          : contactos.map((c) => [c.nombreCompleto, c.telefonoContacto || '-', this.nombreParentesco(c.idParentesco)])
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Antecedentes médicos', 14, y);
    y += 4;

    const antecedentes = this.antecedentesParaExportar();
    autoTable(doc, {
      ...ESTILO_TABLA_PDF,
      startY: y,
      head: [['Afección', 'Detalle']],
      body:
        antecedentes.length === 0
          ? [['Sin antecedentes registrados.', '']]
          : antecedentes.map((a) => [this.nombreAfeccion(a.idAfeccion), a.observacionDetalle || '-'])
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Historial clínico', 14, y);
    y += 4;

    const historial = this.historialParaExportar();
    autoTable(doc, {
      ...ESTILO_TABLA_PDF,
      startY: y,
      head: [['Fecha', 'Doctor', 'Descripción']],
      body:
        historial.length === 0
          ? [['Sin registros en el historial clínico.', '', '']]
          : historial.map((h) => [this.formatoFecha(h.fecha), this.nombreDoctor(h.idDoctor), h.descripcion])
    });

    this.pdfService.abrir(doc, `Expediente_${p.nombre}_${p.apellido}.pdf`);
  }
}
