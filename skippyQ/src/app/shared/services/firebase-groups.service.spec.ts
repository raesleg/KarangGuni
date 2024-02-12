import { TestBed } from '@angular/core/testing';

import { FirebaseGroupsService } from './firebase-groups.service';

describe('FirebaseGroupsService', () => {
  let service: FirebaseGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseGroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
