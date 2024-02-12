import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ViewGroupPage } from './view-group.page';

describe('ViewGroupPage', () => {
  let component: ViewGroupPage;
  let fixture: ComponentFixture<ViewGroupPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewGroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
