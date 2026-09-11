import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ReporteFinancieroService } from '../../../core/services/reporte-financiero.service';
import { CobroService } from '../../../core/services/cobro.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { ReporteFinanciero } from '../../../core/models/reporte-financiero.models';
import { Cobro } from '../../../core/models/cobro.models';
import { Paciente } from '../../../core/models/paciente.models';

type Periodo = 'hoy' | 'semana' | 'mes' | 'personalizado';

function hoyIso(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

function sumarDias(fechaIso: string, dias: number): string {
  const fecha = new Date(`${fechaIso}T00:00:00`);
  fecha.setDate(fecha.getDate() + dias);
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

function primerDiaDelMesIso(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-01`;
}

function inicioSemanaIso(fechaIso: string): string {
  const fecha = new Date(`${fechaIso}T00:00:00`);
  const diaSemana = fecha.getDay();
  const offsetHastaLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
  return sumarDias(fechaIso, offsetHastaLunes);
}

function finSemanaIso(fechaIso: string): string {
  return sumarDias(inicioSemanaIso(fechaIso), 6);
}

@Component({
  selector: 'app-dashboard-financiero',
  imports: [RouterLink, ReactiveFormsModule, DecimalPipe],
  templateUrl: './dashboard-financiero.component.html'
})
export class DashboardFinancieroComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly reporteService = inject(ReporteFinancieroService);
  private readonly cobroService = inject(CobroService);
  private readonly pacienteService = inject(PacienteService);

  protected readonly periodo = signal<Periodo>('hoy');
  protected readonly reporte = signal<ReporteFinanciero | null>(null);
  protected readonly cobrosRecientes = signal<Cobro[]>([]);
  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly filtroPersonalizado = this.fb.group({
    desde: [hoyIso()],
    hasta: [hoyIso()]
  });

  ngOnInit(): void {
    this.pacienteService.listar().subscribe((datos) => this.pacientes.set(datos));
    this.cargar();
  }

  private rangoDelPeriodo(): { desde: string; hasta: string } {
    const hoy = hoyIso();
    switch (this.periodo()) {
      case 'hoy':
        return { desde: hoy, hasta: hoy };
      case 'semana':
        return { desde: inicioSemanaIso(hoy), hasta: finSemanaIso(hoy) };
      case 'mes':
        return { desde: primerDiaDelMesIso(), hasta: hoy };
      case 'personalizado': {
        const valores = this.filtroPersonalizado.getRawValue();
        return { desde: valores.desde ?? hoy, hasta: valores.hasta ?? hoy };
      }
    }
  }

  cambiarPeriodo(periodo: Periodo): void {
    this.periodo.set(periodo);
    if (periodo !== 'personalizado') {
      this.cargar();
    }
  }

  aplicarPersonalizado(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    const { desde, hasta } = this.rangoDelPeriodo();

    this.reporteService.generar(desde, hasta).subscribe({
      next: (datos) => {
        this.reporte.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });

    this.cobroService.listarPorRango(desde, hasta, null, null).subscribe((cobros) => {
      this.cobrosRecientes.set(cobros.sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 5));
    });
  }

  fechaParaVerTodos(): string {
    const primerCobro = this.cobrosRecientes()[0];
    return primerCobro ? primerCobro.fecha.slice(0, 10) : hoyIso();
  }

  nombrePaciente(idPaciente: number): string {
    const paciente = this.pacientes().find((p) => p.idPaciente === idPaciente);
    return paciente ? `${paciente.nombre} ${paciente.apellido}` : `#${idPaciente}`;
  }

  formatoFecha(fecha: string): string {
    const [fechaParte, horaParte] = fecha.split('T');
    const [anio, mes, dia] = fechaParte.split('-');
    return `${dia}-${mes}-${anio} ${horaParte.slice(0, 5)}`;
  }
}
