import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthEncryptionService } from '../auth-encryption.service';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-pagar-evento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pagar-evento.component.html',
  styleUrls: ['./pagar-evento.component.css']
})
export class PagarEventoComponent implements OnInit {
  eventos: any[] = [];
  eventoSeleccionado: any = null;
  successMessage: string = '';
  errorMessage: string = '';
  pagoForm: FormGroup;

  constructor(private fb: FormBuilder, private encryptionService: AuthEncryptionService, private alertService: AlertService) {
    this.pagoForm = this.fb.group({
      pago: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos(): void {
    const storedEventos = localStorage.getItem('eventos');
    this.eventos = storedEventos ? JSON.parse(storedEventos) : [];
  
    // Desencriptar información sensible para mostrar en la interfaz
    this.eventos = this.eventos.map(evento => ({
      ...evento,
      clienteNombre: this.encryptionService.decrypt(evento.clienteNombre),
      clienteTelefono: this.encryptionService.decrypt(evento.clienteTelefono),
      lugarCeremonia: this.encryptionService.decrypt(evento.lugarCeremonia),
      lugarRecepcion: this.encryptionService.decrypt(evento.lugarRecepcion),
    }));
  }
  
  

  seleccionarEvento(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const id = target.value;
    const evento = this.eventos.find(e => e.id === id);
    if (evento) {
      this.eventoSeleccionado = evento;
      this.pagoForm.reset(); // Resetea el formulario al seleccionar un nuevo evento
    }
  }

  // Método para registrar un pago total o parcial
  registrarPago(): void {
    if (this.eventoSeleccionado && this.pagoForm.valid) {
      const pagoIngresado = parseFloat(this.pagoForm.value.pago);
      const montoRestante = this.eventoSeleccionado.precio - this.eventoSeleccionado.anticipo;
  
      if (pagoIngresado <= montoRestante) {
        // Actualizar los datos del evento en memoria
        this.eventoSeleccionado.anticipo += pagoIngresado;
        if (this.eventoSeleccionado.anticipo >= this.eventoSeleccionado.precio) {
          this.eventoSeleccionado.pagado = true; // Marcar como pagado si se cubre el monto
        }
  
        // Guardar los cambios en `localStorage` (se encripta en el método `actualizarEvento`)
        this.actualizarEvento(this.eventoSeleccionado);
  
        // Mostrar mensajes de éxito
        const restante = this.eventoSeleccionado.precio - this.eventoSeleccionado.anticipo;
        this.alertService.simpleAlert(
          'Pago registrado',
          restante > 0
            ? `Se registró un pago parcial de $${pagoIngresado}. Quedan $${restante} por pagar.`
            : `El pago completo de $${pagoIngresado} ha sido registrado correctamente.`,
          'success'
        );
  
        this.errorMessage = '';
        this.pagoForm.reset();
        this.limpiarFormulario();
        this.cargarEventos();
        this.deseleccionarEvento();
      } else {
        // Monto ingresado excede el monto restante
        this.alertService.simpleAlert('Error', 'El monto ingresado excede el total pendiente.', 'error');
      }
    } else {
      // No se seleccionó un evento o el formulario no es válido
      this.alertService.simpleAlert('Error', 'Por favor, selecciona un evento y completa el monto a pagar correctamente.', 'error');
    }
  }
  
  
  
  // Método para actualizar un evento
  actualizarEvento(eventoActualizado: any): void {
    const index = this.eventos.findIndex(e => e.id === eventoActualizado.id);
    if (index !== -1) {
      // Encriptar los datos antes de guardarlos en `localStorage`
      const eventoEncriptado = {
        ...eventoActualizado,
        clienteNombre: this.encryptionService.encrypt(eventoActualizado.clienteNombre),
        clienteTelefono: this.encryptionService.encrypt(eventoActualizado.clienteTelefono),
        lugarCeremonia: this.encryptionService.encrypt(eventoActualizado.lugarCeremonia),
        lugarRecepcion: this.encryptionService.encrypt(eventoActualizado.lugarRecepcion),
      };
  
      this.eventos[index] = eventoEncriptado;
      localStorage.setItem('eventos', JSON.stringify(this.eventos));
    }

  }
  
  limpiarFormulario(): void {
    this.eventoSeleccionado = null;
    this.pagoForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }

  deseleccionarEvento(): void {
    this.eventoSeleccionado = null;
    this.pagoForm.reset();
  }

  
}
