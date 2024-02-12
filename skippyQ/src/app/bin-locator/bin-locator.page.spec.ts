import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BinLocatorPage } from './bin-locator.page';

describe('BinLocatorPage', () => {
  let component: BinLocatorPage;
  let fixture: ComponentFixture<BinLocatorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BinLocatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
