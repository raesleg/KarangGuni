import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WasteSorterPage } from './waste-sorter.page';

describe('WasteSorterPage', () => {
  let component: WasteSorterPage;
  let fixture: ComponentFixture<WasteSorterPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WasteSorterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
