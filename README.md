## **Sistema de Agenda para Estudio Fotográfico**

Este proyecto es una aplicación de gestión de eventos para un estudio fotográfico. Permite al administrador agendar, consultar, editar, eliminar y gestionar pagos de eventos, además de recibir alertas sobre eventos próximos y pagos pendientes. Incluye un inicio de sesión sencillo para proteger las funcionalidades y utiliza encriptación básica para proteger información sensible de los clientes.

---

### **Resumen de Componentes y Servicios**

#### **Componentes**
1. **AgendarEventoComponent:** Permite registrar un nuevo evento con todos sus detalles.
2. **ConsultarEventoComponent:** Permite buscar y visualizar los eventos registrados.
3. **EditarEventoComponent:** Permite modificar los datos de un evento existente. Maneja la desencriptación de datos sensibles.
4. **EliminarEventoComponent:** Permite eliminar eventos registrados.
5. **PagarEventoComponent:** Permite registrar pagos completos o parciales de eventos y evita doble encriptación de datos al procesar información sensible.
6. **AlertasComponent:** Muestra alertas sobre eventos próximos y pagos pendientes.
7. **LoginComponent:** Permite iniciar sesión con credenciales simples (usuario y contraseña).

#### **Servicios**
1. **AuthService:** Maneja el estado de autenticación (inicio/cierre de sesión).
2. **AuthGuard:** Protege las rutas para que solo usuarios autenticados puedan acceder a ellas.
3. **AuthEncryptionService:** Maneja la encriptación y desencriptación de datos sensibles como el nombre del cliente, teléfono y ubicaciones.
4. **AlertService:** Muestra mensajes de éxito, error o confirmación en un formato amigable para el usuario.

---

### **Explicación Breve**

1. **Inicio de Sesión:**
   - El usuario inicia sesión con el componente `LoginComponent`.
   - Si no está autenticado, será redirigido a la página de inicio de sesión.

2. **Gestión de Eventos:**
   - **Agendar:** Usa `AgendarEventoComponent` para registrar eventos.
   - **Consultar:** Usa `ConsultarEventoComponent` para buscar eventos registrados.
   - **Editar:** Usa `EditarEventoComponent` para modificar eventos. Los datos sensibles se desencriptan al cargarlos y se re-encriptan al guardar.
   - **Eliminar:** Usa `EliminarEventoComponent` para borrar eventos.
   - **Pagar:** Usa `PagarEventoComponent` para registrar pagos. Asegura la correcta encriptación y desencriptación de los datos.

3. **Protección de Información Sensible:**
   - Los datos sensibles como nombres de cliente, teléfonos y ubicaciones se almacenan encriptados en `localStorage`.
   - Los datos se desencriptan al mostrarse en la interfaz y se vuelven a encriptar al guardarse.

4. **Alertas:**
   - `AlertasComponent` muestra eventos próximos (dentro de 7 días) y pagos pendientes.

5. **Protección:**
   - El servicio `AuthService` asegura que las rutas están protegidas con `AuthGuard`.

---

### **Explicación Detallada**

#### **1. Componentes**

##### **AgendarEventoComponent**
- **Función:** Registrar un nuevo evento.
- **Detalles que captura:** Fecha, hora, cliente, tipo de evento, lugar de ceremonia/recepción, itinerario, paquete, precio, anticipo.
- **Datos almacenados:** Se guardan en `localStorage` con un ID único.
- **Validaciones:**
  - Fecha debe ser al menos una semana posterior al día actual.
  - Teléfono debe tener 10 dígitos.

##### **ConsultarEventoComponent**
- **Función:** Buscar y visualizar eventos.
- **Filtros:** Permite filtrar por fecha, tipo de evento o nombre del cliente.
- **Resultados:** Muestra una lista de eventos con detalles clave.

##### **EditarEventoComponent**
- **Función:** Modificar eventos existentes.
- **Flujo:**
  1. Selecciona un evento de una lista desplegable.
  2. Los datos sensibles (nombre del cliente, teléfono, etc.) se desencriptan al cargarlos en el formulario.
  3. Modifica los datos en el formulario.
  4. Al guardar, los datos se re-encriptan antes de almacenarlos en `localStorage`.

##### **EliminarEventoComponent**
- **Función:** Borrar eventos registrados.
- **Flujo:**
  1. Selecciona un evento de una lista desplegable.
  2. Confirma la eliminación.
  3. Elimina el evento de `localStorage`.

