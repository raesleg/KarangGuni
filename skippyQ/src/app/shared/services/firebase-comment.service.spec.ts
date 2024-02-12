import { TestBed } from '@angular/core/testing';

import { FirebaseCommentService } from './firebase-comment.service';

describe('FirebaseCommentService', () => {
  let service: FirebaseCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseCommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
