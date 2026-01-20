import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TemperatureDisplayComponent } from './temperature-display.component';

describe('TemperatureDisplayComponent', () => {
  let component: TemperatureDisplayComponent;
  let fixture: ComponentFixture<TemperatureDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TemperatureDisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TemperatureDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
