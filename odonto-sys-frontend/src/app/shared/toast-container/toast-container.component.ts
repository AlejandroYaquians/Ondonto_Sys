import { Component, inject } from '@angular/core';
import { NotificacionService } from '../../core/services/notificacion.service';

@Component({
  selector: 'app-toast-container',
  imports: [],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss'
})
export class ToastContainerComponent {
  protected readonly notificacionService = inject(NotificacionService);
}
