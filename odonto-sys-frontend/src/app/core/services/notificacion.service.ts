import { Injectable, signal } from '@angular/core';

export interface Notificacion {
  id: number;
  mensaje: string;
  tipo: 'exito' | 'error';
}

const DURACION_MS = 4000;

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private contador = 0;

  readonly notificaciones = signal<Notificacion[]>([]);

  exito(mensaje: string): void {
    this.mostrar(mensaje, 'exito');
  }

  error(mensaje: string): void {
    this.mostrar(mensaje, 'error');
  }

  cerrar(id: number): void {
    this.notificaciones.update((actuales) => actuales.filter((n) => n.id !== id));
  }

  private mostrar(mensaje: string, tipo: 'exito' | 'error'): void {
    const id = ++this.contador;
    this.notificaciones.update((actuales) => [...actuales, { id, mensaje, tipo }]);
    setTimeout(() => this.cerrar(id), DURACION_MS);
  }
}
