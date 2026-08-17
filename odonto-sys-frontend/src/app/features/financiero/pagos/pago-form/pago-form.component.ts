import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PagoService } from '../../../../core/services/pago.service';
import { PacienteService } from '../../../../core/services/paciente.service';
import { CatalogosService } from '../../../../core/services/catalogos.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PagoRequest } from '../../../../core/models/pago.models';
import { Paciente } from '../../../../core/models/paciente.models';
import { CatMetodoPago } from '../../../../core/models/catalogo.models';
import { BuscadorSelectComponent } from '../../../../shared/buscador-select/buscador-select.component';

@Component({
  selector: 'app-pago-form',
  imports: [ReactiveFormsModule, RouterLink, BuscadorSelectComponent],
  templateUrl: './pago-form.component.html'
})
export class PagoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly pagoService = inject(PagoService);
  private readonly pacienteService = inject(PacienteService);
  private readonly catalogosService = inject(CatalogosService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly idPago = signal<number | null>(null);
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly metodosPago = signal<CatMetodoPago[]>([]);

  protected readonly opcionesPacientes = computed(() =>
    this.pacientes().map((p) => ({ valor: p.idPaciente, etiqueta: `${p.nombre} ${p.apellido}` }))
  );

  protected readonly formulario = this.fb.group({
    idPaciente: [null as number | null, Validators.required],
    idMetodoPago: [null as number | null, Validators.required],
    montoEfectivo: [null as number | null],
    montoTarjeta: [null as number | null],
    comisionTarjeta: [null as number | null],
    costoLaboratorio: [null as number | null],
    montoBruto: [null as number | null],
    montoNeto: [null as number | null]
  });

  ngOnInit(): void {
    this.pacienteService.listar().subscribe((datos) => this.pacientes.set(datos.filter((p) => p.activo)));
    this.catalogosService.metodosPago().subscribe((datos) => this.metodosPago.set(datos));

    const parametroId = this.route.snapshot.paramMap.get('id');
    if (parametroId) {
      const id = Number(parametroId);
      this.idPago.set(id);
      this.cargarPago(id);
    }
  }

  private cargarPago(id: number): void {
    this.cargando.set(true);
    this.pagoService.buscarPorId(id).subscribe({
      next: (pago) => {
        this.formulario.patchValue({
          idPaciente: pago.idPaciente,
          idMetodoPago: pago.idMetodoPago,
          montoEfectivo: pago.montoEfectivo,
          montoTarjeta: pago.montoTarjeta,
          comisionTarjeta: pago.comisionTarjeta,
          costoLaboratorio: pago.costoLaboratorio,
          montoBruto: pago.montoBruto,
          montoNeto: pago.montoNeto
        });
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar.');
        this.cargando.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const idUsuario = this.authService.idUsuario();
    if (!idUsuario) {
      this.error.set('Error al guardar.');
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const valores = this.formulario.getRawValue();
    const request: PagoRequest = {
      idPaciente: valores.idPaciente as number,
      idMetodoPago: valores.idMetodoPago as number,
      montoEfectivo: valores.montoEfectivo,
      montoTarjeta: valores.montoTarjeta,
      comisionTarjeta: valores.comisionTarjeta,
      costoLaboratorio: valores.costoLaboratorio,
      montoBruto: valores.montoBruto,
      montoNeto: valores.montoNeto,
      idUsuario
    };

    const id = this.idPago();
    const operacion = id ? this.pagoService.actualizar(id, request) : this.pagoService.crear(request);

    operacion.subscribe({
      next: (pago) => this.router.navigateByUrl(`/pagos/${pago.idPago}`),
      error: (err) => {
        this.guardando.set(false);
        this.error.set(err?.error?.mensaje ?? 'Error al guardar.');
      }
    });
  }
}
