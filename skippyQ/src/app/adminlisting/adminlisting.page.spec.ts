import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminlistingPage } from './adminlisting.page';

describe('AdminlistingPage', () => {
  let component: AdminlistingPage;
  let fixture: ComponentFixture<AdminlistingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminlistingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
