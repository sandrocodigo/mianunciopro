import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

// ANGULAR MATERIAL
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpinnerService } from '../../../sistema/spinner/spinner.service';
import { AnuncioService } from '../../../servicios/anuncio.service';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../../servicios/auth.service';

type AnuncioTabla = {
  id: string;
  categoria: string;
  categoria1: string;
  titulo?: string;
  estado?: string;
  raw: any;
};

@Component({
  selector: 'app-anuncio-lista',
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
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './anuncio-lista.html',
  styleUrl: './anuncio-lista.css'
})
export class AnuncioLista {

  usuario: any | null = null;

  listaAnuncios: MatTableDataSource<AnuncioTabla> = new MatTableDataSource<AnuncioTabla>([]);
  displayedColumns: string[] = ['categoria', 'categoria1', 'opciones'];

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private cargando: SpinnerService,
    private anuncioServicio: AnuncioService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private titleService: Title,
    private authServicio: AuthService,
  ) {

    this.authServicio.user$.subscribe((user) => {
      if (user) {
        this.usuario = user;
        this.obtenerConsulta();
      }
    });

  }

  obtenerConsulta() {
    this.cargando.show('Cargando anuncios...');
    this.anuncioServicio.obtenerPorUsuario(this.usuario.email).then((res: any) => {
      this.cargando.hide();
      console.log('ANUNCIOS: ', res);
/*       const mapped = (res ?? []).map((anuncio: any) => {
        const categoria = anuncio?.categoria ?? 'Sin categoría';
        const categoria1 =
          anuncio?.subcategoria ??
          anuncio?.titulo ??
          anuncio?.attrs?.tipoPropiedad ??
          'Sin detalle';
        return {
          id: anuncio?.id ?? '',
          categoria,
          categoria1,
          titulo: anuncio?.titulo,
          estado: anuncio?.estado,
          raw: anuncio,
        } satisfies AnuncioTabla;
      }); */
      this.listaAnuncios.data = res;
    }).catch((error: unknown) => {
      this.cargando.hide();
      console.error('Error al obtener anuncios', error);
      this.snackbar.open('No pudimos cargar tus anuncios. Intenta nuevamente.', 'OK', { duration: 10000, });
    });
  }

  verUbicacion(anuncio: AnuncioTabla): void {
    if (!anuncio?.id) {
      return;
    }
    this.router.navigate(['/administracion/anuncios/ubicacion', anuncio.id]);
  }

  editarDescripcion(anuncio: AnuncioTabla): void {
    if (!anuncio?.id) {
      return;
    }
    this.router.navigate(['/administracion/anuncios/descripcion', anuncio.id]);
  }
}
