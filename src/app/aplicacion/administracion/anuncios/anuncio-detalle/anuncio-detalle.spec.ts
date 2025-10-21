import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnuncioDetalle } from './anuncio-detalle';

describe('AnuncioDetalle', () => {
  let component: AnuncioDetalle;
  let fixture: ComponentFixture<AnuncioDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnuncioDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnuncioDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
