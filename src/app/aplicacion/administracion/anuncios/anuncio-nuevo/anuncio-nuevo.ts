import { Component } from '@angular/core';
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
export class AnuncioNuevo {

  registroControl = false;
  registroFormGroup!: FormGroup;

  fechaHoy = new Date();
  bloqueo = false;

  email = 'contacto@miapppro.com';

  constructor(
    private anuncioServicio: AnuncioService,
    private fb: FormBuilder,
    private router: Router,
    private cargando: SpinnerService,
    private snackbar: MatSnackBar,
    private emailServicio: EmailService,) {
    this.registroFormGroup = this.fb.group({
      nombres: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      telefono: [null, [Validators.required]],
      consulta: [null, [Validators.required]],

      fechaRegistro: [this.fechaHoy],
      confirmado: [false],
      atendido: [false],
      enviado: [false],
      activo: [true]
    });
  }

  ngOnInit(): void {
    // this.fechas = this.citaServicio.getNext30BusinessDays('iso')
  }

  // FORM
  get r(): any { return this.registroFormGroup.controls; }


  onSubmit(): void {
    this.registroControl = true;
    if (this.registroFormGroup.invalid) {
      this.snackbar.open('por favor complete los datos requeridos.', 'OK', {
        duration: 10000
      });
      return;
    } else {
      this.cargando.show();
      this.anuncioServicio.crear(this.registroFormGroup.getRawValue()).then((res) => {
        this.cargando.hide();
        console.log('CITA: ', res);

/*         this.snackbar.open('Muchas gracias por registrar su cita', 'OK', { duration: 10000 });
        this.notificarAlIntersado();
        this.notificarAlAdministrador();
        this.router.navigate(['/contacto/confirmacion/' + res.id]); */

      });

      // this.r.mensaje.setValue('');
    }
  }

  notificarAlIntersado() {
    // smtps://contacto@miapppro.com:qadtzomrjczpfscg@smtp.gmail.com:465
    // contacto@miapppro.com
    const correo = {
      from: `"miAppPRO" <contacto@miapppro.com>`,
      to: this.r.email.value,
      message: {
        subject: 'Solicitud de informacion de Sevicio MiCybersecurityPRO',
        html:
          '<div style="-webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; padding: 4px;">' +
          '<div style="background: linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593);' +
          '-webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; ' +
          'color: rgb(241, 243, 243); font-size: 25px; text-align: center;">' +
          '<p> MiCybersecurityPRO </p>' +
          '<p> Gestion de Ciberseguridad</p>' +
          '</div>' +
          '<br>' +
          '<div style="font-size: 15px;">' +
          '<p> Hola: ' + this.r.nombres.value + ', ' +
          'Como estas?' +
          '</p>' +
          '<hr>' +
          '<p> Muchas gracias por contactarnos: </p>' +
          '<hr>' +
          /*           '<p>Organizacion: ' + this.r.empresa.value + '  </p>' + */
          '<p>Telefono: ' + this.r.telefono.value + '  </p>' +
          '<p>Mensaje: ' + this.r.consulta.value + '  </p>' +
          '<hr>' +
          '<br>' +
          '<p>Muchas gracias por escribirnos, pronto te respondemos, saludos </p>' +
          '<br>' +
          '<h1><a href="https://micybersecuritypro.miapppro.com/' +
          '" target="_blank">miCybersecurityPRO.miapppro.com' +
          '</a></h1>' +
          '<br>' +
          '<hr>' +
          '</div>' +
          '<br>' +
          '<div style = "background: linear-gradient(to right, #078d9c, #3697d8, #08c89f, #0d8002);' +
          '-webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px;' +
          'color: rgb(241, 243, 243); font-size: 15px; text-align: center;">' +
          '© Copyrights 2025 MiAppPRO All rights reserved.' +
          '</div> ' +
          '</div> ',
      },
    }
    this.emailServicio.crear(correo).then((respuesta: any) => {
      this.snackbar.open('Hola!, enviamos una copia de este mensaje a  tu correo...', 'OK', {
        duration: 10000
      });
      // this.actualizarUsuarios();
    });

  }

  notificarAlAdministrador() {

    const adm = 'contacto@miapppro.com';
    // smtps://contacto@miapppro.com:qadtzomrjczpfscg@smtp.gmail.com:465
    // contacto@miapppro.com
    const correo = {
      from: `"miAppPRO" <contacto@miapppro.com>`,
      to: adm,
      message: {
        subject: 'Solicitud de informacion de Sevicio MiAppPRO',
        html:
          '<div style="-webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; padding: 4px;">' +
          '<div style="background: linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593);' +
          '-webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; ' +
          'color: rgb(241, 243, 243); font-size: 25px; text-align: center;">' +
          '<p> miAppPRO </p>' +
          '<p> Software & Ciberseguridad</p>' +
          '</div>' +
          '<br>' +
          '<div style="font-size: 15px;">' +
          '<p> Hola: ' + this.r.nombres.value + ', ' +
          'Como estas?' +
          '</p>' +
          '<hr>' +
          '<p> Muchas gracias por contactarnos: </p>' +
          '<hr>' +
          /*           '<p>Organizacion: ' + this.r.empresa.value + '  </p>' + */
          '<p>Telefono: ' + this.r.telefono.value + '  </p>' +
          '<p>Mensaje: ' + this.r.consulta.value + '  </p>' +
          '<hr>' +
          '<br>' +
          '<h1><a href="https://miapppro.com/' +
          '" target="_blank">miAppPRO.com' +
          '</a></h1>' +
          '<br>' +
          '<hr>' +
          '</div>' +
          '<br>' +
          '<div style = "background: linear-gradient(to right, #078d9c, #3697d8, #08c89f, #0d8002);' +
          '-webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px;' +
          'color: rgb(241, 243, 243); font-size: 15px; text-align: center;">' +
          '© Copyrights 2024 MiAppPRO All rights reserved.' +
          '</div> ' +
          '</div> ',
      },
    }
    this.emailServicio.crear(correo).then((respuesta: any) => {
      this.snackbar.open('Hola!, enviamos una copia de este mensaje a  tu correo...', 'OK', {
        duration: 10000
      });
      // this.actualizarUsuarios();
    });

  }

}
