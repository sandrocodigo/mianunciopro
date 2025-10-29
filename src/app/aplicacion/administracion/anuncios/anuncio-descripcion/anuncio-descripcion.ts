import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  AbstractControl,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { AnuncioService } from '../../../servicios/anuncio.service';
import { Anuncio } from '../../../modelos/anuncio';
import { SpinnerService } from '../../../sistema/spinner/spinner.service';

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

type DescripcionFormGroup = FormGroup<{
  titulo: FormControl<string | null>;
  descripcion: FormControl<string | null>;
  attrs: AttrsFormGroup;
}>;

type CategoriaClave = 'VEHICULO' | 'INMUEBLE' | 'EMPLEO' | 'SERVICIO' | 'MARKETPLACE';

@Component({
  selector: 'app-anuncio-descripcion',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatSnackBarModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './anuncio-descripcion.html',
  styleUrl: './anuncio-descripcion.css',
})
export class AnuncioDescripcion implements OnInit {
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

  readonly categoriaLabels: Record<CategoriaClave, string> = {
    VEHICULO: 'Vehículo',
    INMUEBLE: 'Inmueble',
    EMPLEO: 'Empleo',
    SERVICIO: 'Servicio',
    MARKETPLACE: 'Marketplace',
  };

  readonly form: DescripcionFormGroup;

  idAnuncio: string | null = null;
  anuncioActual: Anuncio | null = null;
  currentCategoria: string | null = null;
  currentCategoriaClave: CategoriaClave | null = null;

