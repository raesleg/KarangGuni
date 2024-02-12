import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecycleExamplesPage } from './recycle-examples.page';

describe('RecycleExamplesPage', () => {
  let component: RecycleExamplesPage;
  let fixture: ComponentFixture<RecycleExamplesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RecycleExamplesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
