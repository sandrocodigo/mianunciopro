import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnuncioDescripcion } from './anuncio-descripcion';

describe('AnuncioDescripcion', () => {
  let component: AnuncioDescripcion;
  let fixture: ComponentFixture<AnuncioDescripcion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnuncioDescripcion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnuncioDescripcion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
