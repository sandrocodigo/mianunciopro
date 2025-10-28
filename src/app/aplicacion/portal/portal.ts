import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

// MATERIAL
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { UsuarioService } from '../servicios/usuario.service';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-portal',
  imports: [CommonModule, RouterModule, RouterOutlet, MatIconModule, MatButtonModule, MatDividerModule, MatMenuModule],
  templateUrl: './portal.html',
  styleUrl: './portal.css'
})
export class Portal {

  usuario: any | null = null;
  protected readonly currentYear = new Date().getFullYear();

  constructor(
    private authServicio: AuthService,
    private usuarioServicio: UsuarioService,
    public router: Router) {
    this.authServicio.user$.subscribe((user) => {
      if (user) {
        this.usuario = user;
        // this.foto = user.photoURL ? user.photoURL : 'imagenes/avatar.png';
        // console.log('USUARIO: ', this.usuario);

        /*         this.usuarioServicio.obtenerPorId(this.usuario.email).then((res: any) => {
                  this.usuarioDatos = res;
                }); */

        // console.log('USUARIO FOTO: ', this.foto);
      }
    });
  }


  salir() {
    this.authServicio
      .logout()
      .then(() => {
        localStorage.removeItem('usuarioEmail');
        localStorage.removeItem('usuarioAdmin');
        this.router.navigate(['/login']);
      })
      .catch((e) => console.log(e.message));
  }

}
