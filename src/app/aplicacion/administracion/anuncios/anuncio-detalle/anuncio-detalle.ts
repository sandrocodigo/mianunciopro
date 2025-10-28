import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { map, of, switchMap } from 'rxjs';
import { AnuncioService } from '../../../servicios/anuncio.service';
import { Anuncio } from '../../../modelos/anuncio';


interface AtributoDescriptor {
  label: string;
  value: string;
}

@Component({
  selector: 'app-anuncio-detalle',
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './anuncio-detalle.html',
  styleUrl: './anuncio-detalle.css',
})
export class AnuncioDetalle {
  private readonly route = inject(ActivatedRoute);
  private readonly anuncioService = inject(AnuncioService);

  readonly anuncio$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    switchMap((id) => (id ? this.anuncioService.obtenerPorIdTR(id) : of(null))),
  );

  obtenerAtributos(anuncio: Anuncio): AtributoDescriptor[] {
    if (!anuncio.attrs) {
      return [];
    }

    const limpiar = (valor: unknown): string | undefined => {
      if (valor === null || valor === undefined || valor === '') {
        return undefined;
      }
      return String(valor);
    };

    const atributos: AtributoDescriptor[] = [];
    switch (anuncio.tipo) {
      case 'VEHICULO':
        atributos.push(
          { label: 'Marca', value: limpiar(anuncio.attrs['marca']) ?? '' },
          { label: 'Modelo', value: limpiar(anuncio.attrs['modelo']) ?? '' },
          { label: 'Año', value: limpiar(anuncio.attrs['anio']) ?? '' },
          { label: 'Kilometraje', value: limpiar(anuncio.attrs['kilometraje']) ?? '' },
          { label: 'Transmisión', value: limpiar(anuncio.attrs['transmision']) ?? '' },
          { label: 'Combustible', value: limpiar(anuncio.attrs['combustible']) ?? '' },
        );
        break;
      case 'INMUEBLE':
        atributos.push(
          { label: 'Tipo de propiedad', value: limpiar(anuncio.attrs['tipoPropiedad']) ?? '' },
          { label: 'Metros cuadrados', value: limpiar(anuncio.attrs['metrosCuadrados']) ?? '' },
          { label: 'Habitaciones', value: limpiar(anuncio.attrs['habitaciones']) ?? '' },
          { label: 'Baños', value: limpiar(anuncio.attrs['banos']) ?? '' },
          {
            label: 'Amoblado',
            value: anuncio.attrs['amoblado'] ? 'Sí' : anuncio.attrs['amoblado'] === false ? 'No' : '',
          },
        );
        break;
      case 'EMPLEO':
        atributos.push(
          { label: 'Cargo', value: limpiar(anuncio.attrs['cargo']) ?? '' },
          { label: 'Tipo de contrato', value: limpiar(anuncio.attrs['tipoContrato']) ?? '' },
          { label: 'Salario mínimo', value: limpiar(anuncio.attrs['salarioMin']) ?? '' },
          { label: 'Salario máximo', value: limpiar(anuncio.attrs['salarioMax']) ?? '' },
        );
        break;
      case 'SERVICIO':
        atributos.push(
          { label: 'Rubro', value: limpiar(anuncio.attrs['rubro']) ?? '' },
          { label: 'Experiencia', value: limpiar(anuncio.attrs['experiencia']) ?? '' },
        );
        break;
      case 'MARKETPLACE':
        atributos.push(
          { label: 'Condición', value: limpiar(anuncio.attrs['condicion']) ?? '' },
          { label: 'Marca', value: limpiar(anuncio.attrs['marca']) ?? '' },
          { label: 'Modelo', value: limpiar(anuncio.attrs['modelo']) ?? '' },
        );
        break;
      default:
        break;
    }

    return atributos.filter((atributo) => atributo.value !== '');
  }
}
