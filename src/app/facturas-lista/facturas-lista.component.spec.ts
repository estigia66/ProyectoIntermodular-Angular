import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasListaComponent } from './facturas-lista.component';

describe('FacturasListaComponent', () => {
  let component: FacturasListaComponent;
  let fixture: ComponentFixture<FacturasListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturasListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturasListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
