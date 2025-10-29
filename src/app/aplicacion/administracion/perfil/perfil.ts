import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../sistema/spinner/spinner.service';
import { UsuarioService } from '../../servicios/usuario.service';
import { AuthService } from '../../servicios/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-perfil',
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
    MatSlideToggleModule
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {

  registroControl = false;
  registroFormGroup: FormGroup;
  usuario: any | null = null;
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private usuariosServicio: UsuarioService,
    private cargando: SpinnerService,
    private authServicio: AuthService,
    private snackbar: MatSnackBar,
  ) {

    this.registroFormGroup = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required]],
      nombres: [null, [Validators.required]],
      apellidos: [null, [Validators.required]],
      telefono: [null, [Validators.required]],
      activo: [true],
    });
  }

  ngOnInit(): void {
    this.cargando.show('Cargando perfil...');
    this.authServicio.user$
      .pipe(
        filter((user): user is any => !!user),
        take(1)
      )
      .subscribe({
        next: (user) => {
          this.usuario = user;
          this.registroFormGroup.patchValue({
            email: user.email ?? ''
          });
          void this.cargarPerfil(user.email);
        },
        error: (error) => {
          console.error('Error al obtener el usuario autenticado', error);
          this.cargando.hide();
          this.snackbar.open('No se pudo cargar la información del usuario.', 'OK', { duration: 6000 });
        }
      });
  }

  get r(): any { return this.registroFormGroup.controls; }

  private async cargarPerfil(email: string | null | undefined): Promise<void> {
    if (!email) {
      this.cargando.hide();
      this.snackbar.open('No encontramos el correo del usuario.', 'OK', { duration: 6000 });
      return;
    }

    try {
      const datosUsuario = await this.usuariosServicio.obtenerPorId(email);
      if (datosUsuario) {
        this.registroFormGroup.patchValue({
          nombres: datosUsuario['nombres'] ?? null,
          apellidos: datosUsuario['apellidos'] ?? null,
          telefono: datosUsuario['telefono'] ?? null,
          activo: typeof datosUsuario['activo'] === 'boolean' ? datosUsuario['activo'] : true,
        });
      } else {
        this.registroFormGroup.patchValue({
          activo: true,
        });
      }
    } catch (error) {
      console.error('Error al cargar datos del perfil', error);
      this.snackbar.open('No se pudo cargar los datos del perfil.', 'OK', { duration: 6000 });
    } finally {
      this.cargando.hide();
    }
  }

  async guardarPerfil(): Promise<void> {
    if (this.registroFormGroup.invalid) {
      this.registroFormGroup.markAllAsTouched();
      this.snackbar.open('Revisa los campos obligatorios antes de continuar.', 'OK', { duration: 6000 });
      return;
    }

    if (!this.usuario?.email) {
      this.snackbar.open('No se encontró el identificador del usuario.', 'OK', { duration: 6000 });
      return;
    }

    const { email, ...datosPerfil } = this.registroFormGroup.getRawValue();

    this.guardando = true;
    this.cargando.show('Guardando perfil...');

    try {
      await this.usuariosServicio.editar(this.usuario.email, datosPerfil);
      this.snackbar.open('Perfil actualizado correctamente.', 'OK', { duration: 4000 });
    } catch (error) {
      console.error('Error al actualizar el perfil', error);
      this.snackbar.open('No se pudo actualizar el perfil, intenta nuevamente.', 'OK', { duration: 6000 });
    } finally {
      this.guardando = false;
      this.cargando.hide();
    }
  }
}
