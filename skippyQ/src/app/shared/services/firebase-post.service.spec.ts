import { TestBed } from '@angular/core/testing';

import { FirebasePostService } from './firebase-post.service';

describe('FirebasePostService', () => {
  let service: FirebasePostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebasePostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
