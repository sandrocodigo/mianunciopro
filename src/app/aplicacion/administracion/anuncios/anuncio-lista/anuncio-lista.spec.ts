import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnuncioLista } from './anuncio-lista';

describe('AnuncioLista', () => {
  let component: AnuncioLista;
  let fixture: ComponentFixture<AnuncioLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnuncioLista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnuncioLista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
