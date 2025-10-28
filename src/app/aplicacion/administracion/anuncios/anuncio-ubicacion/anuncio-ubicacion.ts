import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';

import { AuthService } from '../../../servicios/auth.service';
import { SpinnerService } from '../../../sistema/spinner/spinner.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

import { AnuncioService } from '../../../servicios/anuncio.service';
import { Ubicacion } from '../../../modelos/anuncio';

declare const google: any;

type UbicacionFormGroup = FormGroup<{
  departamento: FormControl<string | null>;
  provincia: FormControl<string | null>;
  ciudad: FormControl<string | null>;
  zona: FormControl<string | null>;
  lat: FormControl<number | null>;
  lng: FormControl<number | null>;
  geohash: FormControl<string | null>;
}>;

type UbicacionFormValue = {
  departamento: string | null;
  provincia: string | null;
  ciudad: string | null;
  zona: string | null;
  lat: number | null;
  lng: number | null;
  geohash: string | null;
};

@Component({
  selector: 'app-anuncio-ubicacion',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSnackBarModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
  ],
  templateUrl: './anuncio-ubicacion.html',
  styleUrl: './anuncio-ubicacion.css',
})
export class AnuncioUbicacion implements OnInit, AfterViewInit, OnDestroy {
  private static googleMapsLoader: Promise<void> | null = null;

  idAnuncio: string | null;
  registroControl = false;
  registroFormGroup: FormGroup<{ ubicacion: UbicacionFormGroup }>;

  usuario: any | null = null;
  mapError = '';
  solicitandoGeolocalizacion = false;

  @ViewChild('mapContainer') mapContainerRef?: ElementRef<HTMLDivElement>;
  @ViewChild('searchInput') searchInputRef?: ElementRef<HTMLInputElement>;

  private readonly destroyRef = inject(DestroyRef);
  private readonly googleMapsApiKey: string;

