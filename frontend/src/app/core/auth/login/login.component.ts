import { Component, Input, WritableSignal } from '@angular/core';
import { AuthScreens } from '../auth.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  @Input({ required: true }) changeScreenSignal!: WritableSignal<AuthScreens>;

  onChangeScreenClick(): void {
    this.changeScreenSignal.set(AuthScreens.SIGN_UP);
  }
}
