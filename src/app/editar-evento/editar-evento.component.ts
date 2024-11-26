import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthEncryptionService } from '../auth-encryption.service'; // Asegúrate de que la ruta sea correcta
import { AlertService } from '../alert.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-editar-evento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './editar-evento.component.html',
  styleUrls: ['./editar-evento.component.css']
})
export class EditarEventoComponent implements OnInit {
  eventoForm: FormGroup;
  eventos: any[] = [];
  eventoSeleccionado: any = null;
  successMessage: string = '';
  errorMessage: string = '';

  // Inyectar FormBuilder, AuthEncryptionService y AlertService
  // Validar los campos del formulario
  constructor(private fb: FormBuilder, private encryptionService: AuthEncryptionService, private alertService: AlertService) {  
    this.eventoForm = this.fb.group({
      id: ['', Validators.required],
      fecha: ['', Validators.required],
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
  }

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos(): void {
    const storedEventos = localStorage.getItem('eventos');
    this.eventos = storedEventos ? JSON.parse(storedEventos) : [];
  
    // Desencriptar los campos sensibles para usarlos en la interfaz
    this.eventos = this.eventos.map((evento) => ({
      ...evento,
      clienteNombre: this.encryptionService.decrypt(evento.clienteNombre),
      clienteTelefono: this.encryptionService.decrypt(evento.clienteTelefono),
      lugarCeremonia: this.encryptionService.decrypt(evento.lugarCeremonia),
      lugarRecepcion: this.encryptionService.decrypt(evento.lugarRecepcion),
    }));
    console.log('Eventos:', this.eventos);
  }

  seleccionarEvento(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const id = target.value;

    const evento = this.eventos.find((e) => e.id === id);
    if (evento) {
      console.log('Evento seleccionado:', evento);
      try {
        const eventoDesencriptado = {
          ...evento,
        };

        this.eventoSeleccionado = eventoDesencriptado;
        this.eventoForm.patchValue(this.eventoSeleccionado);
      } catch (error) {
        this.alertService.simpleAlert('Error', 'No se pudieron cargar los datos del evento seleccionado.', 'error');
      }
    } else {
      this.limpiarFormulario();
    }
  }
  

  // Método para guardar los cambios realizados en un evento
  guardarCambios(): void {
    if (this.eventoForm.valid) {
      // Obtener el evento actualizado desde el formulario
      const eventoActualizado = { ...this.eventoSeleccionado, ...this.eventoForm.value };
  
      // Confirmar cambios con el usuario
      this.alertService
        .confirmAlert(
          'Confirmar cambios',
          `¿Deseas guardar los cambios en el evento "${eventoActualizado.tipoEvento}" de ${eventoActualizado.clienteNombre}?`,
          'Guardar',
          'Cancelar'
        )
        .then((confirmed) => {
          if (confirmed) {
            // Encriptar únicamente al guardar en `localStorage`
            console.log('Evento actualizado:', eventoActualizado);
            
            const eventoEncriptado = {
              ...eventoActualizado,
              clienteNombre: this.encryptionService.encrypt(eventoActualizado.clienteNombre),
              clienteTelefono: this.encryptionService.encrypt(eventoActualizado.clienteTelefono),
              lugarCeremonia: this.encryptionService.encrypt(eventoActualizado.lugarCeremonia),
              lugarRecepcion: this.encryptionService.encrypt(eventoActualizado.lugarRecepcion),
            };
            console.log('Evento encriptado:', eventoEncriptado);
  
            // Actualizar el evento en la lista de eventos
            const index = this.eventos.findIndex((e) => e.id === eventoEncriptado.id);
            if (index !== -1) {
              this.eventos[index] = eventoEncriptado;
              localStorage.setItem('eventos', JSON.stringify(this.eventos));
  
              this.alertService.simpleAlert('Evento actualizado', 'Evento actualizado exitosamente.', 'success');
              this.eventoSeleccionado = null;
              this.eventoForm.reset();
            } else {
              this.alertService.simpleAlert('Error', 'No se encontró el evento para actualizar.', 'error');
            }
          }
        });
    } else {
      this.alertService.simpleAlert('Error', 'Por favor, completa todos los campos correctamente.', 'error');
    }
  }
  
  
  

  limpiarFormulario(): void {
    this.eventoSeleccionado = null;
    this.eventoForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }
}
