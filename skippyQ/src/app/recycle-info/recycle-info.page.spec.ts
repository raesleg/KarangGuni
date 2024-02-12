import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecycleInfoPage } from './recycle-info.page';

describe('RecycleInfoPage', () => {
  let component: RecycleInfoPage;
  let fixture: ComponentFixture<RecycleInfoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RecycleInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