  cargando = false;
  guardando = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly anuncioServicio: AnuncioService,
    private readonly spinner: SpinnerService,
    private readonly snackbar: MatSnackBar,
    private readonly router: Router,
    private readonly title: Title,
  ) {
    this.form = this.crearFormulario();
  }

  get controles(): DescripcionFormGroup['controls'] {
    return this.form.controls;
  }

  get attrsGroup(): AttrsFormGroup {
    return this.form.controls.attrs;
  }

  ngOnInit(): void {
    this.title.setTitle('Descripción del anuncio');
    this.idAnuncio = this.route.snapshot.paramMap.get('id');
    console.log('Anuncio ID:', this.idAnuncio);
    void this.cargarAnuncio();
  }

  async cargarAnuncio(): Promise<void> {
    if (!this.idAnuncio) {
      this.snackbar.open('No se encontró el anuncio solicitado.', 'OK', { duration: 8000 });
      await this.router.navigate(['/administracion/anuncios']);
      return;
    }

    this.cargando = true;
    this.spinner.show('Cargando descripción...');
    try {
      const anuncio = await this.anuncioServicio.obtenerPorId(this.idAnuncio);
      if (!anuncio) {
        this.snackbar.open('No encontramos datos del anuncio.', 'OK', { duration: 9000 });
        await this.router.navigate(['/administracion/anuncios']);
        return;
      }

      this.anuncioActual = anuncio;
      this.currentCategoria = anuncio.categoria ?? null;
      this.currentCategoriaClave = this.resolverCategoriaClave(this.currentCategoria);
      this.configurarValidadoresPorCategoria(this.currentCategoriaClave);

      this.form.patchValue({
        titulo: anuncio.titulo ?? '',
        descripcion: anuncio.descripcion ?? '',
      });
      this.patchAttrs(anuncio.attrs);
    } catch (error) {
      console.error('Error al cargar anuncio', error);
      this.snackbar.open('Ocurrió un problema al cargar la descripción.', 'OK', { duration: 9000 });
    } finally {
      this.cargando = false;
      this.spinner.hide();
    }
  }

  async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.idAnuncio) {
      this.snackbar.open('Revisa los campos requeridos antes de continuar.', 'OK', { duration: 8000 });
      return;
    }

    const { titulo, descripcion } = this.form.getRawValue();
    const attrs = this.extraerAttrsPorCategoria(this.currentCategoriaClave);

    this.guardando = true;
    this.spinner.show('Guardando descripción...');
    try {
      await this.anuncioServicio.actualizar(this.idAnuncio, {
        titulo: titulo ?? '',
        descripcion: descripcion ?? '',
        attrs,
      });
      this.snackbar.open('Descripción actualizada con éxito.', 'OK', { duration: 8000 });
      await this.router.navigate(['/administracion/anuncios/detalle', this.idAnuncio]);
    } catch (error) {
      console.error('Error al actualizar descripción', error);
      this.snackbar.open('No pudimos guardar los cambios. Intenta nuevamente.', 'OK', {
        duration: 10000,
      });
    } finally {
      this.guardando = false;
      this.spinner.hide();
    }
  }

  get categoriaSeleccionadaLabel(): string {
    if (this.currentCategoriaClave) {
      return this.categoriaLabels[this.currentCategoriaClave];
    }
    return this.currentCategoria ?? 'Sin categoría';
  }

  private patchAttrs(attrs: unknown): void {
    if (!attrs || typeof attrs !== 'object') {
      return;
    }
    const group = this.attrsGroup;
    Object.entries(attrs as Record<string, unknown>).forEach(([clave, valor]) => {
      const control = group.get(clave);
      if (!control) {
        return;
      }
      if (typeof valor === 'number') {
        control.patchValue(valor);
      } else if (typeof valor === 'boolean') {
        control.patchValue(valor);
      } else if (valor === null || valor === undefined) {
        control.patchValue(null);
      } else {
        control.patchValue(String(valor));
      }
    });
    group.updateValueAndValidity({ emitEvent: false });
  }

  private extraerAttrsPorCategoria(tipo: CategoriaClave | null): Record<string, unknown> {
    const raw = this.attrsGroup.getRawValue();
    const toNumber = (valor: unknown) => {
      if (valor === null || valor === undefined || valor === '') {
        return undefined;
      }
      const numero = Number(valor);
      return Number.isFinite(numero) ? numero : undefined;
    };

    switch (tipo) {
      case 'VEHICULO':
        return {
          marca: raw.marca || undefined,
          modelo: raw.modelo || undefined,
          anio: toNumber(raw.anio),
          kilometraje: toNumber(raw.kilometraje),
          transmision: raw.transmision || undefined,
          combustible: raw.combustible || undefined,
        };
      case 'INMUEBLE':
        return {
          tipoPropiedad: raw.tipoPropiedad || undefined,
          metrosCuadrados: toNumber(raw.metrosCuadrados),
          habitaciones: toNumber(raw.habitaciones),
          banos: toNumber(raw.banos),
          amoblado: raw.amoblado ?? undefined,
        };
      case 'EMPLEO':
        return {
          cargo: raw.cargo || undefined,
          tipoContrato: raw.tipoContrato || undefined,
          salarioMin: toNumber(raw.salarioMin),
          salarioMax: toNumber(raw.salarioMax),
        };
      case 'SERVICIO':
        return {
          rubro: raw.rubro || undefined,
          experiencia: toNumber(raw.experiencia),
        };
      case 'MARKETPLACE':
        return {
          condicion: raw.condicion || undefined,
          marca: raw.marca || undefined,
          modelo: raw.modelo || undefined,
        };
      default:
        return {};
    }
  }

  private resolverCategoriaClave(categoria: string | null): CategoriaClave | null {
    if (!categoria) {
      return null;
    }

    const normalized = categoria
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toUpperCase();

    switch (normalized) {
      case 'VEHICULO':
      case 'VEHICULOS':
      case 'VEHICULO AUTOMOTOR':
        return 'VEHICULO';
      case 'INMUEBLE':
      case 'INMUEBLES':
      case 'BIENES RAICES':
        return 'INMUEBLE';
      case 'EMPLEO':
      case 'EMPLEOS':
      case 'TRABAJO':
        return 'EMPLEO';
      case 'SERVICIO':
      case 'SERVICIOS':
        return 'SERVICIO';
      case 'MARKETPLACE':
      case 'PRODUCTO':
      case 'PRODUCTOS':
        return 'MARKETPLACE';
      default:
        return null;
    }
  }

  private crearFormulario(): DescripcionFormGroup {
    return this.fb.group({
      titulo: this.fb.control<string | null>('', {
        validators: [Validators.required, Validators.maxLength(120)],
      }),
      descripcion: this.fb.control<string | null>('', {
        validators: [Validators.required, Validators.maxLength(2000)],
      }),
      attrs: this.fb.group({
        marca: this.fb.control<string | null>(''),
        modelo: this.fb.control<string | null>(''),
        anio: this.fb.control<number | null>(null),
        kilometraje: this.fb.control<number | null>(null),
        transmision: this.fb.control<string | null>(''),
        combustible: this.fb.control<string | null>(''),
        tipoPropiedad: this.fb.control<string | null>(''),
        metrosCuadrados: this.fb.control<number | null>(null),
        habitaciones: this.fb.control<number | null>(null),
        banos: this.fb.control<number | null>(null),
        amoblado: this.fb.control<boolean | null>(false),
        cargo: this.fb.control<string | null>(''),
        tipoContrato: this.fb.control<string | null>(''),
        salarioMin: this.fb.control<number | null>(null),
        salarioMax: this.fb.control<number | null>(null),
        rubro: this.fb.control<string | null>(''),
        experiencia: this.fb.control<number | null>(null),
        condicion: this.fb.control<string | null>(''),
      }) as AttrsFormGroup,
    }) as DescripcionFormGroup;
  }

  private configurarValidadoresPorCategoria(categoria: CategoriaClave | null): void {
    const attrs = this.attrsGroup;
    const controles = attrs.controls;

    Object.values(controles).forEach((control) => {
      control.clearValidators();
      control.updateValueAndValidity({ emitEvent: false });
    });

    attrs.clearValidators();
    attrs.updateValueAndValidity({ emitEvent: false });

    const asignar = (
      key: keyof AttrsFormGroup['controls'],
      validators: ValidatorFn[],
    ) => {
      const control = controles[key];
      control.setValidators(validators);
      control.updateValueAndValidity({ emitEvent: false });
    };

    switch (categoria) {
      case 'VEHICULO': {
        const anioMax = new Date().getFullYear() + 1;
        asignar('marca', [Validators.required, Validators.maxLength(80)]);
        asignar('modelo', [Validators.required, Validators.maxLength(80)]);
        asignar('anio', [
          Validators.required,
          Validators.min(1900),
          Validators.max(anioMax),
        ]);
        asignar('kilometraje', [Validators.required, Validators.min(0)]);
        asignar('transmision', [Validators.required]);
        asignar('combustible', [Validators.required]);
        break;
      }
      case 'INMUEBLE': {
        asignar('tipoPropiedad', [Validators.required]);
        asignar('metrosCuadrados', [Validators.required, Validators.min(1)]);
        asignar('habitaciones', [Validators.required, Validators.min(0)]);
        asignar('banos', [Validators.required, Validators.min(0)]);
        break;
      }
      case 'EMPLEO': {
        asignar('cargo', [Validators.required, Validators.maxLength(120)]);
        asignar('tipoContrato', [Validators.required]);
        asignar('salarioMin', [Validators.required, Validators.min(0)]);
        asignar('salarioMax', [Validators.required, Validators.min(0)]);
        attrs.setValidators(this.validarRangoSalario());
        attrs.updateValueAndValidity({ emitEvent: false });
        break;
      }
      case 'SERVICIO': {
        asignar('rubro', [Validators.required, Validators.maxLength(120)]);
        asignar('experiencia', [Validators.required, Validators.min(0)]);
        break;
      }
      case 'MARKETPLACE': {
        asignar('condicion', [Validators.required]);
        asignar('marca', [Validators.required, Validators.maxLength(80)]);
        asignar('modelo', [Validators.required, Validators.maxLength(80)]);
        break;
      }
      default:
        break;
    }
  }

  private validarRangoSalario(): ValidatorFn {
    return (control: AbstractControl) => {
      const salarioMinCtrl = control.get('salarioMin');
      const salarioMaxCtrl = control.get('salarioMax');
      if (!salarioMinCtrl || !salarioMaxCtrl) {
        return null;
      }

      const min = salarioMinCtrl.value;
      const max = salarioMaxCtrl.value;

      if (min === null || min === undefined || max === null || max === undefined) {
        return null;
      }

      const minNumber = Number(min);
      const maxNumber = Number(max);

      if (!Number.isFinite(minNumber) || !Number.isFinite(maxNumber)) {
        return null;
      }

      if (minNumber > maxNumber) {
        const errors = { salarioInvalido: true };
        salarioMaxCtrl.setErrors({ ...(salarioMaxCtrl.errors ?? {}), salarioInvalido: true });
        return errors;
      }

      if (salarioMaxCtrl.hasError('salarioInvalido')) {
        const { salarioInvalido, ...restoErrores } = salarioMaxCtrl.errors ?? {};
        const nuevosErrores = Object.keys(restoErrores).length ? restoErrores : null;
        salarioMaxCtrl.setErrors(nuevosErrores);
      }

      return null;
    };
  }
}
