import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextSortPage } from './text-sort.page';

describe('TextSortPage', () => {
  let component: TextSortPage;
  let fixture: ComponentFixture<TextSortPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TextSortPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
