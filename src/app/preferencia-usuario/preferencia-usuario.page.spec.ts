import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreferenciaUsuarioPage } from './preferencia-usuario.page';

describe('PreferenciaUsuarioPage', () => {
  let component: PreferenciaUsuarioPage;
  let fixture: ComponentFixture<PreferenciaUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenciaUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
