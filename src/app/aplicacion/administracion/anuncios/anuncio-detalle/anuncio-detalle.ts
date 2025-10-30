import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { firstValueFrom, map, of, switchMap } from 'rxjs';
import { AnuncioService } from '../../../servicios/anuncio.service';
import { Anuncio, AttrsVehiculo, AttrsInmueble, AttrsEmpleo, AttrsServicio, AttrsMarketplace, Categorias } from '../../../modelos/anuncio';
import { SpinnerService } from '../../../sistema/spinner/spinner.service';
import { ConfirmacionComponent } from '../../../sistema/confirmacion/confirmacion.component';

interface AtributoDescriptor {
  label: string;
  value: string;
}

@Component({
  selector: 'app-anuncio-detalle',
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './anuncio-detalle.html',
  styleUrl: './anuncio-detalle.css',
})
export class AnuncioDetalle {

  private readonly route = inject(ActivatedRoute);
  private readonly anuncioService = inject(AnuncioService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly spinner = inject(SpinnerService);

  cambiandoPublicacion = false;

  readonly anuncio$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    switchMap((id) => (id ? this.anuncioService.obtenerPorIdTR(id) : of(null))),
  );

  private normalizarTexto(valor?: string | null): string | null {
    if (!valor) {
      return null;
    }
    return valor
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toUpperCase();
  }

  private resolverTipo(anuncio: Anuncio): Categorias | null {
    const candidatos = [
      this.normalizarTexto(anuncio.categoria ? String(anuncio.categoria) : null),
      this.normalizarTexto(anuncio.categoria1 ?? null),
      this.normalizarTexto(anuncio.categoria2 ?? null),
      this.normalizarTexto(anuncio.categoria3 ?? null),
    ];

    for (const candidato of candidatos) {
      if (!candidato) {
        continue;
      }
      switch (candidato) {
        case 'VEHICULO':
        case 'VEHICULOS':
        case 'VEHICULO AUTOMOTOR':
          return 'VEHICULOS';
        case 'INMUEBLE':
        case 'INMUEBLES':
        case 'BIENES RAICES':
          return 'INMUEBLES';
        case 'EMPLEO':
        case 'EMPLEOS':
        case 'TRABAJO':

        case 'SERVICIO':
        case 'SERVICIOS':
        case 'MARKETPLACE':
        case 'PRODUCTO':
        case 'PRODUCTOS':
          return 'MARKETPLACE';
        default:
          break;
      }
    }
    return null;
  }

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
    const tipo = this.resolverTipo(anuncio);

