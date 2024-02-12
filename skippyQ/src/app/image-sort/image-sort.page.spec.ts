import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageSortPage } from './image-sort.page';

describe('ImageSortPage', () => {
  let component: ImageSortPage;
  let fixture: ComponentFixture<ImageSortPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ImageSortPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
