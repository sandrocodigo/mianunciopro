import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnuncioUbicacion } from './anuncio-ubicacion';

describe('AnuncioUbicacion', () => {
  let component: AnuncioUbicacion;
  let fixture: ComponentFixture<AnuncioUbicacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnuncioUbicacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnuncioUbicacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
