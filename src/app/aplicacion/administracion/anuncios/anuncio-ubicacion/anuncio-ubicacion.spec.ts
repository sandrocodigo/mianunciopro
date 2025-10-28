import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AnuncioUbicacion } from './anuncio-ubicacion';
import { AuthService } from '../../../servicios/auth.service';
import { SpinnerService } from '../../../sistema/spinner/spinner.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AnuncioService } from '../../../servicios/anuncio.service';

class AuthServiceMock {
  user$ = of(null);
}

class SpinnerServiceMock {
  show(): void {}
  hide(): void {}
}

class MatSnackBarMock {
  open(): void {}
}

class RouterMock {
  navigate(): Promise<boolean> {
    return Promise.resolve(true);
  }
}

class TitleMock {
  setTitle(): void {}
}

class AnuncioServiceMock {
  obtenerPorId = jasmine.createSpy('obtenerPorId').and.resolveTo(null);
  editar = jasmine.createSpy('editar').and.resolveTo(void 0);
}

describe('AnuncioUbicacion', () => {
  let component: AnuncioUbicacion;
  let fixture: ComponentFixture<AnuncioUbicacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnuncioUbicacion],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: SpinnerService, useClass: SpinnerServiceMock },
        { provide: MatSnackBar, useClass: MatSnackBarMock },
        { provide: Router, useClass: RouterMock },
        { provide: Title, useClass: TitleMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: 'TEST-ID' }) } },
        },
        { provide: AnuncioService, useClass: AnuncioServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnuncioUbicacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
