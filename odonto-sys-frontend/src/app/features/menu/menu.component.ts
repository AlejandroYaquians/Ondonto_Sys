import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.component.html'
})
export class MenuComponent {
  protected readonly authService = inject(AuthService);
}
