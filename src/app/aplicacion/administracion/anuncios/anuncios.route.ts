

import { Routes } from '@angular/router';
import { Anuncios } from './anuncios';
import { AnuncioLista } from './anuncio-lista/anuncio-lista';
import { AnuncioForm } from './anuncio-form/anuncio-form';
import { AnuncioDetalle } from './anuncio-detalle/anuncio-detalle';


export default [
    {
        path: '',
        component: Anuncios,
        children: [
            { path: '', component: AnuncioLista, },
            { path: 'nuevo', component: AnuncioForm, },
            { path: 'detalle/:id', component: AnuncioDetalle, },
        ]
    },
] as Routes;