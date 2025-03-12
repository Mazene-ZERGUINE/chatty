import { Component, signal, WritableSignal } from '@angular/core';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';

export enum AuthScreens {
  SIGN_IN = 'sign_in',
  SIGN_UP = 'sign_up',
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [SignUpComponent, LoginComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  screenSignal: WritableSignal<AuthScreens> = signal(AuthScreens.SIGN_IN);
  protected readonly AuthScreens = AuthScreens;
}
