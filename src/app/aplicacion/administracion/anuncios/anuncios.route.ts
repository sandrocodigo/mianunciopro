

import { Routes } from '@angular/router';
import { Anuncios } from './anuncios';
import { AnuncioLista } from './anuncio-lista/anuncio-lista';
import { AnuncioDetalle } from './anuncio-detalle/anuncio-detalle';
import { AnuncioNuevo } from './anuncio-nuevo/anuncio-nuevo';
import { AnuncioUbicacion } from './anuncio-ubicacion/anuncio-ubicacion';
import { AnuncioDescripcion } from './anuncio-descripcion/anuncio-descripcion';
import { AnuncioImagenes } from './anuncio-imagenes/anuncio-imagenes';

export default [
    {
        path: '',
        component: Anuncios,
        children: [
            { path: '', component: AnuncioLista, },
            { path: 'nuevo', component: AnuncioNuevo, },
            { path: 'ubicacion/:id', component: AnuncioUbicacion, },
            { path: 'descripcion/:id', component: AnuncioDescripcion, },
            { path: 'imagenes/:id', component: AnuncioImagenes, },
 
            { path: 'detalle/:id', component: AnuncioDetalle, },
        ]
    },
] as Routes;