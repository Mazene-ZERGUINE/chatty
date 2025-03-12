import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription, merge } from 'rxjs';

@Directive({
  selector: '[appFormGroupValidation]',
  standalone: true,
})
export class FormGroupValidationDirective implements OnInit, OnDestroy {
  @Input() formGroup!: FormGroup;

  private subscription: Subscription | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    if (!this.formGroup) {
      console.warn('FormGroupValidationDirective: formGroup input is required');
      return;
    }
    this.updateValidationStyles();

    const statusChanges$ = this.formGroup.statusChanges;
    const valueChanges$ = this.formGroup.valueChanges;

    this.subscription = merge(statusChanges$, valueChanges$).subscribe(() => {
      this.updateValidationStyles();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private updateValidationStyles(): void {
    const controls = this.formGroup.controls;

    Object.keys(controls).forEach((key) => {
      const control = controls[key];
      if (control.invalid && (control.touched || control.dirty)) {
        const controlElement = this.el.nativeElement.querySelector(
          `[formControlName="${key}"]`,
        );
        if (controlElement) {
          this.renderer.setStyle(controlElement, 'background-color', '#ffeeee');
          this.renderer.addClass(controlElement, 'invalid-control');
        }
      } else {
        const controlElement = this.el.nativeElement.querySelector(
          `[formControlName="${key}"]`,
        );
        if (controlElement) {
          this.renderer.removeStyle(controlElement, 'background-color');
          this.renderer.removeClass(controlElement, 'invalid-control');
        }
      }
    });
  }
}
