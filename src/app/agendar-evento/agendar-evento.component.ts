import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthEncryptionService } from '../auth-encryption.service';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-agendar-evento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agendar-evento.component.html',
  styleUrl: './agendar-evento.component.css'
})
export class AgendarEventoComponent {

  eventoForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private encryptionService: AuthEncryptionService, private alertService: AlertService) {
    this.eventoForm = this.fb.group({
    id: [this.generateId(), Validators.required],
    fecha: ['', [Validators.required, this.fechaPosteriorAUnaSemanaValidator]], // Mueve el validador aquí
    hora: ['', Validators.required],
    tipoEvento: ['', Validators.required],
    clienteNombre: ['', Validators.required],
    clienteTelefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    lugarCeremonia: ['', Validators.required],
    lugarRecepcion: ['', Validators.required],
    itinerario: ['', Validators.required],
    paquete: ['', Validators.required],
    precio: ['', [Validators.required, Validators.min(0)]],
    anticipo: ['', [Validators.required, Validators.min(0)]],
    pagado: [false, Validators.required]
  });
  // Valores por defecto
  this.eventoForm.get('hora')?.setValue('12:00');
  this.eventoForm.get('tipoEvento')?.setValue('Boda');
  this.eventoForm.get('clienteNombre')?.setValue('Juan Pérez');
  this.eventoForm.get('clienteTelefono')?.setValue('1234567890');
  this.eventoForm.get('lugarCeremonia')?.setValue('Iglesia de San Juan');
  this.eventoForm.get('lugarRecepcion')?.setValue('Salón de eventos "La fiesta"');
  this.eventoForm.get('itinerario')?.setValue('Ceremonia, recepción, baile');
  this.eventoForm.get('paquete')?.setValue('Intermedio');
  this.eventoForm.get('precio')?.setValue(10000);
  this.eventoForm.get('anticipo')?.setValue(5000);
}

  // Método para agendar un evento
  agendarEvento(): void {
    console.log('Formulario válido:', this.eventoForm.valid);
    if (this.eventoForm.valid) {
      const evento = this.eventoForm.value;

      evento.clienteNombre = this.encryptionService.encrypt(evento.clienteNombre);
      evento.clienteTelefono = this.encryptionService.encrypt(evento.clienteTelefono);
      evento.lugarCeremonia = this.encryptionService.encrypt(evento.lugarCeremonia);
      evento.lugarRecepcion = this.encryptionService.encrypt(evento.lugarRecepcion);

      const eventos = this.getEventos();
      eventos.push(this.eventoForm.value);
      localStorage.setItem('eventos', JSON.stringify(eventos));
      this.alertService.simpleAlert('Evento registrado', 'Evento agendado exitosamente.', 'success');
      //this.successMessage = 'Evento agendado exitosamente.';
      this.errorMessage = '';
      this.eventoForm.reset({ pagado: false, id: this.generateId() });
    } else {
      this.alertService.simpleAlert('Error', 'Por favor, completa todos los campos correctamente.', 'error');
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      this.successMessage = '';
    }
  }

  getEventos(): any[] {
    const eventos = localStorage.getItem('eventos');
    return eventos ? JSON.parse(eventos) : [];
  }

  // Generar un ID único para cada evento
  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Validador personalizado para fechas posteriores a 3 días
  fechaPosteriorAUnaSemanaValidator(control: AbstractControl): { [key: string]: boolean } | null {
    console.log('Validando fecha:', control.value);
    const fechaIngresada = new Date(control.value);
    const fechaHoy = new Date();
    const fechaLimite = new Date(fechaHoy.setDate(fechaHoy.getDate() + 3));
  
    if (fechaIngresada <= fechaLimite) {
      return { fechaInvalida: true };
    }
    return null;
  }
  
  
}
