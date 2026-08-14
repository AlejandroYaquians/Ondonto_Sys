import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, computed, signal } from '@angular/core';

export interface OpcionBuscador {
  valor: number;
  etiqueta: string;
}

@Component({
  selector: 'app-buscador-select',
  imports: [],
  templateUrl: './buscador-select.component.html',
  styleUrl: './buscador-select.component.scss'
})
export class BuscadorSelectComponent implements OnChanges {
  @Input() opciones: OpcionBuscador[] = [];
  @Input() valorSeleccionado: number | null = null;
  @Input() placeholder = 'Buscar...';
  @Output() seleccionCambio = new EventEmitter<number | null>();

  protected readonly termino = signal('');
  protected readonly abierto = signal(false);

  protected readonly opcionesFiltradas = computed(() => {
    const texto = this.termino().trim().toLowerCase();
    if (!texto) {
      return this.opciones;
    }
    return this.opciones.filter((opcion) => opcion.etiqueta.toLowerCase().includes(texto));
  });

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['valorSeleccionado'] || changes['opciones']) && !this.abierto()) {
      this.sincronizarTexto();
    }
  }

  private sincronizarTexto(): void {
    const opcion = this.opciones.find((o) => o.valor === this.valorSeleccionado);
    this.termino.set(opcion?.etiqueta ?? '');
  }

  enfocar(): void {
    this.abierto.set(true);
    this.termino.set('');
  }

  escribir(valor: string): void {
    this.termino.set(valor);
  }

  seleccionar(opcion: OpcionBuscador): void {
    this.termino.set(opcion.etiqueta);
    this.abierto.set(false);
    this.seleccionCambio.emit(opcion.valor);
  }

  cerrar(): void {
    this.abierto.set(false);
    this.sincronizarTexto();
  }
}
