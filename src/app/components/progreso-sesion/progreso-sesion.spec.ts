import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgresoSesion } from './progreso-sesion';

describe('ProgresoSesion', () => {
  let component: ProgresoSesion;
  let fixture: ComponentFixture<ProgresoSesion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgresoSesion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgresoSesion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
