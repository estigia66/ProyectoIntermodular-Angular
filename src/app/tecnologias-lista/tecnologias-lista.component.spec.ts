import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TecnologiasListaComponent } from './tecnologias-lista.component';

describe('TecnologiasListaComponent', () => {
  let component: TecnologiasListaComponent;
  let fixture: ComponentFixture<TecnologiasListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TecnologiasListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TecnologiasListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
