import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditRecycleInfoPage } from './edit-recycle-info.page';

describe('EditRecycleInfoPage', () => {
  let component: EditRecycleInfoPage;
  let fixture: ComponentFixture<EditRecycleInfoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditRecycleInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
