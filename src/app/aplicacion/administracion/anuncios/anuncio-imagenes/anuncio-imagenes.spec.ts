import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs';

import { AnuncioImagenes } from './anuncio-imagenes';
import { AnuncioService } from '../../../servicios/anuncio.service';
import { SpinnerService } from '../../../sistema/spinner/spinner.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Storage } from '@angular/fire/storage';

class AnuncioServiceMock {
  obtenerPorId = jasmine.createSpy('obtenerPorId').and.resolveTo({
    id: 'TEST',
    fotos: [],
  });
  actualizar = jasmine.createSpy('actualizar').and.resolveTo(void 0);
}

class SpinnerServiceMock {
  show(): void {}
  hide(): void {}
}

class MatSnackBarMock {
  open(): void {}
}

class TitleMock {
  setTitle(): void {}
}

describe('AnuncioImagenes', () => {
  let component: AnuncioImagenes;
  let fixture: ComponentFixture<AnuncioImagenes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnuncioImagenes],
      providers: [
        { provide: AnuncioService, useClass: AnuncioServiceMock },
        { provide: SpinnerService, useClass: SpinnerServiceMock },
        { provide: MatSnackBar, useClass: MatSnackBarMock },
        { provide: Storage, useValue: {} },
        { provide: Title, useClass: TitleMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: 'TEST-ID' }) },
            paramMap: of(convertToParamMap({ id: 'TEST-ID' })),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnuncioImagenes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
