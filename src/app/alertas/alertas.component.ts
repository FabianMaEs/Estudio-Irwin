import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthEncryptionService } from '../auth-encryption.service';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.css']
})
export class AlertasComponent implements OnInit {
  eventos: any[] = [];
  eventosProximos: any[] = [];
  eventosPendientes: any[] = [];
  hoy: Date = new Date();

  constructor(private encryptionService: AuthEncryptionService) {}

  ngOnInit(): void {
    this.cargarEventos();
    this.filtrarEventosProximos();
    this.filtrarEventosPendientes();
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

  // Método para filtrar eventos próximos a la fecha actual
  filtrarEventosProximos(): void {
    const limiteProximo = new Date();
    limiteProximo.setDate(this.hoy.getDate() + 7); // Próximos 7 días

    this.eventosProximos = this.eventos.filter(evento => {
      const fechaEvento = new Date(evento.fecha);
      return fechaEvento >= this.hoy && fechaEvento <= limiteProximo;
    });
  }

  // Método para filtrar eventos pendientes de pago
  filtrarEventosPendientes(): void {
    this.eventosPendientes = this.eventos.filter(evento => !evento.pagado);
  }
}
