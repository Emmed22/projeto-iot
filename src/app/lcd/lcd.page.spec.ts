import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LcdPage } from './lcd.page';

describe('LcdPage', () => {
  let component: LcdPage;
  let fixture: ComponentFixture<LcdPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LcdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
