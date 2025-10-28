import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AnuncioService, CrearAnuncioPayload } from '../../../servicios/anuncio.service';
import { TipoAnuncio, Moneda } from '../../../modelos/anuncio';

type AttrsFormGroup = FormGroup<{
  marca: FormControl<string | null>;
  modelo: FormControl<string | null>;
  anio: FormControl<number | null>;
  kilometraje: FormControl<number | null>;
  transmision: FormControl<string | null>;
  combustible: FormControl<string | null>;
  tipoPropiedad: FormControl<string | null>;
  metrosCuadrados: FormControl<number | null>;
  habitaciones: FormControl<number | null>;
  banos: FormControl<number | null>;
  amoblado: FormControl<boolean | null>;
  cargo: FormControl<string | null>;
  tipoContrato: FormControl<string | null>;
  salarioMin: FormControl<number | null>;
  salarioMax: FormControl<number | null>;
  rubro: FormControl<string | null>;
  experiencia: FormControl<number | null>;
  condicion: FormControl<string | null>;
}>;

type FotoControl = FormControl<string>;

@Component({
  selector: 'app-anuncio-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  templateUrl: './anuncio-form.html',
  styleUrl: './anuncio-form.css',
})
export class AnuncioForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly anuncioService = inject(AnuncioService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  isSubmitting = false;
  currentTipo: TipoAnuncio = 'VEHICULO';

  readonly tipoOpciones: { value: TipoAnuncio; label: string }[] = [
    { value: 'VEHICULO', label: 'Vehículo' },
    { value: 'INMUEBLE', label: 'Inmueble' },
    { value: 'EMPLEO', label: 'Empleo' },
    { value: 'SERVICIO', label: 'Servicio' },
    { value: 'MARKETPLACE', label: 'Marketplace' },
  ];

  readonly monedaOpciones: { value: Moneda; label: string }[] = [
    { value: 'BOB', label: 'Bolivianos (BOB)' },
    { value: 'USD', label: 'Dólares (USD)' },
  ];

  readonly estadoOpciones = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'publicado', label: 'Publicado' },
    { value: 'pausado', label: 'Pausado' },
    { value: 'eliminado', label: 'Eliminado' },
  ];

  readonly transmisionOpciones = [
    { value: 'MANUAL', label: 'Manual' },
    { value: 'AUTOMATICA', label: 'Automática' },
  ];

  readonly combustibleOpciones = [
    { value: 'GASOLINA', label: 'Gasolina' },
    { value: 'DIESEL', label: 'Diésel' },
    { value: 'HIBRIDO', label: 'Híbrido' },
    { value: 'ELECTRICO', label: 'Eléctrico' },
  ];

  readonly tipoPropiedadOpciones = [
    { value: 'CASA', label: 'Casa' },
    { value: 'DEPTO', label: 'Departamento' },
    { value: 'TERRENO', label: 'Terreno' },
    { value: 'OFICINA', label: 'Oficina' },
    { value: 'LOCAL', label: 'Local' },
  ];

  readonly tipoContratoOpciones = [
    { value: 'TIEMPO_COMPLETO', label: 'Tiempo completo' },
    { value: 'MEDIO_TIEMPO', label: 'Medio tiempo' },
    { value: 'FREELANCE', label: 'Freelance' },
    { value: 'PRACTICAS', label: 'Prácticas' },
  ];

  readonly condicionOpciones = [
    { value: 'NUEVO', label: 'Nuevo' },
    { value: 'USADO', label: 'Usado' },
  ];

  readonly form = this.formBuilder.group({
    tipo: this.formBuilder.nonNullable.control<TipoAnuncio>('VEHICULO', {
      validators: [Validators.required],
    }),
    categoria: this.formBuilder.control<string | null>('', {
      validators: [Validators.required],
    }),
    subcategoria: this.formBuilder.control<string | null>('', {
      validators: [Validators.required],
    }),
    titulo: this.formBuilder.control<string | null>('', {
      validators: [Validators.required, Validators.maxLength(120)],
    }),
    descripcion: this.formBuilder.control<string | null>('', {
      validators: [Validators.required, Validators.maxLength(2000)],
    }),
    precio: this.formBuilder.control<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
    moneda: this.formBuilder.nonNullable.control<Moneda>('BOB', {
      validators: [Validators.required],
    }),
    negociable: this.formBuilder.control<boolean>(false),
    vendedorId: this.formBuilder.control<string | null>('', {
      validators: [Validators.required],
    }),
    estado: this.formBuilder.nonNullable.control<'pendiente' | 'publicado' | 'pausado' | 'eliminado'>(
      'pendiente',
      {
        validators: [Validators.required],
      },
    ),
    ubicacion: this.formBuilder.group({
      departamento: this.formBuilder.control<string | null>('', {
        validators: [Validators.required],
      }),
      ciudad: this.formBuilder.control<string | null>('', {
        validators: [Validators.required],
      }),
      zona: this.formBuilder.control<string | null>(''),
      lat: this.formBuilder.control<number | null>(null),
      lng: this.formBuilder.control<number | null>(null),
    }),
    fotos: this.formBuilder.array<FotoControl>([
      this.formBuilder.nonNullable.control('', Validators.required),
    ]),
    attrs: this.formBuilder.group({
      marca: this.formBuilder.control<string | null>(''),
      modelo: this.formBuilder.control<string | null>(''),
      anio: this.formBuilder.control<number | null>(null),
      kilometraje: this.formBuilder.control<number | null>(null),
      transmision: this.formBuilder.control<string | null>(''),
      combustible: this.formBuilder.control<string | null>(''),
      tipoPropiedad: this.formBuilder.control<string | null>(''),
      metrosCuadrados: this.formBuilder.control<number | null>(null),
      habitaciones: this.formBuilder.control<number | null>(null),
      banos: this.formBuilder.control<number | null>(null),
      amoblado: this.formBuilder.control<boolean | null>(false),
      cargo: this.formBuilder.control<string | null>(''),
      tipoContrato: this.formBuilder.control<string | null>(''),
      salarioMin: this.formBuilder.control<number | null>(null),
      salarioMax: this.formBuilder.control<number | null>(null),
      rubro: this.formBuilder.control<string | null>(''),
      experiencia: this.formBuilder.control<number | null>(null),
      condicion: this.formBuilder.control<string | null>(''),
    }) as AttrsFormGroup,
  });

  readonly controles = this.form.controls;

  constructor() {
    const tipoControl = this.form.controls.tipo;
    this.currentTipo = tipoControl.value;

    tipoControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tipo) => {
        if (!tipo) {
          return;
        }
        this.currentTipo = tipo;
        this.resetearAtributos();
      });
  }

  get fotos(): FormArray<FotoControl> {
    return this.form.get('fotos') as FormArray<FotoControl>;
  }

  get attrsGroup(): AttrsFormGroup {
    return this.form.get('attrs') as AttrsFormGroup;
  }

  agregarFoto(): void {
    this.fotos.push(this.formBuilder.nonNullable.control('', Validators.required));
  }

  eliminarFoto(indice: number): void {
    if (this.fotos.length === 1) {
      const first = this.fotos.at(0);
      first.setValue('');
      first.markAsPristine();
      first.markAsUntouched();
      return;
    }
    this.fotos.removeAt(indice);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const valores = this.form.getRawValue();
    const attrs = this.attrsGroup.getRawValue();

    const fotos = this.fotos.controls
      .map((control) => control.value.trim())
      .filter((url) => !!url);

    const payload: CrearAnuncioPayload = {
      tipo: valores.tipo,
      categoria: valores.categoria ?? '',
      subcategoria: valores.subcategoria ?? '',
      titulo: valores.titulo ?? '',
      descripcion: valores.descripcion ?? '',
      precio: Number(valores.precio ?? 0),
      moneda: valores.moneda,
      negociable: valores.negociable ?? false,
      ubicacion: {
        departamento: valores.ubicacion?.departamento ?? '',
        ciudad: valores.ubicacion?.ciudad ?? '',
        zona: valores.ubicacion?.zona ?? undefined,
        lat: this.aNumero(valores.ubicacion?.lat),
        lng: this.aNumero(valores.ubicacion?.lng),
      },
      fotos,
      vendedorId: valores.vendedorId ?? '',
      estado: valores.estado,
      views: 0,
      favoritosCount: 0,
      attrs: this.construirAttrs(valores.tipo, attrs),
    };

    try {
      const id = await this.anuncioService.crear(payload);
      this.snackBar.open('Anuncio creado correctamente', 'Cerrar', { duration: 3000 });
      await this.router.navigate(['../detalle', id], { relativeTo: this.route });
    } catch (error) {
      console.error('Error al crear anuncio', error);
      this.snackBar.open('No se pudo crear el anuncio. Inténtalo nuevamente.', 'Cerrar', {
        duration: 4000,
      });
    } finally {
      this.isSubmitting = false;
    }
  }

  private resetearAtributos(): void {
    this.attrsGroup.reset();
    this.attrsGroup.patchValue({ amoblado: false });
  }

  private construirAttrs(tipo: TipoAnuncio, attrs: AttrsFormGroup['value']): any {
    const limpiar = (valor: unknown) => {
      if (valor === null || valor === undefined || valor === '') {
        return undefined;
      }
      return valor;
    };

    switch (tipo) {
      case 'VEHICULO':
        return {
          marca: limpiar(attrs.marca),
          modelo: limpiar(attrs.modelo),
          anio: limpiar(this.aNumero(attrs.anio)),
          kilometraje: limpiar(this.aNumero(attrs.kilometraje)),
          transmision: limpiar(attrs.transmision),
          combustible: limpiar(attrs.combustible),
        };
      case 'INMUEBLE':
        return {
          tipoPropiedad: limpiar(attrs.tipoPropiedad),
          metrosCuadrados: limpiar(this.aNumero(attrs.metrosCuadrados)),
          habitaciones: limpiar(this.aNumero(attrs.habitaciones)),
          banos: limpiar(this.aNumero(attrs.banos)),
          amoblado: limpiar(attrs.amoblado),
        };
      case 'EMPLEO':
        return {
          cargo: limpiar(attrs.cargo),
          tipoContrato: limpiar(attrs.tipoContrato),
          salarioMin: limpiar(this.aNumero(attrs.salarioMin)),
          salarioMax: limpiar(this.aNumero(attrs.salarioMax)),
        };
      case 'SERVICIO':
        return {
          rubro: limpiar(attrs.rubro),
          experiencia: limpiar(this.aNumero(attrs.experiencia)),
        };
      case 'MARKETPLACE':
        return {
          condicion: limpiar(attrs.condicion),
          marca: limpiar(attrs.marca),
          modelo: limpiar(attrs.modelo),
        };
      default:
        return {};
    }
  }

  private aNumero(valor: unknown): number | undefined {
    if (valor === null || valor === undefined || valor === '') {
      return undefined;
    }
    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : undefined;
  }
}
