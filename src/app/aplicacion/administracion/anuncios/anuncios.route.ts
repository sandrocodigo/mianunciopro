

import { Routes } from '@angular/router';
import { Anuncios } from './anuncios';
import { AnuncioLista } from './anuncio-lista/anuncio-lista';
import { AnuncioForm } from './anuncio-form/anuncio-form';
import { AnuncioDetalle } from './anuncio-detalle/anuncio-detalle';
import { AnuncioNuevo } from './anuncio-nuevo/anuncio-nuevo';
import { AnuncioEditar } from './anuncio-editar/anuncio-editar';

export default [
    {
        path: '',
        component: Anuncios,
        children: [
            { path: '', component: AnuncioLista, },
            { path: 'nuevo', component: AnuncioNuevo, },
            { path: 'editar/:id', component: AnuncioEditar, },
            { path: 'detalle/:id', component: AnuncioDetalle, },
        ]
    },
] as Routes;