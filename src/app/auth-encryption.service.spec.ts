import { TestBed } from '@angular/core/testing';

import { AuthEncryptionService } from './auth-encryption.service';

describe('AuthEncryptionService', () => {
  let service: AuthEncryptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthEncryptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
