import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnuncioForm } from './anuncio-form';

describe('AnuncioForm', () => {
  let component: AnuncioForm;
  let fixture: ComponentFixture<AnuncioForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnuncioForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnuncioForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
