import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotifierService {
  private readonly toaster = inject(ToastrService);

  showSuccessMessage(message: string, title: string): void {
    this.toaster.success(message, title, {
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }

  showErrorMessage(message: string, title: string): void {
    this.toaster.error(message, title, {
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }

  showInfoMessage(message: string, title: string): void {
    this.toaster.info(message, title, {
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }

  showWarningMessage(message: string, title: string): void {
    this.toaster.warning(message, title, {
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }
}
