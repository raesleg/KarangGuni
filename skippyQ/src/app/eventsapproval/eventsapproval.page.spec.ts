import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsapprovalPage } from './eventsapproval.page';

describe('EventsapprovalPage', () => {
  let component: EventsapprovalPage;
  let fixture: ComponentFixture<EventsapprovalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EventsapprovalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