    switch (tipo) {
      case 'VEHICULOS': {
        const attrsVehiculo = (anuncio.attrs ?? {}) as AttrsVehiculo;
        atributos.push(
          { label: 'Marca', value: limpiar(attrsVehiculo.marca) ?? '' },
          { label: 'Modelo', value: limpiar(attrsVehiculo.modelo) ?? '' },
          { label: 'Año', value: limpiar(attrsVehiculo.anio) ?? '' },
          { label: 'Kilometraje', value: limpiar(attrsVehiculo.kilometraje) ?? '' },
          { label: 'Transmisión', value: limpiar(attrsVehiculo.transmision) ?? '' },
          { label: 'Combustible', value: limpiar(attrsVehiculo.combustible) ?? '' },
        );
        break;
      }
      case 'INMUEBLES': {
        const attrsInmueble = (anuncio.attrs ?? {}) as AttrsInmueble;
        atributos.push(
          { label: 'Tipo de propiedad', value: limpiar(attrsInmueble.tipoPropiedad) ?? '' },
          { label: 'Metros cuadrados', value: limpiar(attrsInmueble.metrosCuadrados) ?? '' },
          { label: 'Habitaciones', value: limpiar(attrsInmueble.habitaciones) ?? '' },
          { label: 'Baños', value: limpiar(attrsInmueble.banos) ?? '' },
          {
            label: 'Amoblado',
            value: attrsInmueble.amoblado ? 'Sí' : attrsInmueble.amoblado === false ? 'No' : '',
          },
        );
        break;
      }
      case 'EMPLEOS': {
        const attrsEmpleo = (anuncio.attrs ?? {}) as AttrsEmpleo;
        atributos.push(
          { label: 'Cargo', value: limpiar(attrsEmpleo.cargo) ?? '' },
          { label: 'Tipo de contrato', value: limpiar(attrsEmpleo.tipoContrato) ?? '' },
          { label: 'Salario mínimo', value: limpiar(attrsEmpleo.salarioMin) ?? '' },
          { label: 'Salario máximo', value: limpiar(attrsEmpleo.salarioMax) ?? '' },
        );
        break;
      }
      case 'SERVICIOS': {
        const attrsEmpleo = (anuncio.attrs ?? {}) as AttrsEmpleo;
        atributos.push(
          { label: 'Cargo', value: limpiar(attrsEmpleo.cargo) ?? '' },
          { label: 'Tipo de contrato', value: limpiar(attrsEmpleo.tipoContrato) ?? '' },
          { label: 'Salario mínimo', value: limpiar(attrsEmpleo.salarioMin) ?? '' },
          { label: 'Salario máximo', value: limpiar(attrsEmpleo.salarioMax) ?? '' },
        );
        break;
      }
      case 'MARKETPLACE': {
        const attrsMarketplace = (anuncio.attrs ?? {}) as AttrsMarketplace;
        atributos.push(
          { label: 'Condición', value: limpiar(attrsMarketplace.condicion) ?? '' },
          { label: 'Marca', value: limpiar(attrsMarketplace.marca) ?? '' },
          { label: 'Modelo', value: limpiar(attrsMarketplace.modelo) ?? '' },
        );
        break;
      }
      default:
        break;
    }

