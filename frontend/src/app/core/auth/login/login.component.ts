import {
  Component,
  DestroyRef,
  effect,
  Input,
  WritableSignal,
} from '@angular/core';
import { AuthScreens } from '../auth.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NotifierService } from '../../services/notifier.service';
import { UserLogin } from '../models/user-login.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroupValidationDirective } from '../../../shared/directives/form-group-validation.directive';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormGroupValidationDirective, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  @Input({ required: true }) changeScreenSignal!: WritableSignal<AuthScreens>;

  readonly loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notifierService: NotifierService,
    private readonly destroyRef: DestroyRef,
  ) {
    effect(async () => {
      if (this.authService.loginSuccess()) {
        this.notifierService.showSuccessMessage('Logged in', '');
        await this.router.navigate(['/home']);
        this.authService.loginSuccess.set(false);
      }
    });
  }

  onChangeScreenClick(): void {
    this.changeScreenSignal.set(AuthScreens.SIGN_UP);
  }

  onLoginClick(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    console.log('sending request');
    const payload: UserLogin = this.loginForm.getRawValue();
    this.authService
      .login$(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(console.log);
  }
}
