import { Component, DestroyRef, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Storage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from '@angular/fire/storage';

import { AnuncioService } from '../../../servicios/anuncio.service';
import { SpinnerService } from '../../../sistema/spinner/spinner.service';
import { Anuncio } from '../../../modelos/anuncio';

type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

interface UploadItem {
  file: File;
  name: string;
  preview: string;
  progress: number;
  status: UploadStatus;
  error?: string;
  downloadURL?: string;
  storagePath?: string;
}

@Component({
  selector: 'app-anuncio-imagenes',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressBarModule,
  ],
  templateUrl: './anuncio-imagenes.html',
  styleUrl: './anuncio-imagenes.css',
})
export class AnuncioImagenes implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  idAnuncio: string | null = null;
  anuncioActual: Anuncio | null = null;

  fotosActuales: string[] = [];
  uploads: UploadItem[] = [];

  isDragOver = false;
  isLoadingFotos = false;

  readonly maxFileSizeBytes = 8 * 1024 * 1024; // 8MB

  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly title: Title,
    private readonly anuncioServicio: AnuncioService,
    private readonly snackbar: MatSnackBar,
    private readonly spinner: SpinnerService,
    private readonly storage: Storage,
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Imágenes del anuncio');
    this.idAnuncio = this.route.snapshot.paramMap.get('id');
    void this.cargarAnuncio();
  }

  ngOnDestroy(): void {
    this.uploads.forEach((upload) => {
      if (upload.preview) {
        URL.revokeObjectURL(upload.preview);
      }
    });
  }

  async cargarAnuncio(): Promise<void> {
    if (!this.idAnuncio) {
      this.snackbar.open('No se encontró el anuncio solicitado.', 'OK', { duration: 7000 });
      return;
    }

    this.isLoadingFotos = true;
    this.spinner.show('Cargando imágenes...');
    try {
      const anuncio = await this.anuncioServicio.obtenerPorId(this.idAnuncio);
      if (!anuncio) {
        this.snackbar.open('No encontramos datos del anuncio.', 'OK', { duration: 9000 });
        return;
      }
      this.anuncioActual = anuncio;
      this.fotosActuales = [...(anuncio.fotos ?? [])];
    } catch (error) {
      console.error('Error al cargar las imágenes del anuncio', error);
      this.snackbar.open('Ocurrió un problema al cargar las imágenes.', 'OK', { duration: 9000 });
    } finally {
      this.isLoadingFotos = false;
      this.spinner.hide();
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (!files?.length) {
      return;
    }
    this.procesarArchivos(Array.from(files));
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files?.length) {
      return;
    }
    this.procesarArchivos(Array.from(files));
    input.value = '';
  }

  abrirSelector(): void {
    this.fileInputRef?.nativeElement?.click();
  }

  async eliminarFoto(url: string): Promise<void> {
    if (!this.idAnuncio) {
      return;
    }

    const confirmar = window.confirm('¿Deseas eliminar esta imagen del anuncio?');
    if (!confirmar) {
      return;
    }

    this.spinner.show('Eliminando imagen...');
    try {
      const storagePath = this.obtenerRutaStorageDesdeUrl(url);
      if (storagePath) {
        try {
          await deleteObject(ref(this.storage, storagePath));
        } catch (error) {
          console.warn('No se pudo borrar el archivo en Storage: ', error);
        }
      }

      this.fotosActuales = this.fotosActuales.filter((foto) => foto !== url);
      await this.anuncioServicio.actualizar(this.idAnuncio, { fotos: this.fotosActuales });
      this.snackbar.open('Imagen eliminada correctamente.', 'OK', { duration: 6000 });
    } catch (error) {
      console.error('Error al eliminar imagen', error);
      this.snackbar.open('No pudimos eliminar la imagen. Intenta nuevamente.', 'OK', {
        duration: 9000,
      });
    } finally {
      this.spinner.hide();
    }
  }

  trackByFoto(_index: number, url: string): string {
    return url;
  }

  trackByUpload(_index: number, item: UploadItem): string {
    return item.storagePath ?? item.name;
  }

  private procesarArchivos(files: File[]): void {
    if (!this.idAnuncio) {
      this.snackbar.open('El anuncio no está listo para recibir imágenes.', 'OK', {
        duration: 7000,
      });
      return;
    }

    files.forEach((file) => {
      if (!this.esImagenValida(file)) {
        this.snackbar.open(`"${file.name}" no es un formato soportado.`, 'OK', { duration: 7000 });
        return;
      }
      if (file.size > this.maxFileSizeBytes) {
        const maxMB = this.maxFileSizeBytes / (1024 * 1024);
        this.snackbar.open(
          `"${file.name}" supera el tamaño permitido (${maxMB} MB).`,
          'OK',
          {
            duration: 9000,
          },
        );
        return;
      }

      this.iniciarSubida(file);
    });
  }

  private iniciarSubida(file: File): void {
    const preview = URL.createObjectURL(file);
    const upload: UploadItem = {
      file,
      name: file.name,
      preview,
      progress: 0,
      status: 'pending',
    };
    this.uploads = [...this.uploads, upload];

    const uniqueName = `${Date.now()}-${this.generarIdentificador()}-${file.name}`.replace(
      /\s+/g,
      '-',
    );
    const storagePath = `anuncios/${this.idAnuncio}/imagenes/${uniqueName}`;
    upload.storagePath = storagePath;
    upload.status = 'uploading';

    const storageRef = ref(this.storage, storagePath);
    const task = uploadBytesResumable(storageRef, file, { contentType: file.type });

    const unsubscribe = this.suscribirProgreso(task, upload);
    this.destroyRef.onDestroy(() => unsubscribe());
  }

  private suscribirProgreso(
    task: ReturnType<typeof uploadBytesResumable>,
    upload: UploadItem,
  ): () => void {
    return task.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        upload.progress = Math.round(progress);
      },
      (error) => {
        console.error('Error subiendo imagen', error);
        upload.status = 'error';
        upload.error =
          'No pudimos subir esta imagen. Verifica tu conexión e inténtalo nuevamente.';
        this.snackbar.open('Error subiendo una imagen.', 'OK', { duration: 8000 });
      },
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          upload.downloadURL = url;
          upload.status = 'success';
          await this.registrarFoto(url);
          this.snackbar.open('Imagen subida correctamente.', 'OK', { duration: 5000 });
        } catch (error) {
          console.error('Error obteniendo URL de descarga', error);
          upload.status = 'error';
          upload.error = 'La imagen se subió, pero no se pudo obtener su URL.';
        }
      },
    );
  }

  private async registrarFoto(url: string): Promise<void> {
    if (!this.idAnuncio) {
      return;
    }

    const fotosPrevias = [...this.fotosActuales];
    this.fotosActuales = [...this.fotosActuales, url];

    try {
      await this.anuncioServicio.actualizar(this.idAnuncio, { fotos: this.fotosActuales });
    } catch (error) {
      console.error('Error guardando URLs de imágenes', error);
      this.fotosActuales = fotosPrevias;
      this.snackbar.open('No pudimos guardar la imagen en el anuncio.', 'OK', { duration: 9000 });
    }
  }

  private esImagenValida(file: File): boolean {
    return file.type.startsWith('image/');
  }

  private generarIdentificador(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
  }

  private obtenerRutaStorageDesdeUrl(url: string): string | null {
    try {
      const parsed = new URL(url);
      const match = parsed.pathname.match(/\/o\/(.+)/);
      if (!match?.[1]) {
        return null;
      }
      const path = match[1].split('?')[0];
      return decodeURIComponent(path);
    } catch {
      return null;
    }
  }
}
