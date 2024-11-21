import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InmueblePage } from './inmueble.page';

describe('InmueblePage', () => {
  let component: InmueblePage;
  let fixture: ComponentFixture<InmueblePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InmueblePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