    return atributos.filter((atributo) => atributo.value !== '');
  }

  pasosPendientes(anuncio: Anuncio): string[] {
    const pendientes: string[] = [];
    /*     if (!this.esClasificacionCompleta(anuncio)) {
          pendientes.push('Clasificación');
        } */
    if (!this.esUbicacionCompleta(anuncio)) {
      pendientes.push('Ubicación');
    }
    if (!this.esDescripcionCompleta(anuncio)) {
      pendientes.push('Descripción');
    }
    if (!this.tieneImagenes(anuncio)) {
      pendientes.push('Imágenes');
    }
    return pendientes;
  }

  estaPublicado(anuncio: Anuncio): boolean {
    return !!anuncio.publicado;
  }

  async cambiarPublicacion(anuncio: Anuncio): Promise<void> {
    const publicar = !this.estaPublicado(anuncio);

    if (publicar) {
      const pendientes = this.pasosPendientes(anuncio);
      if (pendientes.length > 0) {
        this.snackBar.open(
          `No puedes publicar aún. Completa: ${pendientes.join(', ')}.`,
          'OK',
          { duration: 9000 },
        );
        return;
      }
    }

    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '420px',
      data: {
        titulo: 'Publicación del anuncio',
        mensaje: '¿Estás seguro de realizar esta acción?',
        nota: publicar
          ? 'Publicaremos el anuncio y será visible para los usuarios.'
          : 'Retiraremos la publicación y dejará de ser visible.',
      },
    });

    const confirmacion = await firstValueFrom(dialogRef.afterClosed());
    if (!confirmacion) {
      return;
    }

    this.spinner.show('Actualizando publicación...');
    this.cambiandoPublicacion = true;
    try {
      await this.anuncioService.editar(anuncio.id, {
        publicado: publicar,
        publicadoFecha: publicar ? new Date() : null,
      });
      this.snackBar.open(
        publicar ? 'Anuncio publicado con éxito.' : 'La publicación fue retirada.',
        'OK',
        { duration: 7000 },
      );
    } catch (error) {
      console.error('Error al cambiar publicación', error);
      this.snackBar.open('No pudimos completar la acción. Inténtalo nuevamente.', 'OK', {
        duration: 9000,
      });
    } finally {
      this.spinner.hide();
      this.cambiandoPublicacion = false;
    }
  }

  private esClasificacionCompleta(anuncio: Anuncio): boolean {
    const tieneValor = (valor: unknown): boolean =>
      typeof valor === 'string' ? valor.trim().length > 0 : valor !== null && valor !== undefined;

    return (
      tieneValor(anuncio.categoria) &&
      tieneValor(anuncio.titulo) &&
      typeof anuncio.precio === 'number' &&
      anuncio.precio >= 0 &&
      tieneValor(anuncio.moneda)
    );
  }

  private esUbicacionCompleta(anuncio: Anuncio): boolean {
    const ubicacion = anuncio.ubicacion;
    if (!ubicacion) {
      return false;
    }
    const tieneTexto = (valor: unknown) =>
      typeof valor === 'string' ? valor.trim().length > 0 : false;

    return tieneTexto(ubicacion.departamento) && tieneTexto(ubicacion.ciudad);
  }

  private esDescripcionCompleta(anuncio: Anuncio): boolean {
    const descripcionValida = typeof anuncio.descripcion === 'string' && anuncio.descripcion.trim().length > 0;
    if (!descripcionValida) {
      return false;
    }

    const tipo = this.resolverTipo(anuncio);

    const presente = (valor: unknown): boolean => {
      if (typeof valor === 'string') {
        return valor.trim().length > 0;
      }
      return valor !== null && valor !== undefined;
    };
    const numeroMinimo = (valor: unknown, min: number): boolean => {
      if (valor === null || valor === undefined || valor === '') {
        return false;
      }
      const numero = Number(valor);
      return Number.isFinite(numero) && numero >= min;
    };

    switch (tipo) {
      case 'VEHICULOS': {
        const attrsVehiculo = (anuncio.attrs ?? {}) as AttrsVehiculo;
        return (
          presente(attrsVehiculo.marca) &&
          presente(attrsVehiculo.modelo) &&
          numeroMinimo(attrsVehiculo.anio, 1900) &&
          numeroMinimo(attrsVehiculo.kilometraje, 0) &&
          presente(attrsVehiculo.transmision) &&
          presente(attrsVehiculo.combustible)
        );
      }
      case 'INMUEBLES': {
        const attrsInmueble = (anuncio.attrs ?? {}) as AttrsInmueble;
        return (
          presente(attrsInmueble.tipoPropiedad) &&
          numeroMinimo(attrsInmueble.metrosCuadrados, 1) &&
          numeroMinimo(attrsInmueble.habitaciones, 0) &&
          numeroMinimo(attrsInmueble.banos, 0)
        );
      }
      case 'EMPLEOS': {
        const attrsEmpleo = (anuncio.attrs ?? {}) as AttrsEmpleo;
        const salarioMinValido = numeroMinimo(attrsEmpleo.salarioMin, 0);
        const salarioMaxValido = numeroMinimo(attrsEmpleo.salarioMax, 0);
        const rangoValido =
          salarioMinValido &&
          salarioMaxValido &&
          Number(attrsEmpleo.salarioMax ?? 0) >= Number(attrsEmpleo.salarioMin ?? 0);
        return presente(attrsEmpleo.cargo) && presente(attrsEmpleo.tipoContrato) && rangoValido;
      }
      case 'SERVICIOS': {
        const attrsEmpleo = (anuncio.attrs ?? {}) as AttrsEmpleo;
        const salarioMinValido = numeroMinimo(attrsEmpleo.salarioMin, 0);
        const salarioMaxValido = numeroMinimo(attrsEmpleo.salarioMax, 0);
        const rangoValido =
          salarioMinValido &&
          salarioMaxValido &&
          Number(attrsEmpleo.salarioMax ?? 0) >= Number(attrsEmpleo.salarioMin ?? 0);
        return presente(attrsEmpleo.cargo) && presente(attrsEmpleo.tipoContrato) && rangoValido;
      }

      case 'MARKETPLACE': {
        const attrsMarketplace = (anuncio.attrs ?? {}) as AttrsMarketplace;
        return (
          presente(attrsMarketplace.condicion) &&
          presente(attrsMarketplace.marca) &&
          presente(attrsMarketplace.modelo)
        );
      }
      default:
        return true;
    }
  }

  private tieneImagenes(anuncio: Anuncio): boolean {
    return Array.isArray(anuncio.fotos) && anuncio.fotos.length > 0;
  }
}
