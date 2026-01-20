import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DayForecastItemComponent } from './day-forecast-item.component';

describe('DayForecastItemComponent', () => {
  let component: DayForecastItemComponent;
  let fixture: ComponentFixture<DayForecastItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DayForecastItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DayForecastItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
