import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConsultaService } from '../../../core/services/consulta.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { Consulta } from '../../../core/models/consulta.models';
import { Paciente } from '../../../core/models/paciente.models';
import { Doctor } from '../../../core/models/doctor.models';
import { DiagnosticosSeccionComponent } from './secciones/diagnosticos-seccion.component';
import { TratamientosSeccionComponent } from './secciones/tratamientos-seccion.component';
import { RecetasSeccionComponent } from './secciones/recetas-seccion.component';
import { NotasSeccionComponent } from './secciones/notas-seccion.component';

@Component({
  selector: 'app-consulta-detalle',
  imports: [RouterLink, DiagnosticosSeccionComponent, TratamientosSeccionComponent, RecetasSeccionComponent, NotasSeccionComponent],
  templateUrl: './consulta-detalle.component.html'
})
export class ConsultaDetalleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly consultaService = inject(ConsultaService);
  private readonly pacienteService = inject(PacienteService);
  private readonly doctorService = inject(DoctorService);

  protected readonly consulta = signal<Consulta | null>(null);
  protected readonly paciente = signal<Paciente | null>(null);
  protected readonly doctor = signal<Doctor | null>(null);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.consultaService.buscarPorId(id).subscribe({
      next: (consulta) => {
        this.consulta.set(consulta);
        this.pacienteService.buscarPorId(consulta.idPaciente).subscribe((datos) => this.paciente.set(datos));
        this.doctorService.buscarPorId(consulta.idDoctor).subscribe((datos) => this.doctor.set(datos));
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  formatoFecha(fecha: string): string {
    return fecha.slice(0, 16).replace('T', ' ');
  }
}
