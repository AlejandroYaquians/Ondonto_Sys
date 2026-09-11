import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HistorialClinicoService } from '../../../../core/services/historial-clinico.service';
import { DoctorService } from '../../../../core/services/doctor.service';
import { HistorialClinico } from '../../../../core/models/historial-clinico.models';
import { Doctor } from '../../../../core/models/doctor.models';

@Component({
  selector: 'app-historial-clinico-seccion',
  imports: [RouterLink],
  templateUrl: './historial-clinico-seccion.component.html'
})
export class HistorialClinicoSeccionComponent implements OnInit {
  @Input({ required: true }) idPaciente!: number;

  private readonly historialClinicoService = inject(HistorialClinicoService);
  private readonly doctorService = inject(DoctorService);

  protected readonly items = signal<HistorialClinico[]>([]);
  protected readonly doctores = signal<Doctor[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.doctorService.listar().subscribe((datos) => this.doctores.set(datos));
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.historialClinicoService.listarPorPaciente(this.idPaciente).subscribe({
      next: (datos) => {
        this.items.set(datos.sort((a, b) => b.fecha.localeCompare(a.fecha)));
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  nombreDoctor(idDoctor: number): string {
    const doctor = this.doctores().find((d) => d.idDoctor === idDoctor);
    return doctor ? `Dr(a). ${doctor.nombre} ${doctor.apellido}` : `#${idDoctor}`;
  }

  resumen(descripcion: string): string {
    return descripcion.length > 80 ? descripcion.slice(0, 80) + '…' : descripcion;
  }

  formatoFecha(fecha: string): string {
    const [fechaParte, horaParte] = fecha.split('T');
    const [anio, mes, dia] = fechaParte.split('-');
    return `${dia}-${mes}-${anio} ${horaParte.slice(0, 5)}`;
  }
}
