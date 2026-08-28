import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CobroService } from '../../../../core/services/cobro.service';
import { PacienteService } from '../../../../core/services/paciente.service';
import { DoctorService } from '../../../../core/services/doctor.service';
import { CatalogosService } from '../../../../core/services/catalogos.service';
import { Cobro } from '../../../../core/models/cobro.models';
import { Paciente } from '../../../../core/models/paciente.models';
import { Doctor } from '../../../../core/models/doctor.models';
import { CatMetodoPago, Servicio } from '../../../../core/models/catalogo.models';

@Component({
  selector: 'app-cobro-detalle',
  imports: [RouterLink],
  templateUrl: './cobro-detalle.component.html'
})
export class CobroDetalleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly cobroService = inject(CobroService);
  private readonly pacienteService = inject(PacienteService);
  private readonly doctorService = inject(DoctorService);
  private readonly catalogosService = inject(CatalogosService);

  protected readonly cobro = signal<Cobro | null>(null);
  protected readonly paciente = signal<Paciente | null>(null);
  protected readonly doctor = signal<Doctor | null>(null);
  protected readonly metodosPago = signal<CatMetodoPago[]>([]);
  protected readonly servicios = signal<Servicio[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.catalogosService.metodosPago().subscribe((datos) => this.metodosPago.set(datos));
    this.catalogosService.servicios().subscribe((datos) => this.servicios.set(datos));

    this.cobroService.buscarPorId(id).subscribe({
      next: (cobro) => {
        this.cobro.set(cobro);
        this.pacienteService.buscarPorId(cobro.idPaciente).subscribe((datos) => this.paciente.set(datos));
        if (cobro.idDoctor) {
          this.doctorService.buscarPorId(cobro.idDoctor).subscribe((datos) => this.doctor.set(datos));
        }
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  nombreServicio(idServicio: number | null): string {
    if (!idServicio) {
      return '—';
    }
    return this.servicios().find((s) => s.idServicio === idServicio)?.nombre ?? `#${idServicio}`;
  }

  nombreMetodoPago(id: number): string {
    return this.metodosPago().find((m) => m.idMetodoPago === id)?.nombre ?? `#${id}`;
  }

  formatoFecha(fecha: string): string {
    return fecha.slice(0, 16).replace('T', ' ');
  }

  anular(): void {
    const cobro = this.cobro();
    if (!cobro || !window.confirm('¿Desea anular este cobro?')) {
      return;
    }
    this.cobroService.cambiarEstado(cobro.idCobro, 'anulado').subscribe({
      next: (actualizado) => this.cobro.set(actualizado),
      error: () => this.error.set('Error al guardar.')
    });
  }
}
