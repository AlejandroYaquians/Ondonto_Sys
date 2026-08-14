import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConsultaNotaService } from '../../../../core/services/consulta-nota.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ConsultaNota } from '../../../../core/models/consulta.models';

@Component({
  selector: 'app-notas-seccion',
  imports: [ReactiveFormsModule],
  templateUrl: './notas-seccion.component.html'
})
export class NotasSeccionComponent implements OnInit {
  @Input({ required: true }) idConsulta!: number;
  @Input({ required: true }) idDoctorConsulta!: number;

  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ConsultaNotaService);
  private readonly authService = inject(AuthService);

  protected readonly items = signal<ConsultaNota[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarFormulario = signal(false);
  protected readonly idEditando = signal<number | null>(null);

  protected readonly formulario = this.fb.group({
    nota: ['', Validators.required]
  });

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.service.listarPorConsulta(this.idConsulta).subscribe({
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

  nuevo(): void {
    this.idEditando.set(null);
    this.formulario.reset({ nota: '' });
    this.mostrarFormulario.set(true);
  }

  editar(item: ConsultaNota): void {
    this.idEditando.set(item.idNota);
    this.formulario.setValue({ nota: item.nota });
    this.mostrarFormulario.set(true);
  }

  cancelar(): void {
    this.mostrarFormulario.set(false);
    this.idEditando.set(null);
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const idUsuario = this.authService.idUsuario();
    if (!idUsuario) {
      this.error.set('No se pudo determinar el usuario actual. Vuelva a iniciar sesión.');
      return;
    }

    const request = {
      nota: this.formulario.getRawValue().nota ?? '',
      idConsulta: this.idConsulta,
      idDoctor: this.idDoctorConsulta,
      idUsuarioCreacion: idUsuario
    };

    const id = this.idEditando();
    const operacion = id ? this.service.actualizar(id, request) : this.service.crear(request);

    operacion.subscribe({
      next: () => {
        this.cancelar();
        this.cargar();
      },
      error: () => this.error.set('Error al guardar.')
    });
  }

  eliminar(item: ConsultaNota): void {
    if (!window.confirm('¿Desea eliminar esta nota?')) {
      return;
    }
    this.service.eliminar(item.idNota).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('Error al eliminar.')
    });
  }
}
