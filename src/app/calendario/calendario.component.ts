import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthEncryptionService } from '../auth-encryption.service';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export class CalendarioComponent implements OnInit {
  fechas: any[] = [];
  diasDelMes: Date[] = [];
  mesActual: number = new Date().getMonth();
  anioActual: number = new Date().getFullYear();
  eventos: any[] = [];
  eventosDelDia: any[] = [];
  diaSeleccionado: Date | null = null;

  constructor(private encryptionService: AuthEncryptionService) {
    this.seleccionarDia(new Date());
  }

  ngOnInit(): void {
    this.cargarEventos();
    this.generarCalendario();
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

  generarCalendario(): void {
    this.diasDelMes = [];
    const primerDia = new Date(this.anioActual, this.mesActual, 1);
    const ultimoDia = new Date(this.anioActual, this.mesActual + 1, 0);
    const diasEnMes = ultimoDia.getDate();

    for (let dia = 1; dia <= diasEnMes; dia++) {
      this.diasDelMes.push(new Date(this.anioActual, this.mesActual, dia));
    }
  }

  seleccionarDia(dia: Date): void {
    this.diaSeleccionado = dia;
    const diaFormato = dia.toISOString().split('T')[0];

    this.eventosDelDia = this.eventos.filter(evento => evento.fecha === diaFormato);
  }

  cambiarMes(delta: number): void {
    this.mesActual += delta;
    if (this.mesActual < 0) {
      this.mesActual = 11;
      this.anioActual--;
    } else if (this.mesActual > 11) {
      this.mesActual = 0;
      this.anioActual++;
    }
    this.generarCalendario();
    this.diaSeleccionado = null;
    this.eventosDelDia = [];
    if (this.mesActual === new Date().getMonth() && this.anioActual === new Date().getFullYear()) {
      this.seleccionarDia(new Date());
    }
  }

  esDiaOcupado(dia: Date): boolean {
    const diaFormato = dia.toISOString().split('T')[0];
    return this.eventos.some(evento => evento.fecha === diaFormato);
  }
}
