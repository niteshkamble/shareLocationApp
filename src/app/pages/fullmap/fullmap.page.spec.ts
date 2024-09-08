import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FullmapPage } from './fullmap.page';

describe('FullmapPage', () => {
  let component: FullmapPage;
  let fixture: ComponentFixture<FullmapPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FullmapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
