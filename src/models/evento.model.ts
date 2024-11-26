// Define el modelo de datos de un evento (como una estructura de datos)
export interface Evento {
  id: string;
  fecha: string;
  hora: string;
  tipoEvento: string;
  cliente: {
    nombre: string;
    telefono: string;
  };
  lugarCeremonia: string;
  lugarRecepcion: string;
  itinerario: string;
  paquete: string;
  precio: number;
  anticipo: number;
  pagado: boolean;
}
