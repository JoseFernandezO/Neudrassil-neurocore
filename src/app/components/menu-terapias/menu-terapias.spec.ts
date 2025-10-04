import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuTerapias } from './menu-terapias';

describe('MenuTerapias', () => {
  let component: MenuTerapias;
  let fixture: ComponentFixture<MenuTerapias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuTerapias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuTerapias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
