import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  // Alerta básica
  simpleAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info'): void {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'Aceptar',
    });
  }

  // Alerta con confirmación
  confirmAlert(
    title: string,
    text: string,
    confirmText: string = 'Confirmar',
    cancelText: string = 'Cancelar'
  ): Promise<boolean> {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
    }).then((result) => result.isConfirmed);
  }

  // Alerta con un temporizador
  timedAlert(title: string, text: string, timer: number = 2000): void {
    Swal.fire({
      title,
      text,
      icon: 'info',
      timer,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }

  // Alerta personalizada
  customAlert(options: any): void {
    Swal.fire(options);
  }
}
