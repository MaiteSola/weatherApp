import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HourlyForecastListComponent } from './hourly-forecast-list.component';

describe('HourlyForecastListComponent', () => {
  let component: HourlyForecastListComponent;
  let fixture: ComponentFixture<HourlyForecastListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HourlyForecastListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HourlyForecastListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
