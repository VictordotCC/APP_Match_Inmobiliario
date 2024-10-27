import { TestBed } from '@angular/core/testing';

import { PreferenciaUsuarioService } from './preferencia-usuario.service';

describe('PreferenciaUsuarioService', () => {
  let service: PreferenciaUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreferenciaUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
