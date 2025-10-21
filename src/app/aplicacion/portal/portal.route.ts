

import { Routes } from '@angular/router';
import { Portal } from './portal';
import { Inicio } from './inicio/inicio';
import { Contacto } from './contacto/contacto';
/* 
export const routes: Routes = [
    {
        path: '',
        component: Portal,
        children: [
            { path: '', component: Inicio, },
            { path: 'inicio', component: Inicio, },
            { path: 'contacto', component: Contacto, },
        ]
    }
]; */




export default [
    {
        path: '',
        component: Portal,
        children: [
            { path: '', component: Inicio, },
            { path: 'inicio', component: Inicio, },
            { path: 'contacto', component: Contacto, },
        ]
    },
] as Routes;