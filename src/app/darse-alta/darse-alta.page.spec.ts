import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DarseAltaPage } from './darse-alta.page';

describe('DarseAltaPage', () => {
  let component: DarseAltaPage;
  let fixture: ComponentFixture<DarseAltaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DarseAltaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
