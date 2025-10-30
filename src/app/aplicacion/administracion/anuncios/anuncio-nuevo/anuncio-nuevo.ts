import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { AnuncioService } from '../../../servicios/anuncio.service';
import { SpinnerService } from '../../../sistema/spinner/spinner.service';
import { EmailService } from '../../../servicios/email.service';
import { categorias } from '../../../datos/categoria';
import { AuthService } from '../../../servicios/auth.service';

@Component({
  selector: 'app-anuncio-nuevo',

  templateUrl: './anuncio-nuevo.html',
  styleUrl: './anuncio-nuevo.css',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule, ReactiveFormsModule,

    // MATERIAL
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule

  ],
})
export class AnuncioNuevo implements OnInit {

  registroControl = false;
  registroFormGroup!: FormGroup;

  fechaHoy = new Date();
  bloqueo = false;

  listaCategorias: any[] = categorias;
  listaCategorias1: any[] = [];
  listaCategorias2: any[] = [];
  listaCategorias3: any[] = [];

  usuario: any | null = null;

  constructor(
    private anuncioServicio: AnuncioService,
    private fb: FormBuilder,
    private router: Router,
    private cargando: SpinnerService,
    private snackbar: MatSnackBar,
    private emailServicio: EmailService,
    private authServicio: AuthService,
  ) {

    this.authServicio.user$.subscribe((user) => {
      if (user) {
        this.usuario = user;
      }
    });

    this.registroFormGroup = this.fb.group({
      categoria: [null, [Validators.required]],
      categoria1: [null, [Validators.required]],
      categoria2: [null],
      categoria3: [null],

      // usuario: [this.usuario.email],
      
      vistas: [0],
      favorito: [0],
      
      publicado: [false],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.establecerSuscripcion();
    this.inicializarListasDesdeFormulario();
  }

  // FORM
  get r(): any { return this.registroFormGroup.controls; }


  establecerSuscripcion() {
    this.r.categoria.valueChanges.subscribe((categoriaId: string | null) => {
      this.actualizarNivel1(categoriaId);
    });

    this.r.categoria1.valueChanges.subscribe((categoriaId: string | null) => {
      this.actualizarNivel2(categoriaId);
    });

    this.r.categoria2.valueChanges.subscribe((categoriaId: string | null) => {
      this.actualizarNivel3(categoriaId);
    });
  }

  private inicializarListasDesdeFormulario(): void {
    const categoriaSeleccionada = this.r.categoria.value;
    const categoria1Seleccionada = this.r.categoria1.value;
    const categoria2Seleccionada = this.r.categoria2.value;

    if (categoriaSeleccionada) {
      this.actualizarNivel1(categoriaSeleccionada, false);
    }

    if (categoria1Seleccionada) {
      this.actualizarNivel2(categoria1Seleccionada, false);
    }

    if (categoria2Seleccionada) {
      this.actualizarNivel3(categoria2Seleccionada, false);
    }
  }

  private actualizarNivel1(categoriaId: string | null, resetValor = true): void {
    this.listaCategorias1 = [];
    if (resetValor) {
      this.r.categoria1.setValue(null, { emitEvent: false });
    }
    this.resetNivel2(resetValor);

    if (!categoriaId) {
      return;
    }

    const categoriaSeleccionada = this.listaCategorias.find((cat) => cat.id === categoriaId);
    if (categoriaSeleccionada?.subcategoria) {
      this.listaCategorias1 = categoriaSeleccionada.subcategoria;
    }
  }

  private actualizarNivel2(categoriaId: string | null, resetValor = true): void {
    this.listaCategorias2 = [];
    if (resetValor) {
      this.r.categoria2.setValue(null, { emitEvent: false });
    }
    this.resetNivel3(resetValor);

    if (!categoriaId) {
      return;
    }

    const categoriaSeleccionada = this.listaCategorias1.find((cat) => cat.id === categoriaId);
    if (categoriaSeleccionada?.subcategoria) {
      this.listaCategorias2 = categoriaSeleccionada.subcategoria;
    }
  }

  private actualizarNivel3(categoriaId: string | null, resetValor = true): void {
    this.listaCategorias3 = [];
    if (resetValor) {
      this.r.categoria3.setValue(null, { emitEvent: false });
    }

    if (!categoriaId) {
      return;
    }

    const categoriaSeleccionada = this.listaCategorias2.find((cat) => cat.id === categoriaId);
    if (categoriaSeleccionada?.subcategoria) {
      this.listaCategorias3 = categoriaSeleccionada.subcategoria;
    }
  }

  private resetNivel2(resetearValor = true): void {
    this.listaCategorias2 = [];
    if (resetearValor) {
      this.r.categoria2.setValue(null, { emitEvent: false });
    }
    this.resetNivel3(resetearValor);
  }

  private resetNivel3(resetearValor = true): void {
    this.listaCategorias3 = [];
    if (resetearValor) {
      this.r.categoria3.setValue(null, { emitEvent: false });
    }
  }


  onSubmit(): void {
    this.registroControl = true;
    if (this.registroFormGroup.invalid) {
      this.snackbar.open('por favor complete los datos requeridos.', 'OK', {
        duration: 10000
      });
      return;
    } else {
      this.cargando.show('Guardando datos...');
      this.anuncioServicio.nuevo(this.registroFormGroup.getRawValue()).then((res) => {
        this.cargando.hide();
        console.log('NUEVO ANUNCIO: ', res);
        this.router.navigate(['/administracion/anuncios/ubicacion/' + res.id]);
        /*         this.snackbar.open('Muchas gracias por registrar su cita', 'OK', { duration: 10000 });
                this.notificarAlIntersado();
                this.notificarAlAdministrador();
                 */

      });

      // this.r.mensaje.setValue('');
    }
  }

}