##### **PagarEventoComponent**
- **Función:** Registrar pagos de eventos.
- **Características:**
  - Permite pagos completos o parciales.
  - Calcula el monto restante automáticamente.
  - Evita doble encriptación al actualizar datos.
  - Actualiza el estado del evento en `localStorage` (pagado o no).

##### **AlertasComponent**
- **Función:** Mostrar recordatorios.
- **Alertas:**
  1. Eventos programados dentro de los próximos 7 días.
  2. Eventos con pagos pendientes (indica monto faltante).

##### **LoginComponent**
- **Función:** Iniciar sesión con usuario y contraseña.
- **Validación:** Credenciales correctas (usuario: `admin`, contraseña: `1234`).

---

#### **2. Servicios**

##### **AuthService**
- **Función:**
  - Maneja el estado de autenticación.
  - Permite iniciar y cerrar sesión.
  - Usa `localStorage` para persistir el estado.
- **Métodos principales:**
  - `login(username: string, password: string): boolean`
  - `logout(): void`
  - `isAuthenticated(): boolean`

##### **AuthGuard**
- **Función:** Protege rutas para que solo usuarios autenticados puedan acceder a ellas.
- **Uso:** Aplica el guard a rutas como `/agendar`, `/consultar`, etc.

##### **AuthEncryptionService**
- **Función:**
  - Proteger información sensible en `localStorage` usando encriptación básica.
  - Encripta datos sensibles como:
    - `clienteNombre`
    - `clienteTelefono`
    - `lugarCeremonia`
    - `lugarRecepcion`
  - Desencripta datos sensibles al cargarlos para mostrarlos en la interfaz.
- **Métodos principales:**
  - `encrypt(data: string): string`
  - `decrypt(data: string): string`

##### **AlertService**
- **Función:**
  - Muestra alertas amigables en la interfaz.
  - Tipos de alertas: éxito, error, confirmación.
- **Métodos principales:**
  - `simpleAlert(title: string, message: string, type: 'success' | 'error'): void`
  - `confirmAlert(title: string, message: string, confirmText: string, cancelText: string): Promise<boolean>`

---

### **Cómo Usar el Sistema**

1. **Inicio de Sesión:**
   - Ingresa a `/login`.
   - Usa las credenciales:
     - Usuario: `admin`
     - Contraseña: `1234`.

2. **Gestión de Eventos:**
   - **Agendar:** Ve a `/agendar` para registrar un nuevo evento.
   - **Consultar:** Ve a `/consultar` para buscar eventos.
   - **Editar:** Ve a `/editar` para modificar un evento existente. Los datos sensibles se desencriptan al mostrarse.
   - **Eliminar:** Ve a `/eliminar` para borrar un evento.
   - **Pagar:** Ve a `/pagar` para registrar pagos. Los datos sensibles se gestionan correctamente para evitar doble encriptación.

3. **Alertas:**
   - Ve a `/alertas` para ver recordatorios sobre eventos próximos y pagos pendientes.

4. **Cerrar Sesión:**
   - Haz clic en "Cerrar Sesión" en el menú para salir.

---

### **Notas Técnicas**

- **Protección de Información Sensible:**
  - Los datos sensibles se encriptan antes de almacenarlos en `localStorage`.
  - Los datos se desencriptan al cargarse en la interfaz.

- **Validaciones:**
  - Fechas, teléfonos y pagos están validados en los formularios.
  - Alertas aseguran que los datos mostrados sean relevantes.

- **Extensibilidad:** Fácil de integrar con una API REST o base de datos en el futuro.

- **Encriptación**: Aunque la encriptación actual protege los datos sensibles en localStorage, se han identificado casos donde el manejo de datos encriptados y desencriptados genera inconsistencias, especialmente al registrar pagos o editar eventos. Es necesario revisar el flujo de encriptación/desencriptación para evitar problemas como doble encriptación o datos no mostrados correctamente en la interfaz.

---

### **Tareas Pendientes**
1. Mejorar la encriptación de datos sensibles:
    - Revisar el flujo de encriptación y desencriptación para garantizar que:
      - Los datos desencriptados se usen exclusivamente en la interfaz.
      - Los datos encriptados se manejen correctamente al guardarlos en localStorage.
      - Se eviten casos de doble encriptación o desencriptación fallida.
    - Implementar pruebas exhaustivas para garantizar la consistencia de los datos en escenarios como:
        - Registro de pagos múltiples.
        - Edición de eventos previamente encriptados.
2. Optimizar la lógica de desencriptación:
    - Identificar puntos del código donde los datos encriptados no se manejan adecuadamente.
    - Simplificar el proceso para reducir posibles errores en componentes como EditarEventoComponent y PagarEventoComponent.
