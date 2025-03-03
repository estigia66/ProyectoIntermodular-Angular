import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TecnologiasEditarComponent } from './tecnologias-editar.component';

describe('TecnologiasEditarComponent', () => {
  let component: TecnologiasEditarComponent;
  let fixture: ComponentFixture<TecnologiasEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TecnologiasEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TecnologiasEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
