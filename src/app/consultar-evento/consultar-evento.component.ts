import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthEncryptionService } from '../auth-encryption.service';

@Component({
  selector: 'app-consultar-evento',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './consultar-evento.component.html',
  styleUrl: './consultar-evento.component.css'
})
export class ConsultarEventoComponent implements OnInit {
  limpiarResultados() {
    this.eventosFiltrados = [];
  }
  eventoForm: FormGroup;
  eventos: any[] = [];
  eventosFiltrados: any[] = [];

  constructor(private fb: FormBuilder, private encryptionService: AuthEncryptionService) {
    this.eventoForm = this.fb.group({
      fecha: [''],
      tipoEvento: [''],
      clienteNombre: ['']
    });
  }

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

  // Método para filtrar eventos según los criterios seleccionados (fecha, tipo de evento, nombre del cliente)
  filtrarEventos(): void {
    const { fecha, tipoEvento, clienteNombre } = this.eventoForm.value;

    this.eventosFiltrados = this.eventos.filter(evento => {
      const coincideFecha = fecha ? evento.fecha === fecha : true;
      const coincideTipo = tipoEvento ? evento.tipoEvento.toLowerCase().includes(tipoEvento.toLowerCase()) : true;
      const coincideCliente = clienteNombre
        ? evento.clienteNombre.toLowerCase().includes(clienteNombre.toLowerCase())
        : true;

      return coincideFecha && coincideTipo && coincideCliente;
    });
  }

  limpiarFiltros(): void {
    this.eventoForm.reset();
    this.eventosFiltrados = [...this.eventos];
  }
}