import {
  Component,
  DestroyRef,
  effect,
  inject,
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
import { UserRegister } from '../models/user-register.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
//
import { FormGroupValidationDirective } from '../../../shared/directives/form-group-validation.directive';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, FormGroupValidationDirective, NgClass, NgIf],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  @Input({ required: true }) changeScreenSignal!: WritableSignal<AuthScreens>;

  readonly registerFrom: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    countryCode: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{1,10}$'),
      Validators.maxLength(10),
      Validators.minLength(10),
    ]),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required),
  });

  private readonly authService: AuthService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      if (this.authService.registerSuccess()) {
        // TODO: Display a toast
        alert('Register successfully!');
        this.changeScreenSignal.set(AuthScreens.SIGN_IN);
        this.authService.registerSuccess.set(false);
      }
    });
  }

  onChangeScreenClick(): void {
    this.changeScreenSignal.set(AuthScreens.SIGN_IN);
  }

  onRegisterClick(): void {
    if (!this.registerFrom.valid) {
      console.log('invalid form');
      this.registerFrom.markAllAsTouched();
      return;
    }
    const payload: UserRegister = this.registerFrom.getRawValue();
    this.authService
      .register$(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
