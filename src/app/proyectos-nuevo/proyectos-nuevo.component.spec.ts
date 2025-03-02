import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosNuevoComponent } from './proyectos-nuevo.component';

describe('ProyectosNuevoComponent', () => {
  let component: ProyectosNuevoComponent;
  let fixture: ComponentFixture<ProyectosNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectosNuevoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectosNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
