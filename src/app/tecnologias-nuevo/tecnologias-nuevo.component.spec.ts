import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TecnologiasNuevoComponent } from './tecnologias-nuevo.component';

describe('TecnologiasNuevoComponent', () => {
  let component: TecnologiasNuevoComponent;
  let fixture: ComponentFixture<TecnologiasNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TecnologiasNuevoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TecnologiasNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
