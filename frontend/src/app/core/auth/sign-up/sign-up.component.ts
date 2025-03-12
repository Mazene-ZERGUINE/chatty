import { Component, Input, WritableSignal } from '@angular/core';
import { AuthScreens } from '../auth.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  @Input({ required: true }) changeScreenSignal!: WritableSignal<AuthScreens>;

  onChangeScreenClick(): void {
    this.changeScreenSignal.set(AuthScreens.SIGN_IN);
  }
}
