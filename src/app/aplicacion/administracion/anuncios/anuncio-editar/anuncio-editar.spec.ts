import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnuncioEditar } from './anuncio-editar';

describe('AnuncioEditar', () => {
  let component: AnuncioEditar;
  let fixture: ComponentFixture<AnuncioEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnuncioEditar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnuncioEditar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