  private map: any = null;
  private marker: any = null;
  private geocoder: any = null;
  private autocomplete: any = null;
  private initialUbicacion: Partial<Ubicacion> | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly ruta: ActivatedRoute,
    public readonly authServicio: AuthService,
    private readonly snackbar: MatSnackBar,
    private readonly cargando: SpinnerService,
    public readonly router: Router,
    private readonly titleService: Title,
    private readonly anuncioServicio: AnuncioService,
  ) {
    this.idAnuncio = this.ruta.snapshot.paramMap.get('id');
    this.googleMapsApiKey = this.resolveGoogleMapsApiKey();

    this.authServicio.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => (this.usuario = user));

    this.registroFormGroup = this.fb.group({
      ubicacion: this.fb.group({
        departamento: this.fb.control<string | null>(null, { validators: [Validators.required] }),
        provincia: this.fb.control<string | null>(null, { validators: [Validators.required] }),
        ciudad: this.fb.control<string | null>(null, { validators: [Validators.required] }),
        zona: this.fb.control<string | null>(null),
        lat: this.fb.control<number | null>(null, { validators: [Validators.required] }),
        lng: this.fb.control<number | null>(null, { validators: [Validators.required] }),
        geohash: this.fb.control<string | null>(''),
      }),
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Ubicación del anuncio');
    void this.cargarUbicacionInicial();
  }

  ngAfterViewInit(): void {
    void this.initMap();
  }

  ngOnDestroy(): void {
    if (this.autocomplete?.unbindAll) {
      this.autocomplete.unbindAll();
    }
  }

  onSubmit(): void {
    this.registroControl = true;
    this.registroFormGroup.markAllAsTouched();

    if (this.registroFormGroup.invalid) {
      this.snackbar.open('Oyeeeee! algun campo requieren tu atencion...', 'OK', {
        duration: 10000,
      });
      return;
    }

    const ubicacionGroup = this.registroFormGroup.controls.ubicacion;
    const ubicacion = ubicacionGroup.getRawValue();

    if (ubicacion.lat == null || ubicacion.lng == null) {
      this.snackbar.open('Selecciona una ubicación en el mapa para continuar.', 'OK', {
        duration: 8000,
      });
      return;
    }

    const geohash = this.encodeGeohash(ubicacion.lat, ubicacion.lng);
    ubicacionGroup.patchValue({ geohash });

    this.cargando.show('Guardando ubicación...');

    this.anuncioServicio
      .editar(this.idAnuncio, { ubicacion: ubicacionGroup.getRawValue() })
      .then(() => {
        this.snackbar.open('Super! Actualizacion con exito...', 'OK', { duration: 10000 });
        this.router.navigate(['/administracion/anuncios/descripcion/' + this.idAnuncio]);
      })
      .catch((error) => {
        console.error('Error al actualizar ubicación', error);
        this.snackbar.open('Ups! No pudimos guardar la ubicación. Intenta nuevamente.', 'OK', {
          duration: 10000,
        });
      })
      .finally(() => this.cargando.hide());
  }

  usarUbicacionActual(): void {
    if (!navigator.geolocation) {
      this.snackbar.open('Tu navegador no soporta geolocalización.', 'OK', { duration: 7000 });
      return;
    }

    this.solicitandoGeolocalizacion = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.solicitandoGeolocalizacion = false;
        const { latitude, longitude } = position.coords;
        this.updateLocationFromCoords(latitude, longitude, true);
      },
      (error) => {
        console.error('Error obteniendo geolocalización', error);
        this.solicitandoGeolocalizacion = false;
        this.snackbar.open('No pudimos obtener tu ubicación actual.', 'OK', { duration: 8000 });
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }

  private async cargarUbicacionInicial(): Promise<void> {
    if (!this.idAnuncio) {
      return;
    }

    try {
      this.cargando.show('Cargando ubicación...');
      const anuncio = await this.anuncioServicio.obtenerPorId(this.idAnuncio);
      if (!anuncio?.ubicacion) {
        return;
      }
      this.initialUbicacion = anuncio.ubicacion;
      this.patchUbicacion(anuncio.ubicacion);
      this.centerMapIfReady(anuncio.ubicacion);
    } catch (error) {
      console.error('Error al cargar la ubicación existente', error);
      this.snackbar.open('No pudimos cargar la ubicación actual del anuncio.', 'OK', {
        duration: 9000,
      });
    } finally {
      this.cargando.hide();
    }
  }

  private async initMap(): Promise<void> {
    const container = this.mapContainerRef?.nativeElement;
    if (!container) {
      return;
    }

    try {
      await this.loadGoogleMapsScript();
    } catch (error) {
      console.error('Error cargando Google Maps', error);
      this.mapError =
        'No se pudo cargar Google Maps. Revisa la clave de API o tu conexión a internet.';
      this.snackbar.open(this.mapError, 'OK', { duration: 8000 });
      return;
    }

    const initialCenter = this.getInitialCenter();
    this.map = new google.maps.Map(container, {
      center: initialCenter,
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    this.marker = new google.maps.Marker({
      map: this.map,
      position: initialCenter,
      draggable: true,
      visible: false,
    });

    this.geocoder = new google.maps.Geocoder();

    this.map.addListener('click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.updateLocationFromCoords(lat, lng, true);
    });

    this.marker.addListener('dragend', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.updateLocationFromCoords(lat, lng, true);
    });

    this.setupAutocomplete();

    if (this.initialUbicacion?.lat != null && this.initialUbicacion?.lng != null) {
      this.updateLocationFromCoords(this.initialUbicacion.lat, this.initialUbicacion.lng, false);
    }
  }

  private setupAutocomplete(): void {
    const input = this.searchInputRef?.nativeElement;
    if (!input || typeof google === 'undefined' || !google.maps?.places) {
      return;
    }

    this.autocomplete = new google.maps.places.Autocomplete(input, {
      fields: ['geometry', 'formatted_address', 'address_components'],
      componentRestrictions: { country: 'bo' },
    });

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      if (!place?.geometry?.location) {
        this.snackbar.open('Selecciona una dirección válida de la lista.', 'OK', {
          duration: 7000,
        });
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const parsed = this.parseAddressComponents(place.address_components ?? []);

      this.updateLocationFromCoords(lat, lng, false);
      this.patchUbicacion({
        ...parsed,
        lat,
        lng,
        geohash: this.encodeGeohash(lat, lng),
      });

      if (place.formatted_address) {
        input.value = place.formatted_address;
      }
    });
  }

  private updateLocationFromCoords(lat: number, lng: number, reverseGeocode: boolean): void {
    if (!this.map || !this.marker) {
      return;
    }

    const position = { lat, lng };
    this.marker.setVisible(true);
    this.marker.setPosition(position);
    this.map.panTo(position);
    this.map.setZoom(15);

    this.patchUbicacion({
      lat,
      lng,
      geohash: this.encodeGeohash(lat, lng),
    });

    if (reverseGeocode && this.geocoder) {
      this.geocoder.geocode({ location: position }, (results: any[], status: string) => {
        if (status !== 'OK' || !results?.length) {
          return;
        }
        const parsed = this.parseAddressComponents(results[0].address_components ?? []);
        this.patchUbicacion(parsed);
        const formatted = results[0].formatted_address;
        if (formatted && this.searchInputRef?.nativeElement) {
          this.searchInputRef.nativeElement.value = formatted;
        }
      });
    }
  }

  private centerMapIfReady(ubicacion: Partial<Ubicacion>): void {
    if (!this.map || ubicacion.lat == null || ubicacion.lng == null) {
      return;
    }
    const position = { lat: ubicacion.lat, lng: ubicacion.lng };
    this.map.setCenter(position);
    this.map.setZoom(15);
    if (this.marker) {
      this.marker.setVisible(true);
      this.marker.setPosition(position);
    }
  }

  private patchUbicacion(ubicacion: Partial<Ubicacion>): void {
    const group = this.registroFormGroup.controls.ubicacion;
    const updates: Partial<UbicacionFormValue> = {};

    if (ubicacion.departamento !== undefined) {
      updates.departamento = ubicacion.departamento ?? null;
    }
    if (ubicacion.provincia !== undefined) {
      updates.provincia = ubicacion.provincia ?? null;
    }
    if (ubicacion.ciudad !== undefined) {
      updates.ciudad = ubicacion.ciudad ?? null;
    }
    if (ubicacion.zona !== undefined) {
      updates.zona = ubicacion.zona ?? null;
    }
    if (ubicacion.lat !== undefined) {
      updates.lat = ubicacion.lat ?? null;
    }
    if (ubicacion.lng !== undefined) {
      updates.lng = ubicacion.lng ?? null;
    }
    if (ubicacion.geohash !== undefined) {
      updates.geohash = ubicacion.geohash ?? null;
    }

    group.patchValue(updates, { emitEvent: false });
  }

  private parseAddressComponents(components: any[]): Partial<Ubicacion> {
    const result: Partial<Ubicacion> = {};
    for (const component of components ?? []) {
      const types: string[] = component.types ?? [];
      if (types.includes('administrative_area_level_1')) {
        result.departamento = component.long_name;
      } else if (types.includes('administrative_area_level_2')) {
        result.provincia = component.long_name;
      } else if (types.includes('locality')) {
        result.ciudad = component.long_name;
      } else if (types.includes('administrative_area_level_3') && !result.ciudad) {
        result.ciudad = component.long_name;
      } else if (
        types.includes('sublocality') ||
        types.includes('sublocality_level_1') ||
        types.includes('neighborhood')
      ) {
        result.zona = component.long_name;
      }
    }
    return result;
  }

  private encodeGeohash(lat: number, lng: number, precision = 9): string {
    const base32 = '0123456789bcdefghjkmnpqrstuvwxyz';
    let geohash = '';
    let idx = 0;
    let bit = 0;
    let evenBit = true;
    let latMin = -90;
    let latMax = 90;
    let lngMin = -180;
    let lngMax = 180;

    while (geohash.length < precision) {
      if (evenBit) {
        const mid = (lngMin + lngMax) / 2;
        if (lng > mid) {
          idx = idx * 2 + 1;
          lngMin = mid;
        } else {
          idx = idx * 2;
          lngMax = mid;
        }
      } else {
        const mid = (latMin + latMax) / 2;
        if (lat > mid) {
          idx = idx * 2 + 1;
          latMin = mid;
        } else {
          idx = idx * 2;
          latMax = mid;
        }
      }

      evenBit = !evenBit;

      if (++bit === 5) {
        geohash += base32.charAt(idx);
        bit = 0;
        idx = 0;
      }
    }

    return geohash;
  }

  private getInitialCenter(): { lat: number; lng: number } {
    if (this.initialUbicacion?.lat != null && this.initialUbicacion?.lng != null) {
      return { lat: this.initialUbicacion.lat, lng: this.initialUbicacion.lng };
    }
    return { lat: -16.495545, lng: -68.133622 };
  }

  private resolveGoogleMapsApiKey(): string {
    const globalAny = globalThis as Record<string, any>;
    if (globalAny['NG_APP_GOOGLE_MAPS_API_KEY']) {
      return globalAny['NG_APP_GOOGLE_MAPS_API_KEY'];
    }
    if (globalAny['GOOGLE_MAPS_API_KEY']) {
      return globalAny['GOOGLE_MAPS_API_KEY'];
    }
    try {
      const env = (import.meta as any)?.env;
      if (env?.NG_APP_GOOGLE_MAPS_API_KEY) {
        return env.NG_APP_GOOGLE_MAPS_API_KEY;
      }
    } catch {
      // import.meta no disponible
    }
    return '';
  }

  private loadGoogleMapsScript(): Promise<void> {
    if (typeof google !== 'undefined' && google?.maps) {
      return Promise.resolve();
    }

    if (!this.googleMapsApiKey) {
      return Promise.reject(
        new Error(
          'Falta la clave de Google Maps. Define NG_APP_GOOGLE_MAPS_API_KEY o window.GOOGLE_MAPS_API_KEY.',
        ),
      );
    }

    if (!AnuncioUbicacion.googleMapsLoader) {
      AnuncioUbicacion.googleMapsLoader = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.googleMapsApiKey}&libraries=places&language=es`;
        script.async = true;
        script.defer = true;
        script.addEventListener('load', () => resolve());
        script.addEventListener('error', () =>
          reject(new Error('No se pudo cargar el script de Google Maps')),
        );
        document.head.appendChild(script);
      });
    }

    return AnuncioUbicacion.googleMapsLoader;
  }
}
