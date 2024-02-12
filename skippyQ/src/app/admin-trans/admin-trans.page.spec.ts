import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminTransPage } from './admin-trans.page';

describe('AdminTransPage', () => {
  let component: AdminTransPage;
  let fixture: ComponentFixture<AdminTransPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminTransPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
