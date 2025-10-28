

import { Routes } from '@angular/router';
import { Anuncios } from './anuncios';
import { AnuncioLista } from './anuncio-lista/anuncio-lista';
import { AnuncioDetalle } from './anuncio-detalle/anuncio-detalle';
import { AnuncioNuevo } from './anuncio-nuevo/anuncio-nuevo';
import { AnuncioEditar } from './anuncio-editar/anuncio-editar';
import { AnuncioUbicacion } from './anuncio-ubicacion/anuncio-ubicacion';
import { AnuncioDescripcion } from './anuncio-descripcion/anuncio-descripcion';

export default [
    {
        path: '',
        component: Anuncios,
        children: [
            { path: '', component: AnuncioLista, },
            { path: 'nuevo', component: AnuncioNuevo, },
            { path: 'ubicacion/:id', component: AnuncioUbicacion, },
            { path: 'descripcion/:id', component: AnuncioDescripcion, },
            
            { path: 'editar/:id', component: AnuncioEditar, },
            { path: 'detalle/:id', component: AnuncioDetalle, },
        ]
    },
] as Routes;