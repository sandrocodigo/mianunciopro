import { Routes } from '@angular/router';
import { LoginComponent } from './aplicacion/seguridad/login/login.component';
import { RegistroComponent } from './aplicacion/seguridad/registro/registro.component';
import { RecuperacionComponent } from './aplicacion/seguridad/recuperacion/recuperacion.component';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['/']);

export const routes: Routes = [
    { path: '', loadChildren: () => import('./aplicacion/portal/portal.route') },


    { path: 'login', component: LoginComponent, ...canActivate(redirectLoggedInToHome) },
    { path: 'registro', component: RegistroComponent, ...canActivate(redirectLoggedInToHome) },
    { path: 'recuperacion', component: RecuperacionComponent, ...canActivate(redirectLoggedInToHome) },


    {
        path: 'administracion',
        loadChildren: () => import('./aplicacion/administracion/administracion.route'),
        ...canActivate(redirectUnauthorizedToLogin),
    },
];
