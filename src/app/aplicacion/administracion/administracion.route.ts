

import { Routes } from '@angular/router';
import { Administracion } from './administracion';
import { Anuncios } from './anuncios/anuncios';
import { Perfil } from './perfil/perfil';
import { Configuracion } from './configuracion/configuracion';

export default [
    {
        path: '',
        component: Administracion,
        children: [
            { path: '', loadChildren: () => import('./anuncios/anuncios.route') },
            { path: 'anuncios', loadChildren: () => import('./anuncios/anuncios.route') },
            { path: 'perfil', component: Perfil, },
            { path: 'configuracion', component: Configuracion, },
        ]
    },
] as Routes;