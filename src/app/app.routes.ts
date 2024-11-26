import { Routes, RouterModule } from '@angular/router';
import { AgendarEventoComponent } from './agendar-evento/agendar-evento.component';
import { ConsultarEventoComponent } from './consultar-evento/consultar-evento.component';
import { EditarEventoComponent } from './editar-evento/editar-evento.component';
import { EliminarEventoComponent } from './eliminar-evento/eliminar-evento.component';
import { PagarEventoComponent } from './pagar-evento/pagar-evento.component';
import { AlertasComponent } from './alertas/alertas.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { CalendarioComponent } from './calendario/calendario.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'agendar', component: AgendarEventoComponent, canActivate: [AuthGuard] },
  { path: 'consultar', component: ConsultarEventoComponent, canActivate: [AuthGuard] },
  { path: 'editar', component: EditarEventoComponent, canActivate: [AuthGuard] },
  { path: 'eliminar', component: EliminarEventoComponent, canActivate: [AuthGuard] },
  { path: 'pagar', component: PagarEventoComponent, canActivate: [AuthGuard] },
  { path: 'alertas', component: AlertasComponent, canActivate: [AuthGuard] },
  { path: 'calendario', component: CalendarioComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}