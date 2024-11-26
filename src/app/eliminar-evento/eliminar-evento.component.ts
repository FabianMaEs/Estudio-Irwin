import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthEncryptionService } from '../auth-encryption.service';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-eliminar-evento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eliminar-evento.component.html',
  styleUrl: './eliminar-evento.component.css'
})
export class EliminarEventoComponent implements OnInit {
  eventos: any[] = [];
  eventoSeleccionado: any = null;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private encryptionService: AuthEncryptionService, private alertService: AlertService) {}
  ngOnInit(): void {
    this.cargarEventos();
  }

  
  cargarEventos(): void {
    const storedEventos = localStorage.getItem('eventos');
    this.eventos = storedEventos ? JSON.parse(storedEventos) : [];
    
    // Desencriptar información sensible
    this.eventos = this.eventos.map(evento => {
      evento.clienteNombre = this.encryptionService.decrypt(evento.clienteNombre);
      evento.clienteTelefono = this.encryptionService.decrypt(evento.clienteTelefono);
      evento.lugarCeremonia = this.encryptionService.decrypt(evento.lugarCeremonia);
      evento.lugarRecepcion = this.encryptionService.decrypt(evento.lugarRecepcion);
      return evento;
    });
  }


  seleccionarEvento(event: Event): void {
    const target = event.target as HTMLSelectElement; // Conversión de tipo
    const id = target.value; // Obtener el valor seleccionado
    this.eventoSeleccionado = this.eventos.find(e => e.id === id) || null;
  }

  /*eliminarEvento(): void {
    if (this.eventoSeleccionado) {
      this.eventos = this.eventos.filter(e => e.id !== this.eventoSeleccionado.id);
      localStorage.setItem('eventos', JSON.stringify(this.eventos));
      this.successMessage = `Evento con fecha ${this.eventoSeleccionado.fecha} eliminado exitosamente.`;
      this.errorMessage = '';
      this.eventoSeleccionado = null;
    } else {
      this.errorMessage = 'Por favor, selecciona un evento para eliminar.';
      this.successMessage = '';
    }
  }*/

  // Método para eliminar un evento
  eliminarEvento(): void {
    if (this.eventoSeleccionado) {

      this.alertService
        .confirmAlert(
          '¿Estás seguro?',
          `¿Deseas eliminar el evento "${this.eventoSeleccionado.tipoEvento}" de ${this.eventoSeleccionado.clienteNombre}?`,
          'Eliminar',
          'Cancelar'
        )
        .then((confirmed) => {
          if (confirmed) {
            this.eventos = this.eventos.filter(e => e.id !== this.eventoSeleccionado.id);
            localStorage.setItem('eventos', JSON.stringify(this.eventos));
            this.alertService.simpleAlert('Evento eliminado', `Evento con fecha ${this.eventoSeleccionado.fecha} eliminado exitosamente.`, 'success');
            // this.successMessage = `Evento con fecha ${this.eventoSeleccionado.fecha} eliminado exitosamente.`;
            this.errorMessage = '';
            this.eventoSeleccionado = null;     
          }
      });
    }
    else {
      this.alertService.simpleAlert('Error', 'Por favor, selecciona un evento para eliminar.', 'error');
      //this.errorMessage = 'Por favor, selecciona un evento para eliminar.';
      this.successMessage = '';
    }
  }
}
