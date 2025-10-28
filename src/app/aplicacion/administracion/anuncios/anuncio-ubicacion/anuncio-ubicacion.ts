import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../servicios/auth.service';
import { SpinnerService } from '../../../sistema/spinner/spinner.service';
import { Title } from '@angular/platform-browser';

// MATERIAL
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { AnuncioService } from '../../../servicios/anuncio.service';

@Component({
  selector: 'app-anuncio-ubicacion',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule, ReactiveFormsModule,

    // MATERIAL
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,

  ],
  templateUrl: './anuncio-ubicacion.html',
  styleUrl: './anuncio-ubicacion.css'
})
export class AnuncioUbicacion {

  idAnuncio: any;

  registroControl = false;
  registroFormGroup!: FormGroup;

  usuario: any | null = null;

  constructor(
    private fb: FormBuilder,
    private ruta: ActivatedRoute,
    public authServicio: AuthService,
    private snackbar: MatSnackBar,
    private cargando: SpinnerService,
    public router: Router,
    private dialog: MatDialog,
    private titleService: Title,
    private anuncioServicio: AnuncioService,
  ) {
    this.idAnuncio = this.ruta.snapshot.paramMap.get('id');

    this.authServicio.user$.subscribe((user) => {
      this.usuario = user;
      // console.log('USUARIO_EMAIL: ', this.usuario.email);
    });

    this.registroFormGroup = this.fb.group({
      ubicacion: [null, [Validators.required]],
    });


  }


  onSubmit(): void {
    this.registroControl = true;
    if (this.registroFormGroup.invalid) {
      this.snackbar.open('Oyeeeee! algun campo requieren tu atencion...', 'OK', {
        duration: 10000,
      });
      return;
    } else {
      this.anuncioServicio.editar(this.idAnuncio, this.registroFormGroup.getRawValue()).then((respuesta: any) => {
        this.snackbar.open('Super! Actualizacion con exito...', 'OK', { duration: 10000 });
      });
    }
  }

}
